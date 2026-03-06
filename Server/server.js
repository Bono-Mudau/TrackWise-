const express=require("express");
const app=express();
const path = require("path");
const PORT = process.env.PORT || 3000;

require('dotenv').config();
const auth_routes=require("./APIs/routes/auth_routes");
const expense_routes=require("./APIs/routes/expense_routes");
const income_routes=require("./APIs/routes/income_routes")
const summary_routes=require("./APIs/routes/summary_routes")

app.use(express.json());
app.use(express.static(path.join(__dirname,"../Client")));
app.use("/api/auth",auth_routes);
app.use("/api/expenses",expense_routes);
app.use("/api/income",income_routes);
app.use("/api/summary",summary_routes);

app.get("/", (req, res) => {
    res.sendFile("login_signup.html", { root: path.join(__dirname, "../Client") });
});

//Start the server
app.listen(PORT,()=>{
    console.log(`The server is listening on port${PORT}`);
});








