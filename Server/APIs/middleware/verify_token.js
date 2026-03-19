const jwt=require("jsonwebtoken");


const verify_token= (req,res,next)=>{
    const token=req.cookies.token;
    console.log(req.cookies+"cookies are being sent");
    if(!token){
        return res.status(401).json({reason:"Not authorized"});
    }

    jwt.verify(token,process.env.JWT_key,(err,user)=>{

        if(err){
            return res.status(401).json({reason:"Invalid token"});
        }

        //create a new token
        const newToken = jwt.sign({ username: user.username }
            , process.env.JWT_key,
             { expiresIn: "15m" });
        req.user = user;
        res.cookie("token", newToken, 
            { httpOnly: true, 
            secure: true, 
            sameSite: "Strict",
            maxAge: 15 * 60 * 1000 });
        next();
    })

}
const generate_Token=(user_id)=>{

    const token = jwt.sign(
        { username: user_id }
        , process.env.JWT_key,
         { expiresIn: "15m" });

    return token
} 

module.exports={verify_token, generate_Token};