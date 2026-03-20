const express=require("express");
const router=express.Router();

const {send_otp,login,signup,verify_email,reset_password, log_out, update_settings, load_settings, delete_account}=require("../Controllers/auth_controllers");
const { verify_token } = require("../middleware/verify_token");
const { upcoming_payments, overdue_expense_reminders } = require("../services/Schedule Tasks/schedule_task");

router.post("/signup",signup);
router.post("/login",login);
router.post("/send_otp",send_otp);
router.post("/verify_email",verify_email);
router.post("/reset_password",reset_password);
router.post("/login",verify_token,log_out);
router.post("/update_settings",verify_token,update_settings);
router.get("/load_settings",verify_token,load_settings);
router.get("/delete_account",verify_token,delete_account);
router.post("/upcoming_payments_reminders",upcoming_payments);
router.post("/overdue_payments_reminders",overdue_expense_reminders);

module.exports=router;
