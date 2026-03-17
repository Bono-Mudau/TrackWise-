
const { response } = require("express");
const db = require("../config/db_config");

const load_balances= async (req,res)=>{

    const {user_id}=req.body;
    if (!user_id) {
        return res.status(400).json({ response: false, reason: "No user_id provided" });
    }

    db.query("select ifnull((select sum(amount) from income where month(date)=month(curdate()) and year(date)=year(curdate()) and user_id=?),0) as total_income, ifnull((select sum(amount) from expenses where month(date_created)=month(curdate()) and year(date_created)=year(curdate())  user_id=?),0) as total_expense",[user_id,user_id],(errr,ans)=>{
        if(errr){
            console.error("DB query error:", errr);
            return res.status(500).json({response:false})
        }
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
        return res.json({
            response:true,
            recent_transactions:rows})
    });
 
}

const expenses_pie_chart= async (req,res)=>{
    try {

        const {id}=req.body;
        const sql="select category, sum(amount) as total from expenses where user_id=? and month(date_created)= month(curdate()) and year(date_created)=year(curdate()) group by category"
        const [rows]= await db.promise().query(sql,[id]);

        return res.json({response:true, data:rows})
        
    } catch (error) {

        return res.status(500).json({ response:false, reason:error.message})
        
    }
}

const income_pie_chart= async (req,res)=>{
    try {
        
        const {id}=req.body;
        const sql="select category, sum(amount) as total from income where user_id=? and month(date)= month(curdate()) and year(date)=year(curdate()) group by category"
        const [rows]= await db.promise().query(sql,[id]);

        return res.json({response:true, data:rows})
        
    } catch (error) {

        return res.status(500).json({ response:false, reason:error.message})
        
    }
}

const monthly_summary=async (req,res)=>{

    const {id}= req.body;
    const sql="Select income,expense,month,year from monthly_summary where user_id=? order by year DESC, month DESC limit 5" ;

    db.query(sql, [id], (err, row)=>{
        if(err){
            return res.status(500).json({response:false , error: err.message})
        }
        return res.json({
            response:true,
            data:row.reverse()
        })
    })
}
module.exports={
    load_balances,
    recent_trans,
    monthly_summary,
    income_pie_chart,
    expenses_pie_chart
}
