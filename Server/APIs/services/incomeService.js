
const db = require("../config/db_config");
const { insertIncome, updateIncomeSummary, insertRecurringIncome, deleteIncome, deleteIncomeFromSummary, updateIncome, deleteRecurringIncome, getIncome } = require("../Queries/IncomeQueries");

const createIncome= async ({category,amount,user_id,recurring})=>{

    const conn = await db.getConnection(); 

    try{

        const now = new Date();
        const year = now.getFullYear();   
        const month = now.getMonth() + 1;

        //begin transaction
        await conn.beginTransaction();

        //create income entry 
        const id = await insertIncome(conn, {category, amount, user_id});
        if(!id){
            throw new Error("Income insert failed");
        }

        // update monthly summary 
        await updateIncomeSummary(conn, {amount, user_id,  month, year});

        // create recurring entry 
        if(Number(recurring) == 1 ){
            await insertRecurringIncome(conn, {category ,amount ,user_id })
        }
         
        //commit transction if if tasks were successful
        await conn.commit();
        return id;
        
    }
    catch(err){
        // cancel the entire transaction
        await conn.rollback();
        throw new Error(err.message);
    }
    finally{
        //release connection
        conn.release();
    }
}

const deleteIncomeEntry = async ( entryId )=>{

    const conn = await db.getConnection();

    try {

        await conn.beginTransaction();
        
        //delete entry 
        const data = await deleteIncome(conn, entryId);
        if(!data.status){
            conn.rollback();
            return false;
        }

        //update summary 
        await deleteIncomeFromSummary(conn, data.data);
            
        await conn.commit();
        return true;
        
    } catch (error) {

        // undo all the tasks
        await conn.rollback();
        return false; 
        
    }
    finally{
        await conn.release()
    }

}

const updateIncomeEntry = async (income_id,category, amount) =>{

    let prev_val=0;
    let year=0;
    let month=0;

    const conn = await db.getConnection();
    try {

        await conn.beginTransaction()

        //update entry
        const data =  await updateIncome(conn, {income_id,category, amount});

        if(!data.response){
            await conn.rollback();
            return false;
        }
        prev_val=data.rows[0].amount;
        year=data.rows[0].year; 
        month=data.rows[0].month 
        const new_amount= amount-prev_val;
        const user_id = data.rows[0].user_id;

        //Update summary
        await  updateIncomeSummary(conn,{ amount: new_amount , user_id: user_id, month :month, year : year  });
       
        await conn.commit();
        return true;
        
    } catch (error) {
        await conn.rollback();
        return false;
        
    }
    finally{
        await conn.release();
    }

}
const deleteRecurringIncomeEntry = async ( entryId , userId ) =>{
    try {

        const status = await deleteRecurringIncome(db, entryId, userId);
        if(!status){
            return false
        }
        return true;
        
    } catch (error) {
        return false
        
    }
} 
const loadIncomeEntries = async (sort_by, no_of_months, id) => {

    try {

        const data = await getIncome(db,{sort_by, no_of_months, id})
        return data;
        
    } catch (error) {
        throw new Error(error.message);
        
    }
}


module.exports = {
    createIncome,
    deleteIncomeEntry,
    updateIncomeEntry,
    deleteRecurringIncomeEntry,
    loadIncomeEntries

}