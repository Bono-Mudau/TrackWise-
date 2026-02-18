const express=require("express");
const router = express.Router();

const {new_income, delete_income, load_income }=require("../Controllers/income_controllers");

router.post("/new_income",new_income);
router.post("/delete_income",delete_income);
router.post("/load_income",load_income)

module.exports=router;