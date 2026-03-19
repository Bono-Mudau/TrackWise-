const express=require("express");
const router=express.Router();

const {new_expense,load_expenses, delete_expense,update_expense, load_overdue_expenses}=require("../Controllers/expense_controllers");
const { verify_token } = require("../middleware/verify_token");

router.post("/new_expense",verify_token,new_expense);
router.post("/load_expenses",verify_token,load_expenses);
router.post("/delete_expense",verify_token,delete_expense);
router.post("/update_expense",verify_token,update_expense);
router.post("/load_overdue_expenses",verify_token,load_overdue_expenses)
module.exports=router;


