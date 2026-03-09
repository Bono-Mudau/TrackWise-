const express=require("express");
const router=express.Router();

const {new_expense,load_expenses, delete_expense,update_expense}=require("../Controllers/expense_controllers");

router.post("/new_expense",new_expense);
router.post("/load_expenses",load_expenses);
router.post("/delete_expense",delete_expense);
router.post("/update_expense",update_expense);

module.exports=router;


