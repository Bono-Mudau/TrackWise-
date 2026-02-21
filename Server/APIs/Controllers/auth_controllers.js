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
                const id=results.insertId;
                db.query("insert into overview (user_id) values(?)",[id],async (er, ans)=>{
                })
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

//export the functions
module.exports={
    login,
    signup
}