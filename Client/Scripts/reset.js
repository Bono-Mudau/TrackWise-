function sendOTP() {
  fetch("url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: document.getElementById("email").value
    })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      alert("OTP sent to your email!");
    } else {
      alert("Error sending OTP");
    }
  })
  .catch(err => console.log("Error:", err));
}

function resetPassword() {
  const otp = document.getElementById("otp").value;
  const newPassword = document.getElementById("newPassword").value;

  fetch("url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: document.getElementById("email").value,
      otp: otp,
      newPassword: newPassword
    })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      alert("Password reset successful!");
      window.location.href = "login.html";
    } else {
      alert("Invalid or expired OTP");
    }
  })
  .catch(err=>console.log("Error:", err));
}
