
const db = require("../config/db_config");

const new_expense= async (req,res)=>{

    try {
        const {date,description,category,amount,status,user_id}=req.body;
        const sql="insert into expenses (date_created, description, category, amount, status, user_id) values (?,?,?,?,?,?)"

        //insert new expense
        const [results] = await db.query(sql,[date,description,category,amount,status,user_id]);

        const now = new Date();
        const year = now.getFullYear();   
        const month = now.getMonth() + 1;
        
        //Update monthly summary
         await db.query("insert into monthly_summary (expense,user_id,year,month) values(?,?,?,?) on duplicate key update  expense=expense+values(expense) ",[
                       amount,
                       user_id,
                       year,
                       month]);
        return res.json({ status: true, id: results.insertId });
     
    } catch (error) {

        console.log("error has occured"+error);
        return res.status(500).json({ response:false, reason:error.message});  
    }

};

const load_expenses= async (req,res)=>{

    const user_id=req.query.user_id;
    try {
       
        const [rows]= await db.query("select exp_id,date_created, description, category, amount, status from expenses where user_id=?",[user_id])
        return res.json(rows)
        
    } catch (error) {

        console.log
        return res.status(500).json({error:"Failed to load expenses"})   
    }
};


const delete_expense= async (req,res)=>{
    

    try {

        const {id}=req.body;
        const sql="delete from expenses where exp_id=?";

        //retrieve expense details 
        const [results]= await db.query("select user_id,month(date_created) as month,year(date_created) as year,amount from expenses where exp_id=?", [id]);

        if(results.length==0){
            return res.status(404).json({response: false, reason: "Expense not found" })
        }

        //delete expense
        await db.query(sql,[id]);

        //update monthly summary
        await db.query("update monthly_summary set expense = greatest(expense - ?,0) where user_id=? and year=? and month= ? ",[ results[0].amount, results[0].user_id, results[0].year, results[0].month]);
       
        return res.json({response:true});
     
    } catch (error) {

        console.log("error has occured"+error);
        return res.status(500).json({ response:false, reason:error.message});
        
    }

};

const update_expense= async (req,res)=>{

    
    try {

        const { expense_id, description, category,amount, status}=req.body;
         
        let prev_val=0;
        let year=0;
        let month=0;

        const [rows]=await db.query("select amount,month(date_created) as month,year(date_created) as year, user_id from expenses where exp_id=?",[expense_id]);

        if(rows.length==0){
            return res.status(404).json({response:false, reason:"Expense not found"}); 
        }
        
        //retrive current details
        prev_val=rows[0].amount;
        year=rows[0].year; 
        month=rows[0].month 
        const new_amount=amount-prev_val;
        const user_id=rows[0].user_id;

        //update expense entry 
        const sql="update expenses set description=?,category=?,amount=?,status=? where exp_id=?"
        await db.query(sql,[ description, category,amount, status,expense_id]);
        
        //update monthly summary
        await db.query("update monthly_summary set expense = greatest(expense + ?, 0) where year=? and month=? and user_id=?",[new_amount,year,month,user_id]);

        return res.json({response:true})
        
    } catch (error) {

        return res.status(500).json({response: false, reason: error.message})
        
    }

};

module.exports={
    new_expense,
    load_expenses,
    delete_expense,
    update_expense
}

