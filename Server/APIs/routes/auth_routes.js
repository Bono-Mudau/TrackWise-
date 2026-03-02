const express=require("express");
const router=express.Router();

const {send_otp,login,signup,verify_email}=require("../Controllers/auth_controllers")

router.post("/signup",signup);
router.post("/login",login);
router.post("/send_otp",send_otp);
router.post("/verify_email",verify_email);


module.exports=router;
