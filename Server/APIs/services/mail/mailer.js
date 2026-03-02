
const nodemailer=require("nodemailer")

const transporter=nodemailer.createTransport({

    host:process.env.MAIL_HOST,
    port:process.env.MAIL_PORT,
    auth:{
        user:process.env.MAIL_USER,
        pass:process.env.MAIL_PASS
    }

});

const sendEmail=async ({to,subject,html})=>{
    try {
        await transporter.sendMail({
        from:process.env.MAIL_FROM,
        to,subject,html
        })
        console.log("EMAIL SENT!!") 
    } catch (error) {
        console.error(error)
        throw error;
        
    }
    

}
module.exports={sendEmail};