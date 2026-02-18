const express=require("express");
const router=express.Router();

const {new_expense,load_expenses, delete_expense}=require("../Controllers/expense_controllers");

router.post("/new_expense",new_expense);
router.get("/load_expenses",load_expenses);
router.post("/delete_expense",delete_expense);

module.exports=router;

