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
CREATE TABLE IF NOT EXISTS users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(300) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
);
`;

db.query(createUsersTable, (err, results) => {
  if (err) throw err;
  console.log('Users table created!');
});

module.exports=db;