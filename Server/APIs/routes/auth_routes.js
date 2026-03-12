const express=require("express");
const router=express.Router();


const {send_otp,login,signup,verify_email,reset_password, log_out}=require("../Controllers/auth_controllers");
const { verify_token } = require("../middleware/verify_token");

router.post("/signup",signup);
router.post("/login",login);
router.post("/send_otp",send_otp);
router.post("/verify_email",verify_email);
router.post("/reset_password",reset_password);
router.post("/login",verify_token,log_out);

module.exports=router;
