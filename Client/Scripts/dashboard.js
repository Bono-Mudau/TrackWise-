

function getdate(){
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return yyyy+"-"+mm+"-"+dd
}

const month_names=["Jan", "Feb", "Mar", "Apr", "May" ,"Jun" ,"Jul" , "Aug", "Sep" , "Oct" , "Nov", "Dec"];
const current_date=new Date();
document .getElementById("current-month").innerText=`${month_names[current_date.getMonth()]} ${current_date.getFullYear()}`
document.getElementById('due_date').min=getdate();


function menu_toogle(){
 const menu=document.getElementById("menu-options");
  if(menu.classList.contains("menu_class")){
      menu.classList.replace("menu_class","menu_class1");
  }
  else{
      menu.classList.replace("menu_class1","menu_class");
  }
}

//get user details from the local storage
const user_info={
  names:localStorage.getItem("names"),
  id:Number(localStorage.getItem("id"))
}

//default expense fitlers/sorting
let default_exp_filter={
  sort_by:1,
  filter:0 ,
  no_of_months:1
}
let default_income_filter={

  sort_by:1,
  no_of_months:1

}



function remove_table_Rows(table_id) {

  const table = document.getElementById(table_id);
  while (table.rows.length > 1) {
    table.deleteRow(1);
  }

}

//update names on the dashboard
document.getElementById("user-names").innerHTML="Welcome, "+user_info.names;


//force log out 
async function  log_out(){
     
    try {
      const res = await fetch("https://trackwise-9l4u.onrender.com/api/auth/log_out",{
          method: "POST",
          credentials: "include"
        }
      );

      if (!res.ok) {
        throw new Error("Logout failed");
      }

    } catch (err) {
      console.error(err);
    }
    localStorage.clear();
    window.location.href = "login_signup.html";

}


  



