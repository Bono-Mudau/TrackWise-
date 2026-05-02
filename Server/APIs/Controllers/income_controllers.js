
const { createIncome, deleteIncomeEntry, updateIncomeEntry, deleteRecurringIncomeEntry, loadIncomeEntries } = require("../services/incomeService");

const new_income=async (req,res)=>{

    const {category,amount,recurring}=req.body;
    const user_id = req.user.username; 
    
    try {

        const id = await createIncome({category, amount, user_id, recurring});
        return res.json({response : true, id : id });

    } 
    catch (error) {

        console.log("error has occured"+ error);
        return res.status(500).json({ response : false, reason : error.message});  
    }
};

const delete_income=async (req,res)=>{

    const {entryId}=req.body;

    //validate EntryId 
    if(!entryId){
        return res.status(400).json({ response : false, reason: " EntryId not provided"});
    }

    try {

        const status =  await deleteIncomeEntry(entryId);
        if(status){
            return res.json({ response:true});
        }
        else{
            return res.json({ response: false , reason: " DB_err"});
        }
     
    } catch (error) {

        return res.status(500).json({ response:false, reason:error.message});
        
    }

};

const load_income = async (req,res)=>{

    const {sort_by,no_of_months}=req.body;
    const id = req.user.username;

    try {

        const data = await loadIncomeEntries(sort_by, no_of_months, id);
        return res.json(data);
        
    }
    catch (error) {

        return res.status(500).json({bool : false, reason : error.message})
        
    }

};

const update_income=async (req,res)=>{

    const {income_id,category, amount}=req.body;

    // validate input 
    if(!income_id || !category || !amount){
        return res.status(404).json({response:false, reason:"Entry_details_missing"}); 
    }
    try {
        
        const  status = await updateIncomeEntry(income_id, category, amount);
        if(!status){
            return res.json({response:false , reason: "db_err"});
        }
        return res.json({response:true})
        
    } catch (error) {

        return res.status(500).json({response: false, reason: error.message})
        
    }
}

const delete_recurring_income= async (req,res)=>{

    const {id}=req.body;
    const user_id=req.user.username;

    if(!id || !user_id){
        return res.json({response:false, reason:"No entry id"});
    }

    try {
        
       const status = await deleteRecurringIncomeEntry(id, user_id);
       if(!status){
          return res.json({response : false, reason : "db_err"});
       }
        return res.json({response:true});
        
    } 
    catch (error) {
        return res.status(500).json({response : false, reason : "db_err"});
    }
}

module.exports={
    new_income,
    delete_income,
    load_income,
    update_income,
    delete_recurring_income
}