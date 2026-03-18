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

const run = async () => {
    try {
        // Replace with your actual user info
        const user_id =1; 
        const email = "genuwinephungo@gmail.com";

        // 1️⃣ Create table
        await db.promise().query(`
            CREATE TABLE IF NOT EXISTS settings (
                email VARCHAR(255) PRIMARY KEY,
                user_id INT NOT NULL unique,
                firstName VARCHAR(100) not null,
                lastName VARCHAR(100),
                notifications_status BOOLEAN NOT NULL DEFAULT 1,
                payment_remainder BOOLEAN NOT NULL DEFAULT 1,
                overdue_expenses BOOLEAN NOT NULL DEFAULT 1,
                budget_limit INT NOT NULL DEFAULT 2000,
                FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
            )
        `);
        console.log("Settings table created.");

        // 2️⃣ Insert default user
        await db.promise().query(`
            INSERT INTO settings (email, user_id)
            VALUES (?, ?)
            ON DUPLICATE KEY UPDATE email = VALUES(email)
        `, [email, user_id]);
        console.log("Default user inserted into settings.");

        // Done, exit process
        process.exit(0);

    } catch (err) {
        console.error("Error initializing settings:", err);
        process.exit(1);
    }
};

// run it
run();


module.exports=db;