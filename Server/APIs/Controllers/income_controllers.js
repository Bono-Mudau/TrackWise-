
const db = require("../config/db_config");
const new_income=async (req,res)=>{
    const {category,amount,user_id,recurring}=req.body;
    try {
        const sql="insert into income ( category, amount, user_id) values (?,?,?)"

        //add new income
        const [results] = await db.promise().query(sql,[category,amount, user_id]);

        const now = new Date();
        const year = now.getFullYear();   
        const month = now.getMonth() + 1;
        
        //Update monthly summary
         await db.promise().query("insert into monthly_summary (income,user_id,year,month) values(?,?,?,?) on duplicate key update  income= income + values(income) ",[
                       amount,
                       user_id,
                       year,
                       month]);

        if(Number(recurring)==1){
        
            //add expense to recurring income table
           const sql1="insert into recurringIncome (category, amount, user_id) values(?,?)";
            const [result]= await db.promise().query(sql1,[category, amount, user_id]);

            if(!result.insertId){
            console.log("err-recurring income entry not added")
            }

        }

        return res.json({ response: true, id: results.insertId });
     
    } catch (error) {

        console.log("error has occured"+error);
        return res.status(500).json({ response:false, reason:error.message});  
    }
};

const delete_income=async (req,res)=>{
 
    try {

        const {id}=req.body;
        const sql="delete from income where income_id=?";

        //retrieve income details 
        const [results]= await db.promise().query("select user_id,month(date) as month,year(date) as year,amount from income where income_id=?", [id]);

        if(results.length==0){
            return res.status(404).json({response: false, reason: "Income not found" })
        }

        //delete income
        await db.promise().query(sql,[id]);

        //update monthly summary
        await db.promise().query("update monthly_summary set income = greatest(income - ?,0) where user_id=? and year=? and month= ? ",[ results[0].amount, results[0].user_id, results[0].year, results[0].month]);
       
        return res.json({response:true});
     
    } catch (error) {

        console.log("error has occured"+error);
        return res.status(500).json({ response:false, reason:error.message});
        
    }

};

const load_income=async (req,res)=>{

    const {id,sort_by,no_of_months}=req.body;
    let order="";
    switch(sort_by){
        case "1":
            order="order by date desc"
            break;

        case "2":
            order="order by date asc"
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
    db.query("select income_id,category,amount,date from income where user_id=? and date>=? "+order,[id,startMonth],async(err,row)=>{
        if(err){
           
            return res.json({bool:false})
        }else{
            
            return res.json(row);
            
        }
    })
};

const update_income=async (req,res)=>{
    const {income_id,category, amount}=req.body;
      try {
         
        let prev_val=0;
        let year=0;
        let month=0;

        const [rows]=await db.promise().query("select amount,month(date) as month,year(date) as year, user_id from income where income_id=?",[income_id]);

        if(rows.length==0){
            return res.status(404).json({response:false, reason:"Income not found"}); 
        }
        
        //retrive previous income details
        prev_val=rows[0].amount;
        year=rows[0].year; 
        month=rows[0].month 
        const new_amount=amount-prev_val;
        const user_id=rows[0].user_id;

        //update income entry 
        const sql="update income set category=?, amount=? where income_id=?"
        await db.promise().query(sql,[  category,amount, income_id]);
        
        //update monthly summary
        await db.promise().query("update monthly_summary set income = greatest(income + ?, 0) where year=? and month=? and user_id=?",[new_amount,year,month,user_id]);

        return res.json({response:true})
        
    } catch (error) {

        return res.status(500).json({response: false, reason: error.message})
        
    }
} 
const delete_recurring_income= async (req,res)=>{

    const {id}=req.body;
    const user_id=req.user.username;

    if(!id){
        return res.json({response:false, reason:"No entry id"});
    }

    try {
        
        const[result] = await db.promise().query("Delete from recurringIncome where id = ? and user_id = ?",[id,user_id]);
     
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
    new_income,
    delete_income,
    load_income,
    update_income,
    delete_recurring_income
}