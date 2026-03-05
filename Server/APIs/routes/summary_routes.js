const express=require("express");
const router=express.Router();

const {load_balances, recent_trans, monthly_summary}=require("../Controllers/summary_controllers")


router.post("/load_balances",load_balances);
router.post("/recent_trans", recent_trans);
router.post("/monthly_summary", monthly_summary);
module.exports=router;


