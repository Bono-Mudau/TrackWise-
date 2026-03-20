
function log_sign_toogle(){
    const sign = document.getElementById("signup_form");
    const log = document.getElementById("login_form");
    if(sign.classList.contains("signup_form")){
      sign.classList.replace("signup_form","signup_form1");
      log.classList.replace("login_form1","login_form")
    }else{
      sign.classList.replace("signup_form1","signup_form");
      log.classList.replace("login_form","login_form1")
    }
  
}
// add event listeners

document.getElementById("losg-in").addEventListener("click",login);
document.getElementById("redirect_to_recoverpassword_toogle").addEventListener("click",redirect_to_recoverpassword_toogle);
document.getElementById("password_recovery_submit_btn").addEventListener("click",reset_password);
document.getElementById("sign-up").addEventListener("click",validate_user_information);
document.getElementById("submit_otp").addEventListener("click",sign_up);
document.getElementById("login-signup_toggle").addEventListener("click",log_sign_toogle);
document.getElementById("login-signup_toggle1").addEventListener("click",log_sign_toogle);

let password_strength_status=false;
let password_strength_status1=false;

function password_strength(event){

  //Ensure that the user enters strong password 
   
  const password = event.target.value;
  const length=document.getElementById("password_length");
  const digit=document.getElementById("password_contain_digit");
  const special_char=document.getElementById("password_contains_s_char");
  const has_special_chars=/[^a-zA-Z0-9]/;

  if(password.length<8){
    length.style.color="red";
  }
  else{
    length.style.color="green";
  }

  if(/\d/.test(password)){
    digit.style.color="green";
  }
  else{
    digit.style.color="red";
  }
  if(has_special_chars.test(password)){
    special_char.style.color="green";
  }
  else{
     special_char.style.color="red";
  }

  if(password.length>=8 && /\d/.test(password) && has_special_chars.test(password)){
    password_strength_status=true;
  }
  else{
    password_strength_status=false;
  }

}
const passwordInput = document.getElementById("account_recovery_password");
passwordInput.addEventListener("input", password_strength);

function password_strength1(event){

  //Ensure that the user enters strong password 
   
  const password = event.target.value;
  const length=document.getElementById("Password_length");
  const digit=document.getElementById("Password_contain_digit");
  const special_char=document.getElementById("Password_contains_s_char");
  const has_special_chars=/[^a-zA-Z0-9]/;

  if(password.length<8){
    length.style.color="red";
  }
  else{
    length.style.color="green";
  }

  if(/\d/.test(password)){
    digit.style.color="green";
  }
  else{
    digit.style.color="red";
  }
  if(has_special_chars.test(password)){
    special_char.style.color="green";
  }
  else{
     special_char.style.color="red";
  }

  if(password.length>=8 && /\d/.test(password) && has_special_chars.test(password)){
    password_strength_status1=true;
  }
  else{
    password_strength_status1=false;
  }

}
const passwordInput1 = document.getElementById("password");
passwordInput1.addEventListener("input", password_strength1);


function login(){

  const login_btn=document.getElementById("losg-in");
  login_btn.disabled= true;
  login_btn.textContent = "Logging in...";
  verify_details()
  .then(verify_user=>{
    if(verify_user.user){
      localStorage.setItem("id",verify_user.id);
      localStorage.setItem("names",verify_user.name);
      window.location.href="dashboard.html";
    }
    else{
      alert(verify_user.reason);
    }
  })
  .catch(error=>{
    console.log("error has occured, try again later",error);
  });
  
  login_btn.textContent = "Submit";
  login_btn.disabled= false;

}
function togglePassword(){
  const password=document.getElementById("e-password");
  if(password.type=="password"){
    password.type="text"
  }
  else{
    password.type="password"
  }
}
async function verify_details(){

  //ensure user enter login details
  const username=document.getElementById("email1").value;
  const password=document.getElementById("e-password").value;

  if(username=="" || password==""){
    alert("Please fill all the fields");
    return;
  }
 
  return fetch("https://trackwise-9l4u.onrender.com/api/auth/login", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
    "email":username,
    "password":password 
    })
  })
  .then(res=>res.json())
  .then(data=>{
    return data;
  })
  .catch(error=>{
    console.log("error occurred, try agin later",error);
     return false;
  });
  
}


async function send_otp(email){

  return fetch("https://trackwise-9l4u.onrender.com/api/auth/send_otp",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      email:email
    })
  })
  .then(res=>{

    if(!res.ok){
      throw new Error("Error sending an OTP");  
    }
    return res.json();
  })
  .then(res=>{

    if(res.response){
      return true;
    }
    else{
      return false;
    }
  })
  .catch(error=>{

      console.log("error sending otp, please try again later",error)
      return false;

  });  
}

//To be updated after input validation
let user_input={
  names:"",
  email:"",
  password:""
}

async function validate_user_information(){
  const signup_btn=document.getElementById("sign-up");
  signup_btn.disabled= true;
  signup_btn.textContent = "Loading......";

    //validate user input before sending OTP
    const f_name=document.getElementById("f-name").value.trim();
    const email=document.getElementById("email").value.trim();

    if(f_name==""){

      alert("Please enter your full names");
      signup_btn.textContent = "Create account";
      signup_btn.disabled= false;
      return;
    }

     if(email==""){

      alert("Eamil can't be empty");
      signup_btn.textContent = "Create account";
      signup_btn.disabled= false;
      return;
    }


    //verify email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(document.getElementById("email").value.trim())) {
        alert("Invalid email format");
         signup_btn.textContent = "Create account";
         signup_btn.disabled= false;
        return;
    }

    let password=document.getElementById("password").value;
    let password1=document.getElementById("c-password").value;

    if(password1!=password){
      alert("Password do not match");
      signup_btn.textContent = "Create account";
      signup_btn.disabled= false;
      return;
    }
    if(!password_strength_status1){
      alert("Weak password!!")
       signup_btn.textContent = "Create account";
       signup_btn.disabled= false;
      return;
    }
    
    user_input.names=f_name;
    user_input.email=email;
    user_input.password=password;
    document.getElementById("otp_prompt").classList.replace("otp_prompt1","otp_prompt");

    //send OTP
    const email_sent=await send_otp(email);
    if(!email_sent){
      alert("Error occurred sending an OTP!!")
    }
    signup_btn.textContent = "Create account";
    signup_btn.disabled= false;
    
}

function redirect_to_recoverpassword_toogle(){

  if(document.getElementById("login_form").classList.contains("login_form")){

    document.getElementById("login_form").classList.replace("login_form","login_form1");
    document.getElementById("Reset_password_form").classList.replace("Reset_password_form1","Reset_password_form");
  }
  else{

    document.getElementById("login_form").classList.replace("login_form1","login_form");
    document.getElementById("Reset_password_form").classList.replace("Reset_password_form","Reset_password_form1");

  }
}

async function verify_OTP(email,otp){

  //validate input
  if( !Number(String(otp)) ){
    alert("Enter a valid otp");
    return;
  };
  if(otp.length!=6){
    alert("OTP should be six digits long!!");
    return;
  }

  return fetch("https://trackwise-9l4u.onrender.com/api/auth/verify_email",{

    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      email:email,
      otp:otp
    })

  })
  .then(res=>{
    if(!res.ok){
      throw new Error("Error getting verifying an OTP");  
    }
    return res.json();
  })
  .then(res=>{
     
    if(res.response){

      document.getElementById("otp_prompt").classList.replace("otp_prompt","otp_prompt1");
      return true;
    }
    else{
      return false;
    }
   
  }).catch(error=>{
      console.log("error verifying, please try again later",error);
      return false;
    }); 
}

async function sign_up(){

    const email=user_input.email;
    const otp=document.getElementById("OTP").value.trim();
    const verified_email=await verify_OTP(email,otp);

    if(!verified_email){
      alert("Email could not be verified");
      return
    }
    fetch("https://trackwise-9l4u.onrender.com/api/auth/signup", {
        method:"POST",
        headers:{
          "Content-type": "application/json"
        },
        body:JSON.stringify(user_input)
    })
    .then(res=>{

      if(!res.ok){

        throw new Error("Error has occured,  try again later");

      }
      else{
        return res.json();
      }
    })
    .then(ans=>{
        if(ans.user){
          alert("Account created successfully, proceed to log in");
          log_sign_toogle();
          return;
        }
        if(ans.reason=="Account with this email address already exist,please proceed to log in page"){
          alert(ans.reason);
          log_sign_toogle();
          return;
        }
        else{
          alert(ans.reason);
        }
      })
    .catch(error=>
        console.log("error creating an account, please try again later",error)
    ); 
    

 
}
  
//step count to control the reset passoword process
 let step_count=1;

 async function reset_password(){

    const btn=document.getElementById("password_recovery_submit_btn");
    const email=document.getElementById("account_recovery_email").value.trim();
    if(email==""){
      alert("Please enter your email!!");
      return;
    }

    if(step_count==1){
       
        const otp_sent=await send_otp(email);

        if(otp_sent){

          document.getElementById("account_recovery_email").style.display="none";
          document.getElementById("account_recovery_otp").style.display="";
          document.getElementById("Recovery_user_msg").innerText="Enter OTP";
          btn.innerHTML="Verify OTP";
          step_count+=1;
          return;
        }
        else{
          alert("couldn't send OTP, try again later!");
          return;
        }


    }
    if(step_count==2){

        const otp=document.getElementById("account_recovery_otp").value.trim();
        if(otp==""){
          alert("Please enter OTP");
          return;

        }

        //verify OTP
        const otp_correct= await verify_OTP(email,otp);

        if(otp_correct){
 
            const passwordInput = document.getElementById("account_recovery_password");
            passwordInput.addEventListener("input", password_strength);
            document.getElementById("account_recovery_otp").style.display="none";
            document.getElementById("password_requirements1").style.display="";
            document.getElementById("password_requirements").style.display="";
            document.getElementById("account_recovery_password").style.display="";
            document.getElementById("account_recovery_c-password").style.display="";
            document.getElementById("Recovery_user_msg").innerText="Set new password";
            btn.innerHTML="Change Password";
            step_count+=1;
            return;
        }
        else{

          alert("Incorrect OTP!!");
          return;
        }
      
    }

    //step 3: create new password
    if(step_count==3){

      if(!password_strength_status){
        alert("Enter a strong password!");
        return;
      }

      const password=document.getElementById("account_recovery_password").value.trim();
      const password1=document.getElementById("account_recovery_c-password").value.trim();

      if(password!=password1){
        alert("Password don't match!!")
        return;
      }
      else{
        const password_updated=await updatepassword(email,password);
        if(password_updated){
          alert("password changed successfully");
          location.reload();

        }
        else{

          alert("Error occurred, password not changed!");
          return ;
        }

      }
      
    }
   
 }
 async function updatepassword(email,password) {

    return fetch("https://trackwise-9l4u.onrender.com/api/auth/reset_password", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
        "email":email,
        "password":password 
        })
      })
      .then(res=>{
        if(!res.ok){
          alert("Unable to update password!, Try agin later");

          throw new Error("Unable to update password!, Try agin later");

        }
        return res.json()
      })
      .then(res=>{
        if(res.response){
          return true;
        }
        return false;
      })
      .catch(error=>{
        console.log("error occurred, try agin later",error);
        return false;
      });

  
 }
