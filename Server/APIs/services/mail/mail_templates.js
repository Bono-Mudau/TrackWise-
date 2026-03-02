const accountCreatedTemplate = (name) => `
<div style="font-family: Arial; padding:20px;">
    <h2 style="color:#2c3e50;">Welcome to TrackWise</h2>
    <p>Hello <strong>${name}</strong>,</p>
    <p>Your account was successfully created.</p>
    <p>You can now start tracking your expenses and income.</p>
</div>
`;

const otpTemplate = (otp) => `
<div style="font-family: Arial; padding:20px;">
    <h2 style="color:#2c3e50;">TrackWise Verification</h2>
    <p>Your verification code is:</p>
    <h1 style="
        background:#f4f6f8;
        padding:10px;
        display:inline-block;
        letter-spacing:4px;
    ">
        ${otp}
    </h1>
    <p>This OTP expires in <strong>5 minutes</strong>.</p>
</div>
`;

module.exports = {
    accountCreatedTemplate,
    otpTemplate
};