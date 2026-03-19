const db = require("../config/db_config");
const bcrypt = require("bcrypt");
const {sendEmail}=require("../services/mail/mailer");
const {accountCreatedTemplate,otpTemplate,ChangedPasswordTemplate}=require("../services/mail/mail_templates");
const {generate_OTP}=require("../services/mail/otp");
const {generate_Token}=require("../middleware/verify_token");
const { response } = require("express");

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

                await db.promise().query("INSERT INTO settings (email,user_id,firstName) VALUES (?, ?,?)",[email,id,names]);
                try {
                    await sendEmail({to:email,subject:"Account created",html:accountCreatedTemplate(names)});
                } 
                catch (error) { 
                        
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
            console.log("Error occured while verifying the user")
            return res.status(500).json({user:false, reason:"Error logging in, try again later"}) ;
        }
        if(results.length>0){
            //compare user_entered password and the actual password
            try {
                const auth=await bcrypt.compare(password,results[0].password)
                if(auth){
                    const token= generate_Token(results[0].user_id);
                    res.cookie("token", token, 
                        { httpOnly: true, 
                        secure: true, 
                        sameSite: "Strict",
                        maxAge: 10 * 60 * 1000 });

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
                console.error("Error comparing passwords:", error);
                return res.status(500).json({ user: false, reason: "Server error" })              
                
            }
        }  
        else{
            return res.json({ user:false , reason:"User not found!" })
        }

    });
}


const send_otp=async (req,res)=>{

    const {email}=req.body;

    const otp=generate_OTP();
    const html=otpTemplate(otp);
    const subject="OTP";
    const expiry_time = new Date(Date.now() + 5 * 60 * 1000);

    db.query("DELETE FROM otp WHERE email = ?", [email],async (deleteErr,results)=>{

        if (deleteErr) {
                console.error(deleteErr);
                return res.status(500).json({ response: false });
            }
        db.query("insert  into otp (email,otp,expiry_time) values (?,?,?) ",[email,otp,expiry_time],async (err,row)=>{

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
    const sql="select otp,expiry_time from otp where email=? and otp=?";

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

const reset_password=async (req,res)=>{

    const {email, password}=req.body;
    const sql="update users set password=? where email=? ";
    const to=email;
    const subject="Password Changed!";
    const html=ChangedPasswordTemplate()

    try {

        const hashed_password= await bcrypt.hash(password,10);
        db.query(sql,[hashed_password,email],async (err,data)=>{

            if(err){

                return res.status(500).json({ response:false });
            }
            else{
                await sendEmail({to,subject,html})
                return res.json({response:true});
            }
            
        })
    } catch (error) {
        console.log(error);
        return res.json({response:false});
        
    } 

}
 const log_out=async (req,res)=>{
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: "Strict"
        });
        return res.json({response:"Logged out successfully"});
    }

const delete_account= async (req,res) => {

    if (!req.user) {
        return res.status(401).json({ response: false });
    }
    const connection = await db.promise().getConnection();
    try {
        const id = req.user.username;
        await connection.beginTransaction();

        await connection.query("DELETE FROM expenses WHERE user_id=?", [id]);
        await connection.query("DELETE FROM income WHERE user_id=?", [id]);
        await connection.query("DELETE FROM monthly_summary WHERE user_id=?", [id]);
        await connection.query("DELETE FROM users WHERE user_id=?", [id]);

        await connection.commit();

        return res.json({ response: true });

    } catch (error) {
        await connection.rollback();
        console.log(error);
        return res.status(500).json({ response: false });

    } finally {
        connection.release();
    }
};
const load_settings=async (req,res)=>{

     if (!req.user) {
        return res.status(409).json({ response: false });
    }
    const id=req.user.username;
    try {
        const sql="select email,firstName,lastName,notifications_status,payment_remainder,overdue_expenses,budget_limit from settings where user_id=?";
        const [rows]= await db.promise().query(sql,[id]);
        if(rows.length==0){
            
            return res.json({ response: false });
        }

        return res.json({
            response:true,
            data:rows[0]
        });

        
    } catch (error) {
        console.log(error)
        return res.status(500).json({response:false, reason:error})
        
    }


}

const update_settings= async (req,res)=>{
    if (!req.user) {
        return res.status(401).json({ response: false });
    }
    const id=req.user.username;
    const {f_name,l_name,notification_on,p_remainders,overdue,limit}=req.body;
    try {
        const sql="update settings set firstName=?, lastName=?,notifications_status=?,payment_remainder=?,overdue_expenses=?,budget_limit=? where user_id=?";
        await db.promise().query(sql,[f_name,l_name,notification_on,p_remainders,overdue,limit,id]);
        await db.promise().query("update users set name=? where user_id=?",[f_name,id]);
        return res.json({
            response:true,
        });
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({response:false, reason:error})
        
    }

}

//export the functions
module.exports={
    send_otp,
    login,
    signup,
    verify_email,
    reset_password,
    log_out,
    delete_account,
    load_settings,
    update_settings
}