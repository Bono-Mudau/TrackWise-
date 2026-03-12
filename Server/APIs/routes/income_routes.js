const express=require("express");
const router = express.Router();

const {new_income, delete_income, load_income, update_income }=require("../Controllers/income_controllers");
const { verify_token } = require("../middleware/verify_token");

router.post("/new_income",verify_token,new_income);
router.post("/delete_income",verify_token,delete_income);
router.post("/load_income",verify_token,load_income);
router.post("/update_income",verify_token,update_income);


module.exports=router;