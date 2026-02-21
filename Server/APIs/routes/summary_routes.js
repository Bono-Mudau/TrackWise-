const express=require("express");
const router=express.Router();

const {load_balances, recent_trans}=require("../Controllers/summary_controllers")
router.post("/load_balances",load_balances);
router.post("/resent_trans", recent_trans);
module.exports=router;
