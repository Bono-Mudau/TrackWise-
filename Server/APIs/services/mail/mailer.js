
const mailgun=require("mailgun-js")

const mg = mailgun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN
});

const sendEmail = async ({ to, subject, html }) => {
  const data = {
    from: process.env.MAILGUN_SENDER,
    to,
    subject,
    html
  };

  try {
    const body = await mg.messages().send(data);
    console.log("EMAIL SENT!!", body);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
module.exports={sendEmail};