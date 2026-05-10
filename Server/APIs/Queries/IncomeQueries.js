const db = require("../config/db_config");

const insertIncome = async( conn , {category, amount, user_id}) =>{

    const sql="insert into income ( category, amount, user_id) values (?,?,?)";
    const [results] = await conn.query(sql,[category,amount, user_id]);
    
    return results.insertId       

}
const getIncome = async(conn , { sort_by, no_of_months, id} ) =>{

    const sortMap = {
        "1":"Order by date desc",
        "2":"Order by date asc",
        "3":"Order by amount desc",
        "4":"Order by amount",
    };

    let order = sortMap[sort_by] || "";
    const months_n = Math.min ( Math.max( Number(no_of_months) || 1 , 1) , 6);
    const now=new Date();
    const startMonth = new Date(now.getFullYear(), now.getMonth() - (months_n - 1), 1)
    const [rows] = await conn.query("select income_id,category,amount,date from income where user_id=? and date>=? " + order ,[id,startMonth]);

    return rows;
}
const deleteIncome = async( conn , id) => {

    try {

        const sql="delete from income where income_id=?";
        //retrieve entry details 
        const [results]= await conn.query("select user_id,month(date) as month,year(date) as year,amount from income where income_id=?", [id]);

        if(results.length==0){
            return {
            status: false,
            err : "Income not found"
           };
        }
        await conn.query(sql,[id]);
        return {
            status: true,
            data : results
        };
        
    }
    catch (error) {
        return {
            status: false,
            err : error.message
        };
        
    }   
}
const updateIncome = async( conn ,{income_id,category, amount}) =>{
    try {

        const [rows] = await conn.query("select amount,month(date) as month,year(date) as year, user_id from income where income_id=?",[income_id]);
        if(rows.length==0){ 

            return{response:false, err:"Income not found"}; 
        }
    
        const sql="update income set category=?, amount=? where income_id=?"
        await conn.query(sql,[  category,amount, income_id]);

        return {
            response: true,
            rows: rows
        }
        
    } catch (error) {
        return {
            response: false,
            err: error.message
        }
        
    }

    
    
}

const updateIncomeSummary = async (conn, { amount, user_id, month, year}) =>{

    //Update monthly summary
    await conn.query("insert into monthly_summary (income,user_id,year,month) values(?,?,?,?) on duplicate key update  income = greatest(income + values(income), 0) ",[
        amount,
        user_id,
        year,
        month]
    );
}

const deleteIncomeFromSummary = async (conn,data) =>{
        
    await conn.query("update monthly_summary set income = greatest(income - ?,0) where user_id=? and year=? and month= ? ",[ data[0].amount, data[0].user_id, data[0].year, data[0].month]);

}
const insertRecurringIncome = async( conn , {category, amount, user_id}) =>{
    
    const sql="insert into recurringIncome (category, amount, user_id) values(?,?,?)";
    await conn.query(sql,[category, amount, user_id]);

}

const deleteRecurringIncome = async( conn , entryId, userId) =>{

   const results =  await conn.query("Delete from recurringIncome where id = ? and user_id = ?",[entryId,userId]);
    //check if entry was deleted
    if(results.affectedRows ==0 ){
        return false
    }
    return  true;
    
}



module.exports={
    insertIncome,
    insertRecurringIncome,
    updateIncomeSummary,
    updateIncome,
    deleteIncome,
    deleteRecurringIncome, 
    getIncome,
    deleteIncomeFromSummary,
}