const db = require("../../config/db_config");
const { new_income } = require("../../Controllers/income_controllers");
const { insertIncome } = require("../../Queries/incomeQueries");
const { overdueExpensesTemplate, upcomingPaymentsTemplate } = require("../mail/mail_templates");
const { sendEmail } = require("../mail/mailer");


const upcoming_payments = async (req,res)=>{

    try{

        //get a list of user who enabled payments notifications
        const sql="select user_id,firstName,email  from settings where notifications_status = 1 and payment_remainder = 1 ";
        const [rows]=await db.promise().query(sql);

        if(rows.length>0){

            for (const element of rows) {
        
                try{

                    //Get upcomming payments for each user
                    const[expenses]= await db.promise().query("Select description,amount,due_date from expenses where due_date > curdate()  and due_date <= curdate() + interval 1 DAY and status = 0 and  user_id = ? ",[element.user_id] );
                    
                    if (expenses.length == 0){
                        continue;
                    }

                    //send email
                    const html=upcomingPaymentsTemplate(element.firstName, expenses);
                    const to = element.email;
                    const subject="Payment Reminders";
                    await sendEmail({ to:to, subject:subject, html:html });
                    
                }
                catch(err){
                    console.log(err)
                }
                
            };
            console.log(" all payment reminders have been sent!!")
              return res.json({});
        }

    }
    catch(err){
        console.log("Error sending scheduled payments!!"+err)
        return res.status(500).json({});

    }

}

const overdue_expense_reminders = async (req,res)=>{

    try{

        //get a list of users who enabled overdue payments notifications
        const sql="select user_id,firstName,email  from settings where notifications_status = 1 and overdue_expenses = 1 ";
        const [rows]=await db.promise().query(sql);

        if(rows.length>0){

            for (const element of rows) {
        
                try{

                    //Get overdue payments for each user
                    const[expenses]= await db.promise().query("Select description,amount,due_date from expenses where due_date < curdate()  and  due_date >= curdate() - interval 1 month and status = 0 and user_id = ? ", [element.user_id]);
                    
                    if (expenses.length == 0){
                        continue;
                    }  

                    //send email
                    const html=overdueExpensesTemplate(element.firstName, expenses)
                    const to = element.email;
                    const subject="Overdue Payments";
                    await sendEmail({to:to,subject:subject,html:html});
                    
                }
                catch(err){
                    console.log(err)
                }
                
            };
            console.log(" all overdue reminders have been sent!!")
            return res.json({});
        }

    }
    catch(err){
        console.log("Error sending scheduled payments!!"+err)
         return res.status(500).json({});;

    }

}

const generateRecurringIncome = async ()=>{

    try {
         
        //LOAD ALL RECURRING ENTRIES
        const sql="Select user_id,category, amount from recurringIncome";
        const [rows]= await db.promise().query(sql);

        //Create income entries
        if(rows.length>0){

            for (const entry of rows) {
                await insertIncome(db, { category : entry.category, amount : entry.amount, user_id : entry.user_id});
            }
        }
        
    } catch (error) {
        console.log(error);
        
    }
}

module.exports={
    upcoming_payments,
    overdue_expense_reminders
}