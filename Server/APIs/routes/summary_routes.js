const express=require("express");
const router=express.Router();

const {load_balances, recent_trans, monthly_summary, income_pie_chart, expenses_pie_chart}=require("../Controllers/summary_controllers")


router.post("/load_balances",load_balances);
router.post("/recent_trans", recent_trans);
router.post("/monthly_summary", monthly_summary);
router.post("/income_chart",income_pie_chart);
router.post("/expense_chart",expenses_pie_chart);


module.exports=router;


