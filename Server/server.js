require('dotenv').config();
const express=require("express");
const app=express();
const path = require("path");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const PORT = process.env.PORT || 3000;


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                 // limit each IP to 100 requests per window
  message: {
    error: "Too many requests. Please try again later."
  }
});

const auth_routes=require("./APIs/routes/auth_routes");
const expense_routes=require("./APIs/routes/expense_routes");
const income_routes=require("./APIs/routes/income_routes")
const summary_routes=require("./APIs/routes/summary_routes")

//middleware 
app.use(limiter);
app.use(express.json());
app.use(cookieParser());
app.use(helmet());

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
    console.log(`The server is listening on port ${PORT}`);
});








