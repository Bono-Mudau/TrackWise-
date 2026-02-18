const db = require("../config/db_config");
const bcrypt = require("bcrypt");


const signup=async (req,res)=>{
    const {name,email,password} =req.body;
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
            db.query("insert into users (name,email,password) values(?,?,?)",[name,email,hashed_password], (err,results)=>{
                if(err){
                    return res.json({ 
                        user:false,
                        reason:"Unable to create an account, please try again later"
                    });
            }else{
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
            return ;
        }
        if(results.length>0){

            //compare user_entered password and the actual password
            const auth=await bcrypt.compare(password,results[0].password); 
            if(auth){
                return res.json({
                    name:results[0].name,
                    id:results[0].user_id,
                    user:true
                })
            }
            else{
                return res.json({user:false})
            }
        }
        else{
            return res.json({ user:false })
        }

    });
}

//export the functions
module.exports={
    login,
    signup
}