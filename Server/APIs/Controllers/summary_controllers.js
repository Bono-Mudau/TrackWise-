
const { response } = require("express");
const db = require("../config/db_config");

const load_balances= async (req,res)=>{

    const {user_id}=req.body;
    if (!user_id) {
        return res.status(400).json({ response: false, reason: "No user_id provided" });
    }

    db.query("select ifnull((select sum(amount) from income where month(date)=month(curdate()) and year(date)=year(curdate()) and user_id=?),0) as total_income, ifnull((select sum(amount) from expenses where month(date_created)=month(curdate()) and year(date_created)=year(curdate()) and  user_id=?),0) as total_expense",[user_id,user_id],(errr,ans)=>{
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

const summary= async (req,res)=>{

    try {

        const id=req.user.username;

        if(!id){

            return res.status(501).json({response:false})
        }
        const [months]= await db.promise().query("Select income,expense,month,year from monthly_summary where user_id=? order by year DESC, month DESC limit 6",[id]);
         
        let array=[];

        for(const month of months){

            if(month.expense==0){
                array.push({
                    month:month.month,
                    year:month.year,
                    income:month.income,
                    expense:month.expense,
                    amount:0,
                    description:""
                })
                continue;
            }
            const sql="select amount,description from expenses where amount = (select max(amount) from expenses where user_id = ? and month(date_created) = ? and year(date_created) = ? ) and month(date_created) = ? and year(date_created) = ? and user_id = ? limit 1"
            const [rows]= await db.promise().query( sql, [id,  month.month, month.year, month.month, month.year, id]);
            if(rows.length==0){

                array.push({
                    month:month.month,
                    year:month.year,
                    income:month.income,
                    expense:month.expense,
                    amount:0,
                    description:""
                })
                continue;
                
            }

            const data={

                month:month.month,
                year:month.year,
                income:month.income,
                expense:month.expense,
                amount:rows[0].amount,
                description:rows[0].description
            }
            array.push(data);

         }

         return res.json({response:true, data:array});

    } catch (error) {

        return res.status(500).json({response:false});

        
    }
}

const recurring_income_expenses= async (req,res)=>{

    const user_id=req.user.username;
    try {

        const [income]= await db.promise().query("select id,category,amount from recurringIncome where user_id=?",[user_id]);
        const [expense] = await db.promise().query("select id, description, category, amount, due_date from recurringExpenses where user_id=?",[user_id]);
        
        return res.json({response:true, expense:expense, income:income});
        
    } catch (error) {
        return res.status(500).json({response:false});
    }

}

module.exports={
    load_balances,
    recent_trans,
    monthly_summary,
    income_pie_chart,
    expenses_pie_chart,
    summary,
    recurring_income_expenses
}
