
function setting_toggle(){

  const inputs=document.querySelectorAll(".settings-input-field");
  const checkboxes=document.querySelectorAll(".settings-input-checkbox");

  //ENABLE USER INPUT
  inputs.forEach(element=>{
    if(element.readOnly){
      element.readOnly=false;
    }
    else{
      element.readOnly=true;
    }
    
  })
   
  //ENABLE CHECKBOXES
  checkboxes.forEach(element=>{
    if ( element.disabled) {
      element.disabled=false;
    }
    else{
      element.disabled=true;
    }
  })

  //UPDATE BUTTON TOGGLE
  const updateBtn=document.getElementById("save-settings-update");

  if (updateBtn.style.display=="none") {
    updateBtn.style.display="";
  } 
  else{
    updateBtn.style.display="none";
  }
  
}
document.getElementById("setting-edit-button").addEventListener("click",setting_toggle);

//UPDATE SETTINGS
async function validate_settings_input(){
  
  setting_toggle();//disable user inputs while the request is being processed

  const f_name=document.getElementById("setting-First-name").value;
  const l_name=document.getElementById("setting-last-name").value;
  
  //PREVENT EMPTY INPUT
  if(f_name=="" || l_name==""){
    alert("Fill all the fields!");
    return ;
  }

  let notification_on=document.getElementById("setting-notify-via email?").checked;
  let p_remainders=document.getElementById("setting-payment-remainder?").checked;
  let overdue=document.getElementById("setting-overdue-exp?").checked;
  const limit=document.getElementById("setting-monthly-limit").value;

  if(notification_on){
    notification_on=1;
  }
  else{
    notification_on=0;
  }

  if(p_remainders){
    p_remainders=1;
  }
  else{
    p_remainders=0;
  }

  if(overdue){
    overdue=1;
  }
  else{
    overdue=0;
  }

  //VALIDATE LIMIT ENTERED
  if( limit=="" || isNaN(Number(limit)) || Number(limit)<=0 ){

    alert("Enter a valid limit");
    return;
  }
  
  try {

    const updated=await update_user_notifications_preference_(f_name,l_name,notification_on,p_remainders,overdue,limit);
    
    if(updated){
      alert("Settings updated successfully")
    }
     else {
        alert("Failed to update settings");
    }

  } catch (error) {
    alert("An error occurred while updating settings");
  }
  
}

document.getElementById("save-settings-update").style.display="none"

async function update_user_notifications_preference_(f_name,l_name,notification_on,p_remainders,overdue,limit){
 
  try {

    const res= await fetch("https://trackwise-9l4u.onrender.com/api/auth/update_settings",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      credentials:"include",
      body:JSON.stringify({
        f_name:f_name, 
        l_name:l_name,
        notification_on:notification_on,
        p_remainders:p_remainders,
        overdue:overdue,
        limit:limit
       })
    });

    //FORCE LOGOUT
    if(res.status==401){
        alert("Error-occured:try to log in again");
        log_out();
        return false
    }

    if(!res.ok){
        return false;
    }
    const data= await res.json();
    return data.response;
 
  } 
  catch (error) {
    return false;
  }
  
}
function delete_user_account(){

  document.getElementById("delete-account-btn").disabled=true;
  const delete_a=confirm("Permanently delete your account?");
  if(!delete_a){
    return;
  }

  try {
    fetch("https://trackwise-9l4u.onrender.com/api/auth/delete_account",{
      method:"GET",
      headers:{"Content-Type":"application/json"},
      credentials:"include"
    })
    .then(res=>{

      //FORCE LOGOUT
      if (res.status === 401) {
          log_out();
          return;
      }

      if(!res.ok){
        throw new Error("Error has occured _couldn't get graph data");
      }
      else{
        return res.json();
      }

    })
    .then(res=>{
      if(!res.response){
        alert("failed to delete an account,try again later")
      }
      else{
        alert("Account deleted sucessfully");
        log_out();
      }
    })
    
  } catch (error) {
    alert("Error has occured, please try again later");
  }
  finally{
    document.getElementById("delete-account-btn").disabled=false;
  }
}
document.getElementById("delete-account-btn").addEventListener("click",delete_user_account);

function load_user_details(){

  try{        
    fetch("https://trackwise-9l4u.onrender.com/api/auth/load_settings",{
      method:"GET",
      headers:{"Content-Type":"application/json"},
      credentials:"include",
    })
    .then(res=>{
        
        //FORCE LOGOUT
        if(res.status==401){
          alert("Error-occured:try to log in again");
          log_out();
          return;
        }
        if(!res.ok){
          alert("error has occured")
          throw new Error("");
        }
        return res.json();     
    })
    .then(res=>{
      if(res.response){

        //FILL IN INPUT FIELDS 
        const data=res.data;
        document.getElementById("setting-First-name").value=data.firstName;
        document.getElementById("setting-last-name").value=data.lastName;
        document.getElementById("setting-monthly-limit").value=data.budget_limit;
        document.getElementById("setting-user-email").value=data.email;
        
        //UPDATE CHECKBOXES
        let notification_on=data.notifications_status;
        let p_remainders=data.payment_remainder;
        let overdue=data.overdue_expenses;

        if(notification_on==1){
          document.getElementById("setting-notify-via email?").checked=true;
        }
        else{
          document.getElementById("setting-notify-via email?").checked=false;
        }

        if(p_remainders==1){
          document.getElementById("setting-payment-remainder?").checked=true;
        }
        else{
          document.getElementById("setting-payment-remainder?").checked=false;
        }

        if(overdue==1){
          document.getElementById("setting-overdue-exp?").checked=true;
        }
        else{
          document.getElementById("setting-overdue-exp?").checked=false;
        }

        //GET USER INITIALS
        if( data.lastName && data.lastName.trim()!=""){
            document.getElementById("user-initials").innerHTML=data.lastName.charAt(0)+""+data.firstName.charAt(0)
        }
        else if( data.firstName && data.firstName.split(" ").length>1){
            const initials=data.firstName.split(" ");
            document.getElementById("user-initials").innerHTML=initials[1].charAt(0)+""+initials[0].charAt(0);
        }
        else if( data.firstName){
            ocument.getElementById("user-initials").innerHTML=data.firstName.charAt(0)
        }
      }
      else{
        alert("ERR:Settings_info-not loaded");
      }
    })

  }
  catch(err){
     alert("ERR:Settings_info-not loaded");

  }

}

