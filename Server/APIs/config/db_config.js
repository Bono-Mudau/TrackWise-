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
function altertable(){

  db.query("alter table recurringExpenses add description varchar(250) not null ", (err,res)=>{
    if(err){
      console.log(err);
    }
  });

}
altertable();
module.exports=db;