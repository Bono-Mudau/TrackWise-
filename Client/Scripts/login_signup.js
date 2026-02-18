
function log_sign_toogle(){
    const sign=document.getElementById("sign_up");
    const log=document.getElementById("log_in");
    if(sign.classList.contains("sign_up")){
        sign.classList.replace("sign_up","sign_up1");
        log.classList.replace("log_in1","log_in");
    }
    else{
        sign.classList.replace("sign_up1","sign_up");
        log.classList.replace("log_in","log_in1");;   
    }
}


function login(){
  verify_details()
  .then(verify_user=>{
    console.log(verify_user)
    if(verify_user.user){
      localStorage.setItem("id",verify_user.id);
      console.log("user id is "+verify_user.id)
      localStorage.setItem("names",verify_user.name);
      window.location.href="dashboard.html";
    }
    else{
      alert("incorrect login details");
    }
  })
  .catch(error=>{
    console.log("error has occured, try again later",error);
  });
  
}
function verify_details(){
  
  return fetch("http://localhost:3000/api/auth/login", {
    method:"POST",
    headers:{"Content-type":"application/json"},
    body:JSON.stringify({
    "email":document.getElementById("email1").value,
    "password":document.getElementById("e-password").value 
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

function sign_up(){
    if(document.getElementById("f-name").value.trim()==""){
        alert("First name can't be empty");
        return;
    }
    if(document.getElementById("email").value.trim()==""){
        alert("Please enter the email");
        return;
    }
    //verify email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(document.getElementById("email").value.trim())) {
        alert("Invalid email format");
        return;
    }

    //check enterd password
    if(document.getElementById("password").value.trim()==""){
        alert("Please Create password")
        return
    }
    if(document.getElementById("password").value!=document.getElementById("c-password").value){
        alert("Passwords don't match");
        return; 
    }
    const userdetails={
        name:document.getElementById("f-name").value,
        email:document.getElementById("email").value,
        password:document.getElementById("password").value,
    };
    function password_requirements(){
      const password_input=document.getElementById("")
      const current_value=password_input.value;
      let length=current_value.length;
      if(current_value.length<8){
        alert()
      }
    }

    //Get data entered by the user
    let names=document.getElementById("f-name").value;
    let password=document.getElementById("password").value;
    let password1=document.getElementById("c-password").value;
    let email=document.getElementById("email").value;
    if(password1!=password){
      alert("Password do not match");
      return;
    }
    let  userdata={
      "name":names,
      "email":email,
      "password":password 
    };
    fetch("http://localhost:3000/api/auth/signup", {
        method:"POST",
        headers:{
          "Content-type": "application/json"
        },
        body:JSON.stringify(userdata)
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
