const db = require("../config/db_config");
const bcrypt = require("bcrypt");
const {sendEmail}=require("../services/mail/mailer");
const {accountCreatedTemplate,otpTemplate}=require("../services/mail/mail_templates");
const {generate_OTP}=require("../services/mail/otp");

const signup=async (req,res)=>{
    const {names,email,password} =req.body;
    //Check if the email is already used for a different account
    db.query("Select * from users where email=?",[email],async (err,rows)=>{
        if(rows.length>0){
            return res.json({
                user:false,
                reason:"Account with this email address already exist,please proceed to log in page"
            })
        }

        //Hash password using bcrypt before sending it to the database
        try {
            const hashed_password= await bcrypt.hash(password,10);
            db.query("insert into users (name,email,password) values(?,?,?)",[names,email,hashed_password],  async(err,results)=>{
            if(err){
                return res.json({ 
                    user:false,
                    reason:"Unable to create an account, please try again later"
                });
            }else{
                const id=results.insertId;
                db.query("insert into overview (user_id) values(?)",[id],async (er, ans)=>{
                })
                try {
                    await sendEmail({to:email,subject:"Account created",hml:accountCreatedTemplate(names)});
                } catch (error) {
                    
                }
                return res.json({user:true});
                
            }
        });    
        } catch (error) {
            return res.json({user:false,
                reason:"Unexpeccted error has occured"
            }) 
        }
    });
}


const login=async (req,res)=>{
    const {email,password}=req.body;
    db.query("select user_id,name,password from users where email=?",[email],async (err, results)=>{
        if(err){
              console.error("Database query error:", err);
            console.log("Error occured while verifying the user")
            return res.status(500).json({user:false, reason:"Error logging in, try again later"}) ;
        }
        if(results.length>0){
            //compare user_entered password and the actual password
            try {
                const auth=await bcrypt.compare(password,results[0].password)
                if(auth){
                    return res.json({
                        name:results[0].name,
                        id:results[0].user_id,
                        user:true
                    })
                }
                else{
                    return res.json({user:false , reason:"Incorrect login credentials"})
                } 
            } catch (error) {               
                
            }
        }  
        else{
            return res.json({ user:false , reason:"unknown error" })
        }

    });
}


const send_otp=async (req,res)=>{

    const {email}=req.body;

    const otp=generate_OTP();
    const html=otpTemplate(otp);
    const subject="OTP";
    const expiry_time = new Date(Date.now() + 5 * 60 * 1000);

    db.query("DELETE FROM OTP WHERE email = ?", [email],async (deleteErr,results)=>{

        if (deleteErr) {
                console.error(deleteErr);
                return res.status(500).json({ response: false });
            }
        db.query("insert  into OTP (email,otp,expiry_time) values (?,?,?) ",[email,otp,expiry_time],async (err,row)=>{

            if(err){
                return res.status(500).json({response:false});
            }
            try {

                await sendEmail({to:email,subject,html});
                return res.json({response:true})
             
            } 
            catch (error) {

                return res.json({response:false})
                
            }
        })     
    });

    
}
const verify_email=async (req,res)=>{
    const {email,otp}=req.body;
    console.log(email+":"+otp);
    const sql="select otp,expiry_time from OTP where email=? and otp=?";
    db.query(sql,[email,otp],async (err,row)=>{
        if(err){
           return  res.status(500).json({response:false, reason:"DB_RR"});
        }
        else{
            if(row.length>0 ){
                //check if the OTP has expired
                const now=new Date();
                const expiry_date=new Date(row[0].expiry_time);
                if(now>expiry_date){
                    return res.json({response:false , reason:"OTP expired!!"});
                }
                return res.json({response:true})
            }
            return res.json({response:false,reason: "Incorrect OTP!!"});
        }
    })
};

//export the functions
module.exports={
    send_otp,
    login,
    signup,
    verify_email
}