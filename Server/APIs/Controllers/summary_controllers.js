const e = require("express");
const db = require("../config/db_config");

const load_balances= async (req,res)=>{

    const {user_id}=req.body;
    console.log("Received user_id:", user_id);
    if (!user_id) {
        return res.status(400).json({ response: false, reason: "No user_id provided" });
    }

    db.query("select ifnull((select sum(amount) from income where user_id=?),0) as total_income, ifnull((select sum(amount) from expenses where user_id=?),0) as total_expense",[user_id,user_id],(errr,ans)=>{
        if(errr){
            console.error("DB query error:", errr);
            return res.status(500).json({response:false})
        }
        console.log(ans[0])
        return res.json({
            response:true,
            income:ans[0].total_income,
            expenses:ans[0].total_expense,
            balance:ans[0].total_income - ans[0].total_expense
        });

    })
}

const recent_trans = async (req,res)=>{

    const {user_id} = req.body;
    if (!user_id) {
        return res.status(400).json({ response: false, reason: "No user_id provided" });
    }

    const sql= "select * from (select income_id as id,date,category,amount ,'income' as type from income where user_id=? union all select exp_id as id,date_created ,category,amount ,'expense' as type from expenses where user_id=?) as entry order by date  desc limit 8"

    db.query(sql,  [user_id,user_id], (err,rows)=>{
        if(err){
            console.log(err);
            return res.status(500).json({response:false , reason:"DB_err"})
        }
        console.log("Fetching recent transactions for user_id:", user_id);
        console.log(rows)
        return res.json({
            response:true,
            recent_transactions:rows})
    });
    
}

module.exports={
    load_balances,
    recent_trans
}
