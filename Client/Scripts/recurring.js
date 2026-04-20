//RECURRING ENTRIES

async function delete_recurring_expense(e){

  if(!confirm("Delete entry?")){
    return;
  }

  //GET ENTRY'S ID
  const btn=e.target.closest("[data-id]");
  btn.disabled=true;
  if(!btn){
    return;
  }
  const id=btn.dataset.id;

  //CHECK IF ID IS VALID
  if(!id){
    alert("Err:entry not deleted");
    return;
  }

  try {

    const res=await fetch("https://trackwise-9l4u.onrender.com/api/expenses/delete_recurring_expense", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      credentials:"include",
      body:JSON.stringify({id:id})
    });
     
    //FORCE LOG-OUT IF UNAUTHORIZED
    if (res.status === 401) {
          log_out();
          return;
    }

    if(!res.ok){
      alert("network error, entry not deleted")
      throw new Error("Invaild db_resp");
    }
    
    const results= await res.json();

    //DELETE ELEMENT FROM THE TABLE
    if(results.response){
      const row=btn.closest("tr");
      if(row){
        row.remove();
      }

    }
    else{
      alert("err:entry not deleted")
      return;
    }
    
  } catch (error) {
    alert("err:entry not deleted")
      return;
  }
  finally{
    btn.disabled=false;
  }


}

async function delete_recurring_income(e){

  if(!confirm("Delete entry?")){
    return;
  }

  //GET ENTRY'S ID
  const btn=e.target.closest("[data-id]");
  btn.disabled=true;
  if(!btn){
    return;
  }
  const id=btn.dataset.id
  
  //CHECK IF ID IS VALID
  if(!id){
    alert("Err:entry not deleted");
    return;
  }

  try {

    const res=await fetch("https://trackwise-9l4u.onrender.com/api/income/delete_recurring_income", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      credentials:"include",
      body:JSON.stringify({id:id})
    });

    //FORCE LOG-OUT IF UNAUTHORIZED
    if (res.status === 401) {
          log_out(); 
          return;
    }

    if(!res.ok){
      alert("Err:entry not deleted");
      throw new Error("Invaild db_resp");
    }
    
    const results= await res.json();

    //DELETE ELEMENT FROM THE TABLE
    if(results.response){
      const row=btn.closest("tr");
      if(row){
        row.remove();
      }

    }
    else{
      alert("err:entry not deleted")
      return;
    }
    
    
  } catch (error) {
    alert("err:entry not deleted")
      return;
  }
  finally{
    btn.disabled=false;
  }
  
}

async function load_recurring(){

  try{

    const res= await fetch("https://trackwise-9l4u.onrender.com/api/summary/load_recurring_income_expenses",{
      method: "GET",
      headers:{"Content-Type":"application/json"},
      credentials:"include"
    });
    
    //FORCE LOG-OUT IF UNAUTHORIZED
    if (res.status === 401) {
          log_out(); 
          return;
    }

    if(!res.ok){
      alert("network error, failed to load reccuring entries")
      throw new Error("Invaild db_resp");
    }
    
    const results= await res.json();
    if(!results.response){
      return;
    }
     
    //CLEAR INCOME TABLE
    const incomeTable= document.getElementById("recurring-income-t");
    incomeTable.innerHTML = "";
    
    //UPDATE INCOME TABLE
    if(results.income.length!=0){

      const incomeEntries=results.income;
      incomeEntries.forEach(entry=>{

        const category=entry.category;
        const amount=entry.amount;
        const id=entry.id;
        const row=document.createElement("tr");

        row.innerHTML=`
                      <td>${id}</td>
                      <td>${category}</td>
                      <td>${amount} </td>
                      <td><button class="delete-recurring-income"  data-id=${id} ><i class="fa-regular fa-trash-can"></i></button> </td>
                      `
        incomeTable.appendChild(row);


      });


    }
    
    //CLEAR EXPENSE TABLE
    const expenseTable= document.getElementById("recurring-expenses");
    expenseTable.innerHTML = ""
    
    //UPDATE EXPENSE TABLE
    if(results.expense.length!=0){

      const expenseEntries=results.expense;
      expenseEntries.forEach(entry=>{

        const category=entry.category;
        const amount=entry.amount;
        const id=entry.id;
        const description=entry.description;
        const row=document.createElement("tr");
        row.innerHTML=`
                      <td>${description} </td>
                      <td>${category}</td>
                      <td>${amount} </td>
                      <td><button class="delete-recurring-expense" data-id=${id}><i class="fa-regular fa-trash-can"></i></button> </td>
                      `
        expenseTable.appendChild(row);
      });

    }

  }
  catch(error){
    alert("Err loading-recurring entries")
  }

}

//TABLE'S EVENT DELEGATION 
const incomeTable = document.getElementById("recurring-income-t");
const expenseTable = document.getElementById("recurring-expenses");

incomeTable.addEventListener("click", function(e){
  const btn = e.target.closest(".delete-recurring-income");
  if (!btn) return;
  delete_recurring_income(e);
});

expenseTable.addEventListener("click", function(e){
  const btn = e.target.closest(".delete-recurring-expense");
  if (!btn) return;
  delete_recurring_expense(e);
});

//ADD EVENT LISTENERS
document.getElementById("save-settings-update").addEventListener("click",validate_settings_input);
document.getElementById("show_overview").addEventListener("click",show_overview);
document.getElementById("show_expense").addEventListener("click",show_expense);
document.getElementById("show_income").addEventListener("click",show_income);
document.getElementById("show-settings_btn").addEventListener("click",show_settings);
document.getElementById("show_summary").addEventListener("click",show_summary);
document.getElementById("show_recurring").addEventListener("click", show_recurring)
document.getElementById("addentry").addEventListener("click",addentry);
document.getElementById("show-last-x-exp").addEventListener("change",load_all_expenses);
document.getElementById("sort-exp-by").addEventListener("change",load_all_expenses);
document.getElementById("Filter-expense").addEventListener("change",load_all_expenses);
document.getElementById("submit_exp").addEventListener("click",submit_expense);
document.getElementById("addentry1").addEventListener("click",addentry1);
document.getElementById("show-last-x-income").addEventListener("change",load_income);
document.getElementById("sort-income-by").addEventListener("change",load_income);
document.getElementById("submit_income").addEventListener("click",submit_income);
document.getElementById("menu").addEventListener("click",menu_toogle);
document.getElementById("log-out").addEventListener("click",(e)=>{
   if (confirm("Are you sure you want to log out?")){
    log_out();
   }

});

//CALL FUNCTIONS
show_overview()
load_all_expenses();
load_income();
load_summary();
load_balances();
