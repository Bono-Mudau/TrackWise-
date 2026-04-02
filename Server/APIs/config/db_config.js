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

async function fix_db(){
try {

const sql = `
  SELECT income, expense, month, year, user_id
  FROM monthly_summary
  ORDER BY year DESC, month DESC
`;

db.query(sql, async (err, rows) => {
  if (err) {
    console.log(err.message);
  }

  const temp_sql = `
    UPDATE monthly_summary 
    SET income = ?, expense = ? 
    WHERE user_id = ? AND month = ? AND year = ?
  `;

  const tempsql2 = `
    SELECT SUM(amount) AS total 
    FROM income 
    WHERE user_id = ? AND MONTH(date) = ? AND YEAR(date) = ?
  `;

  const tempsql3 = `
    SELECT SUM(amount) AS total 
    FROM expenses 
    WHERE user_id = ? AND MONTH(date_created) = ? AND YEAR(date_created) = ?
  `;

  for (const el of rows) {
    const [incomeResult] = await db.promise().query(tempsql2, [el.user_id, el.month, el.year]);
    const [expenseResult] = await db.promise().query(tempsql3, [el.user_id, el.month, el.year]);

    const income = incomeResult[0].total || 0;
    const expense = expenseResult[0].total || 0;

    await db.promise().query(temp_sql, [
      income,
      expense,
      el.user_id,
      el.month,
      el.year
    ]);
  }
  console.log("DB fixed")

  });

  
} catch (error) {
  console.log(error)
  
}
}

fix_db();

module.exports=db;