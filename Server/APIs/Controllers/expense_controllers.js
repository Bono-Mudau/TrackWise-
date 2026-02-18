const db = require("../config/db_config");
const new_expense= async (req,res)=>{
    const {date,description,category,amount,status,user_id}=req.body;
    const sql="insert into expenses (date_created, description, category, amount, status, user_id) values (?,?,?,?,?,?)"
     console.log("Inserting expense:", { date, description, category, amount, status, user_id });

    db.query(sql,[date,description,category,amount,status,user_id],(err,results)=>{
        if(err){
            console.log("Error insertinga data") 
            return res.status(500).json({ status: false, error: err.message });
        }
        else{
          return res.json({ status: true, id: results.insertId });
        }
    }) 
};

const load_expenses= async (req,res)=>{
    const user_id=req.query.user_id;
    db.query("select exp_id,date_created, description, category, amount, status from expenses where user_id=?",[user_id],(err,rows)=>{
        if(err){
            return res.status(500).json();
        }
        return res.json(rows);
    })
};

const delete_expense=async (req,res)=>{
    const {id}=req.body;
    const sql="delete from expenses where exp_id=?;"
     db.query(sql,[id],(err,results)=>{
        if(err){
            console.log("did not delete")
            return res.status(500).json();
        }
        return res.json({response:true,
              id: results.insertId
            })
     })
};

module.exports={
    new_expense,
    load_expenses,
    delete_expense
}

