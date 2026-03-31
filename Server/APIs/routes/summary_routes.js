const express=require("express");
const router=express.Router();

const {load_balances, recent_trans, monthly_summary, income_pie_chart, expenses_pie_chart, summary, recurring_income_expenses}=require("../Controllers/summary_controllers");
const { verify_token } = require("../middleware/verify_token");


router.get("/load_balances", verify_token, load_balances);
router.get("/recent_trans", verify_token, recent_trans);
router.get("/monthly_summary", verify_token, monthly_summary);
router.get("/income_chart", verify_token, income_pie_chart);
router.get("/expense_chart", verify_token, expenses_pie_chart);
router.get("/load_summary", verify_token, summary);
router.get("/load_recurring_income_expenses", verify_token, recurring_income_expenses);


module.exports=router;


