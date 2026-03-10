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
console.log("DB connected");
const createUsersTable = `
create table expenses(
  exp_id int auto_increment primary key,
  date_created datetime default current_timestamp,
  description  varchar(300) ,
  category varchar(255),
  amount decimal(10,2) not null,
  status tinyint(1) default 0,
  due_date datetime,
  user_id int not null
 );
`;
const createUsersTable1 = `
 create table income(
  income_id int auto_increment primary key,
  date datetime default current_timestamp,
  category varchar(255),
  amount decimal(10,2) not null,
  user_id int not null
 );
`;
const createUsersTable2 = `

 create table monthly_summary(
  id int auto_increment primary key,
  income decimal(11,20) default 0.00,
  income decimal(11,20) default 0.00,
  year int not null,
  month int not null,
  user_id int not null
 );
`;
const createUsersTable3 = `

 create table otp(
  id int auto_increment primary key,
  email varchar(255) not null,
  otp varchar(6) not null,
  expiry_time datetime not null
  );

`;

db.query("SELECT 1", (err, res) => {
  if (err) {
    console.error("DB connection failed:", err);
  } else {
    console.log("DB connected successfully");
  }
});

db.query(createUsersTable, (err, results) => {
  if (err) throw err;
  console.log('Users table created!');
});
db.query(createUsersTable1, (err, results) => {
  if (err) throw err;
  console.log('Users1 table created!');
});

db.query(createUsersTable2, (err, results) => {
  if (err) throw err;
  console.log('Users2 table created!');
});

db.query(createUsersTable3, (err, results) => {
  if (err) throw err;
  console.log('Users3 table created!');
});


module.exports=db;