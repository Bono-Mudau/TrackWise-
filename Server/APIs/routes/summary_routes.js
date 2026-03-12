const express=require("express");
const router=express.Router();

const {load_balances, recent_trans, monthly_summary, income_pie_chart, expenses_pie_chart}=require("../Controllers/summary_controllers");
const { verify_token } = require("../middleware/verify_token");


router.post("/load_balances",verify_token,load_balances);
router.post("/recent_trans", verify_token,recent_trans);
router.post("/monthly_summary",verify_token, monthly_summary);
router.post("/income_chart",verify_token,income_pie_chart);
router.post("/expense_chart",verify_token,expenses_pie_chart);


module.exports=router;


