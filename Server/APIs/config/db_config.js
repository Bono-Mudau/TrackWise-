const mysql = require("mysql2");

//connect to the database
const db = mysql.createPool({
  host: process.env.DB_HOST, 
  user: process.env.DB_USER,
  password:process.env.DB_PASSWORD ,
  database:process.env.DB_NAME ,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: 'Z'
});

//create recurring entries table
function createTables(){
  const sql =`create table recurringIncome (
              id int primary key auto_increment,
              category varchar(250) not null,
              amount decimal(10,2) not null,
              user_id int not null);`
  const sql2=`create table recurringExpenses (
              id int primary key auto_increment,
              category varchar(250) not null,
              amount decimal(10,2) not null,
              user_id int not null,
              due_date date);`
  try {
    db.query(sql,(err,res)=>{
      if(err){
        console.log("RecurringIncome not created")
      }
      else{
        console.log("recurringIncome created")
      }

    })
    db.query(sql2,(err,res)=>{
      if(err){
        console.log("Recurringexp not created")
      }
      else{
        console.log("recurringexp created")
      }

    })
    
  } catch (error) {
    
  }
}
createTables();

module.exports=db;