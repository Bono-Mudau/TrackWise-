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

db.query('SHOW TABLES', (err, tables) => {
  if (err) {
    console.error('Error fetching tables:', err);
    return;
  }

  tables.forEach(tableObj => {
    const tableName = Object.values(tableObj)[0];
    console.log(`\n--- Table: ${tableName} ---`);

    // Describe table
    db.query(`DESCRIBE \`${tableName}\``, (err, desc) => {
      if (err) {
        console.error(`Error describing table ${tableName}:`, err);
        return;
      }
      console.log('Description:');
      console.table(desc);

      // Fetch all rows
      db.query(`SELECT * FROM \`${tableName}\``, (err, rows) => {
        if (err) {
          console.error(`Error fetching rows from table ${tableName}:`, err);
          return;
        }
        console.log('Data:');
        console.table(rows);
      });
    });
  });
});

module.exports=db;