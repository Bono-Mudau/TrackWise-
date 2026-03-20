const accountCreatedTemplate = (names) => `
<div style="font-family: Arial; padding:20px;">
    <h2 style="color:#2c3e50;">Welcome to TrackWise</h2>
    <p>Hello <strong>${names}</strong>,</p>
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
const ChangedPasswordTemplate=()=>
    `<div style="font-family: Arial; padding:20px;">
    <h2 style="color:#2c3e50;">Password recovered</h2>
    <br>
    <p>Your password was changed, if this wasn't you, please go to our website to recover your account:</p>
</div>`;
const overdueExpensesTemplate = (userName, expenses) => `
<div style="font-family: Arial; padding:20px;">
    <h2 style="color:#e74c3c;">⚠️ Overdue Expenses</h2>
    
    <p>Hello ${userName},</p>
    <p>The following expenses are overdue:</p>

    <table style="width:100%; border-collapse: collapse; margin-top:15px;">
        <thead>
            <tr style="background:#f8d7da;">
                <th style="padding:10px; border:1px solid #ddd;">Expense</th>
                <th style="padding:10px; border:1px solid #ddd;">Amount</th>
                <th style="padding:10px; border:1px solid #ddd;">Due Date</th>
            </tr>
        </thead>
        <tbody>
            ${expenses.map(exp => `
                <tr>
                    <td style="padding:10px; border:1px solid #ddd;">${exp.description}</td>
                    <td style="padding:10px; border:1px solid #ddd;">R ${exp.amount}</td>
                    <td style="padding:10px; border:1px solid #ddd;"> ${(exp.due_date).toLocaleDateString()}</td>
                </tr>
            `).join('')}
        </tbody>
    </table>

    <p style="margin-top:15px;">
        Please settle these as soon as possible to avoid penalties.
    </p>
</div>
`;
const upcomingPaymentsTemplate = (userName, payments) => `
<div style="font-family: Arial; padding:20px;">
    <h2 style="color:#f39c12;">📅 Upcoming Payments</h2>
    
    <p>Hello ${userName},</p>
    <p>Here are your upcoming payments:</p>

    <table style="width:100%; border-collapse: collapse; margin-top:15px;">
        <thead>
            <tr style="background:#fff3cd;">
                <th style="padding:10px; border:1px solid #ddd;">Payment</th>
                <th style="padding:10px; border:1px solid #ddd;">Amount</th>
                <th style="padding:10px; border:1px solid #ddd;">Due Date</th>
            </tr>
        </thead>
        <tbody>
            ${payments.map(pay => `
                <tr>
                    <td style="padding:10px; border:1px solid #ddd;">${pay.description}</td>
                    <td style="padding:10px; border:1px solid #ddd;">R ${pay.amount}</td>
                    <td style="padding:10px; border:1px solid #ddd;"> ${(pay.due_date).toLocaleDateString()}</td>
                </tr>
            `).join('')}
        </tbody>
    </table>

    <p style="margin-top:15px;">
        Make sure you have sufficient funds before the due dates.
    </p>
</div>
`;


module.exports = {
    accountCreatedTemplate,
    otpTemplate,
    ChangedPasswordTemplate,
    overdueExpensesTemplate,
    upcomingPaymentsTemplate
};