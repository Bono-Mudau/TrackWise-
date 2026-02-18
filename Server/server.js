const express=require("express");
const app=express();
const path = require("path");
require('dotenv').config();
const auth_routes=require("./APIs/routes/auth_routes");
const expense_routes=require("./APIs/routes/expense_routes");
const income_routes=require("./APIs/routes/income_routes")

app.use(express.json());
app.use(express.static(path.join(__dirname,"../Client")));
app.use("/api/auth",auth_routes);
app.use("/api/expenses",expense_routes);
app.use("/api/income",income_routes);

app.get("/", (req, res) => {
    res.sendFile("login_signup.html", { root: path.join(__dirname, "../Client") });
});


//Start the server
app.listen(3000,()=>{
    console.log("The server is listening on port 3000")
});










/*
//CREATE USER ACCOUNT
app.post("/signup",async (req,res)=>{
    const {name,email,password} =req.body;
    //Check if the email is already used for a different account
    db.query("Select * from users where email=?",[email],(err,rows)=>{
        if(rows.length>0){
            res.json({
                user:false,
                reason:"Account with this email address already exist,please proceed to log in page"
            })
        }
    });
    
    //Hash password using bcrypt before sending it to the database
    const hashed_password= await bcrypt.hash(password,10);
    db.query("insert into users (name,email,password) values(?,?,?)",[name,email,hashed_password], (err,results)=>{
        if(err){
           return res.json({ user:false,
            reason:"Unable to create an account, please try again later"
           });
        }else{
            res.json({
              user:true
            });
        }
    });
});

//LOGIN
app.post("/login/",(req,res)=>{
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
                res.json({
                    name:results[0].name,
                    id:results[0].user_id,
                    user:true
                })
            }
            else{
                res.json({user:false})
            }
        }
        else{
            res.json({
            user:false
           })
        }

    });
})
//DELETE EXPENSE ENTRY
app.post("/delete_exp",(req,res)=>{
    const {id}=req.body;
    const sql="delete from expenses where exp_id=?;"
     db.query(sql,[id],(err,results)=>{
        if(err){
            console.log("did not delete")
            res.status(500).json();
        }
        res.json({response:true,
            id: results.insertId
        })
     })
});

//LOAD USER EXPENSES
app.get("/load_all_expense",(req,res)=>{
    const user_id=req.query.user_id;
    db.query("select exp_id,date_created, description, category, amount, status from expenses where user_id=?",[user_id],(err,rows)=>{
        if(err){
            return res.status(500).json();
        }
        return res.json(rows);
    })
})

//ADD EXPENSE ENTRIES TO THE DB
app.post("/new_expense",(req,res)=>{
    const {date,description,category,amount,status,user_id}=req.body;
    const sql="insert into expenses (date_created, description, category, amount, status, user_id) values (?,?,?,?,?,?)"
     console.log("Inserting expense:", { date, description, category, amount, status, user_id });

    db.query(sql,[date,description,category,amount,status,user_id],(err,results)=>{
        if(err){
            console.log("Error insertinga data") 
             return res.status(500).json({ status: false, error: err.message });
        }
        else{
          res.json({ status: true, id: results.insertId });
        }
    }) 
})
//ADD INCOME ENTRY TO THE BD
app.post("/new_income",(req,res)=>{
    const {category,amount,user_id}=req.body;
    console.log(req.body)
    db.query("insert  into income (category,amount,user_id) values(?,?,?)",[category,amount,user_id],(err,results)=>{
        if(err){
            return res.status(500).json();
        }
        else{
            res.json({response:true})
        }
    })
});

//Delete income entry 
app.post("/delete_income",(req,res)=>{
    const {id}=req.body;
    db.query=("delete from income where income_id=?",[id],(err,results)=>{
        if(err){
            res.json({response:false});
        }else{
            res.json({respose:true});
        }
    })

});

*/                 
