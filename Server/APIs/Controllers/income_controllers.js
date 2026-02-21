
const db = require("../config/db_config");
const new_income=async (req,res)=>{
    const {category,amount,user_id}=req.body;
    db.query("insert  into income (category,amount,user_id) values(?,?,?)",[category,amount,user_id],(err,results)=>{
        if(err){
            return res.status(500).json();
        }
        else{
            return res.json({response:true,id:results.insertId})
        }
    })
};

const delete_income=async (req,res)=>{
    const {id}=req.body;
    let amount=0;
    
    db.query("select amount from income where income_id=?",[id],(err,results)=>{
        amount=results.amount;
    })

    db.query("delete from income where income_id=?",[id],(err,results)=>{
        if(err){
            return res.json({response:false});
        }else{
           return res.json({response:true});

        }
    })

};

const load_income=async (req,res)=>{
    const {id}=req.body;
    db.query("select income_id,category,amount,date from income where user_id=?",[id],async(err,row)=>{
        if(err){
            return res.json({bool:false})
        }else{
            return res.json(row);
        }
    })
};

const update_income=async (req,res)=>{
    const {income_id,category, amount}=req.body;
    const sql="update income set category=?,amount=? where income_id=?";
    db.query(sql,[category,amount,income_id], async (err, data)=>{
        if(err){
            return res.status(500).json({response:false, reason:"db_err"});
        }
        else{
            return res.json({response:true});
        }
    })

} 

module.exports={
    new_income,
    delete_income,
    load_income,
    update_income
}