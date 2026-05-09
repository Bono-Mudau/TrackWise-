
const { response } = require("express");
const db = require("../config/db_config");

const new_expense= async (req,res)=>{

    try {
        const {description,category,amount,status,user_id,due_date,recurring}=req.body;
        const sql="insert into expenses ( description, category, amount, status, user_id,due_date) values (?,?,?,?,?,?)"

        //insert new expense
        const [results] = await db.query(sql,[description,category,amount,status,user_id,due_date]);

        const now = new Date();
        const year = now.getFullYear();   
        const month = now.getMonth() + 1;

        //Update monthly summary
        await db.query("insert into monthly_summary (expense,user_id,year,month) values(?,?,?,?) on duplicate key update  expense=expense+values(expense) ",[
            amount,
            user_id,
            year,
            month]
        );
        
        if(Number(recurring)==1){

            //add expense to recurring expenses table
           const sql1="insert into recurringExpenses (description,category,amount,due_date,user_id) values(?,?,?,?,?)";

           const [result]= await db.query(sql1,[description, category, amount, due_date,user_id]);


           if(!result.insertId){
            console.log("err-recurring exp not added")
           }

        }


        return res.json({ status: true, id: results.insertId });

     
    } catch (error) {

        console.log("error has occured"+error);
        return res.status(500).json({ response:false, reason:error.message});  
    }

};

const load_expenses= async (req,res)=>{

    const {sort_by, filter,no_of_months}=req.body;
    const id = req.user.username;
    let order=" order by date_created  desc";

    switch(sort_by){
        case "1":
            order="order by date_created desc"
            break;

        case "2":
            order="order by date_created asc"
            break;
        case "3":
            order="order by amount desc "
            break;
        case "4":
            order="order by amount "
            break;
        default:
         break;

    }

    let filter_="";

    switch(filter){


        case "2":
            filter_="and status=0"
            break;
        case "3":
            filter_="and status=1"
            break;
        case "4":
            filter_="and due_date<CURDATE() and status=0 "
            break;
        default:
         break;

    }

    let months_n=1;
    const now=new Date();
    
    switch(Number(no_of_months)){

        case 2:
            months_n=2;
            break;
        case 3:
            months_n=3;
            break;
        case 4:
            months_n=4;
            break;
        case 5:
            months_n=5;
            break;
        case 6:
            months_n=6;
            break;
        default:
         break;

    }
    const startMonth = new Date(now.getFullYear(), now.getMonth() - (months_n - 1), 1)
 

    try {
       
        const [rows]= await db.query("select exp_id,date_created, description, category, amount, status,due_date from expenses where user_id=? and date_created >= ?"+filter_+" "+order,[id,startMonth])
        return res.json(rows)
        
    } catch (error) {


        return res.status(500).json({error:"Failed to load expenses"})   
    }
};
const load_overdue_expenses=async(req,res)=>{
     try {
        const id = req.user.username;
        if (!id) {
            return res.status(400).json({ response:false, error:"User_id_err" });
        }
        const [rows]= await db.query("select exp_id, description,amount,due_date from expenses where user_id=? and due_date<curdate() and year(date_created)=year(curdate())  and month(date_created)=month(curdate()) and status=0 ",[id])
        return res.json({response:true, rows:rows});
        
    } catch (error) {
        return res.status(500).json({response:false, error:"Failed to load expenses"})   
    }
}


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

        const [rows] = await db.query("select amount,month(date_created) as month,year(date_created) as year, user_id from expenses where exp_id=?",[expense_id]);

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

const delete_recurring_expense= async (req,res)=>{

    const {id}=req.body;
    const user_id=req.user.username;

    if(!id){
        return res.json({response:false, reason:"No entry id"});
    }

    try {
        
        const[result] = await db.query("Delete from recurringExpenses where id = ? and user_id = ?",[id,user_id]);
     
        //check if entry was deleted
        if(result.affectedRows==0){
            return res.json({response:false, reason:"Entry not found"});
        }

        return res.json({response:true});
        
    } 
    catch (error) {
        return res.status(500).json({response:false, reason:"db_err"});
        
    }
}

module.exports={
    new_expense,
    load_expenses,
    delete_expense,
    update_expense,
    load_overdue_expenses,
    delete_recurring_expense
}

