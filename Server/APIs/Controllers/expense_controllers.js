
const db = require("../config/db_config");
const new_expense= async (req,res)=>{
    const {date,description,category,amount,status,user_id}=req.body;
    const sql="insert into expenses (date_created, description, category, amount, status, user_id) values (?,?,?,?,?,?)"

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
            return res.status(500).json({response:false});
        }
        if (results.affectedRows === 0) {
            return res.json({ response: false });
        }
        return res.json({response:true})
     })
};

const update_expense= async (req,res)=>{
    const { expense_id, description, category,amount, status}=req.body;

    //retrive the previous value
    let prev_val=0;
    let year=0;
    let month=0;

    db.query("select amount,month(date_created) as month,year(date_created) as year, user_id from expenses where exp_id=?",[expense_id],(err,row)=>{
        if(err){
            return res.status(500).json({response:false});

        }
        prev_val=row[0].amount;
        year=row[0].year; 
        month=row[0].month 
        const new_amount=amount-prev_val;
        const user_id=row[0].user_id;
        const sql="update expenses set description=?,category=?,amount=?,status=? where exp_id=?"
        db.query(sql,[ description, category,amount, status,expense_id], (err,results)=>{
            if(err){
                return res.status(500).json({response:false});
            }
            db.query("update monthly_summary set expense=expense+? where year=? and month=? and user_id=?",[new_amount,year,month,user_id], (error,ans)=>{
                if(error){
                    console.log("error updating summary")
                }
            })
            return res.json({response:true})
        });
        })
    
};

module.exports={
    new_expense,
    load_expenses,
    delete_expense,
    update_expense
}

