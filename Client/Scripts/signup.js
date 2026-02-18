const passwordInput = document.getElementById("password");
const passwordInput1 = document.getElementById("password1");
const checkb= document.getElementById("check_b");
checkb.addEventListener("change", function () {
  if (this.checked) {
    passwordInput.type = "text"; 
    passwordInput1.type = "text";
  } else {
    passwordInput.type = "password";
    passwordInput1.type = "password";
  }
});
function signup(){
  
}
function checkuser(username){
  return fetch("http://localhost:3000/checkuser", {
    method:"POST",
    headers:{"Content-type":"application/json"},
    body:JSON.stringify({
      "username":username
    })
  })
  .then(res=>res.json())
  .then(data=>{
    return data.exist;
  }
  )
}