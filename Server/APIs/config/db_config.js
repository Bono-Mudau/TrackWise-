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
const generate_demo_expenses = async (user_id) => {

    try {

        const categories = [
    "Groceries",
    "Entertainment",
    "Transport",
    "Emergency",
    "Taxes",
    "Rent",
    "Travel",
    "Personal care",
    "Health care",
    "Clothing & Accessories",
    "Other"
   ];

        for (let m = 0; m < 10; m++) {

            const date = new Date();
            date.setMonth(date.getMonth() - m);

            const year = date.getFullYear();
            const month = date.getMonth() + 1;

            for (let i = 0; i < 15; i++) {

                const description = `Demo Expense ${i+1}`;
                const category = categories[Math.floor(Math.random()*categories.length)];

                const amount = (Math.random()*30 + 5).toFixed(2); // small amounts 5–35

                const day = Math.floor(Math.random()*28)+1;

                const due_date = `${year}-${month.toString().padStart(2,'0')}-${day}`;

                const status = Math.random() > 0.5 ? 1 : 0;

                const sql = `
                INSERT INTO expenses
                (description, category, amount, status, user_id, due_date)
                VALUES (?,?,?,?,?,?)
                `;

                await db.promise().query(sql,[
                    description,
                    category,
                    amount,
                    status,
                    user_id,
                    due_date
                ]);

                // update monthly summary
                await db.promise().query(
                    `INSERT INTO monthly_summary (expense,user_id,year,month)
                     VALUES (?,?,?,?)
                     ON DUPLICATE KEY UPDATE expense = expense + VALUES(expense)`,
                    [
                        amount,
                        user_id,
                        year,
                        month
                    ]
                );

            }

        }

        console.log("Demo expenses inserted successfully");

    } catch (error) {
        console.log(error);
    }
}
const generate_demo_income = async (user_id) => {
    try {
        const categories = ["Salary", "Investments","Donations","other"];

        for (let m = 0; m < 10; m++) { // last 10 months
            const date = new Date();
            date.setMonth(date.getMonth() - m);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;

            for (let i = 0; i < 15; i++) { // 15 incomes per month
                const category = categories[Math.floor(Math.random() * categories.length)];
                const amount = (Math.random() * 500 + 50).toFixed(2); // 50–550 small amounts
                // optional: random day in month
                const day = Math.floor(Math.random() * 28) + 1;
                const income_date = `${year}-${month.toString().padStart(2, "0")}-${day}`;

                // insert income
                const sql = `INSERT INTO income (category, amount, user_id) VALUES (?,?,?)`;
                await db.promise().query(sql, [category, amount, user_id]);

                // update monthly summary
                await db.promise().query(
                    `INSERT INTO monthly_summary (income, user_id, year, month)
                     VALUES (?,?,?,?)
                     ON DUPLICATE KEY UPDATE income = income + VALUES(income)`,
                    [amount, user_id, year, month]
                );
            }
        }

        console.log("Demo income records inserted successfully!");
    } catch (error) {
        console.log("Error inserting demo income:", error);
    }
};

// Run the generator for user 1
await generate_demo_income(1);
await generate_demo_expenses(1);

module.exports=db;