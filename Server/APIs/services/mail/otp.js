//Generate a six digits OTP
const generate_OTP=()=>{
    return Math.floor(900000*Math.random()+100000)
}
module.exports={generate_OTP}