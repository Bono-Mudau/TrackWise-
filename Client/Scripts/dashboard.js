

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

//add event listeners
document.getElementById("save-settings-update").addEventListener("click",validate_settings_input);
document.getElementById("show_overview").addEventListener("click",show_overview);
document.getElementById("show_expense").addEventListener("click",show_expense);
document.getElementById("show_income").addEventListener("click",show_income);
document.getElementById("show-settings_btn").addEventListener("click",show_settings);
document.getElementById("show_summary").addEventListener("click",show_summary);
document.getElementById("show_recurring").addEventListener("click", show_recurring)

document.getElementById("log-out").addEventListener("click",(e)=>{
   if (confirm("Are you sure you want to log out?")){
    log_out();
   }

});
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

function menu_toogle(){
 const menu=document.getElementById("menu-options");
  if(menu.classList.contains("menu_class")){
      menu.classList.replace("menu_class","menu_class1");
  }
  else{
      menu.classList.replace("menu_class1","menu_class");
  }
}
load_user_details();

//get user details from the local storage
const user_info={
  names:localStorage.getItem("names"),
  id:Number(localStorage.getItem("id"))
}

//default expense fitlers/sorting
let default_exp_filter={
  sort_by:1,
  filter:0 ,// none
  no_of_months:1
}
let default_income_filter={

  sort_by:1,
  no_of_months:1

}

function load_income_filters(){

  default_income_filter.no_of_months=Number(document.getElementById("show-last-x-income").value);
  default_income_filter.sort_by=document.getElementById("sort-income-by").value;
  
}
function load_exp_filters(){

  default_exp_filter.filter=document.getElementById("Filter-expense").value;
  default_exp_filter.sort_by=document.getElementById("sort-exp-by").value;
  default_exp_filter.no_of_months=Number(document.getElementById("show-last-x-exp").value);

}

load_all_expenses();
load_income();
load_summary();
load_balances();


function remove_table_Rows(table_id) {

  const table = document.getElementById(table_id);
  while (table.rows.length > 1) {
    table.deleteRow(1);
  }

}
//update names on the dashboard
document.getElementById("user-names").innerHTML="Welcome, "+user_info.names;

//EXPENSES SECTION/
const expense_list=document.getElementById("expenses-list");

function addentry(){//show add expense card

    const entry=document.getElementById('C-exp-card');

    if(entry.classList.contains("create-expense-card1")){
        entry.classList.replace("create-expense-card1","create-expense-card");
    }
    else{
        entry.classList.replace("create-expense-card","create-expense-card1");
    }
}

async function load_all_expenses(){

  remove_table_Rows("expense-table")
  load_exp_filters();

  fetch(`https://trackwise-9l4u.onrender.com/api/expenses/load_expenses`,{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    credentials: "include",
    body:JSON.stringify(default_exp_filter)
  })
  .then(res=>{
    if (res.status === 401) {
        log_out(); // auto-logout on unauthorized
        return;
    }
    if(!res.ok){
      throw new Error("Couldn't load expense entries");
    }
    return res.json();
  })
  .then(data=>{
     if (!Array.isArray(data)) {
        throw new Error("Invalid data format");
      }
      if(data.length==0){
        document.getElementById("expense-table").style.display="none";
         document.getElementById("expense-trans-alternative").style.display="";
        return;
      }
      else{
        document.getElementById("expense-trans-alternative").style.display="none";
        document.getElementById("expense-table").style.display="";
      }

      let total=0;
      const trans_list=document.getElementById("expense-trans");
      trans_list.style.display="";
      data.forEach(element => {

        const row=document.createElement("tr");
        row.id="exp_row-"+element.exp_id;

        let status="Not Paid"
    
        if(element.status==1){
          status="Paid"
        }
        let due_Date="";
        if(element.due_date!=null){
          due_Date=element.due_date;
        }
        const edit=document.createElement("button");
        edit.innerHTML=`<i class="fa-solid fa-pen"></i>`;
        edit.classList.add("enable_exp_editing");

        const delete_btn=document.createElement("button");
        delete_btn.innerHTML=`<i class="fa-solid fa-trash"></i>`;
        delete_btn.classList.add("delete_exp");

        row.innerHTML=`
          <td>${element.description}</td>
          <td>${element.amount}</td>
          <td>${status}</td>
          <td>${due_Date.substring(0,10)}</td>
          <td>${element.category}</td>
          <td></td>
          `;

        row.cells[row.cells.length - 1].appendChild(edit);
        row.cells[row.cells.length - 1].appendChild(delete_btn);
        trans_list.appendChild(row);
        total+=Number(element.amount);
      })
      const row=document.createElement("tr");
      row.id="exp_table_total";
      row.innerHTML=`
          <td>Total</td>
          <td id="expense-sum" >R${total.toFixed(2)}</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        `;
      row.style.fontWeight = "bold";
      row.style.height = "20px";   
      trans_list.appendChild(row);

  })
  .catch(err => {
     alert("Unexpected error occurred");
     console.error(err);
  })
}

function submit_expense(){

    document.getElementById("submit_exp").disabled=true;
    //Data to be sent to the database
    let expense_entry={
      date:new Date().toISOString().slice(0, 19).replace("T", " "),
      description:"",
      category:"",
      amount:"",
      status:0,
      user_id:user_info.id,
      due_date:null,
      recurring:0
    }
    if(String(document.getElementById("description-input").value).length>=1){
      expense_entry.description=document.getElementById("description-input").value;     
    }
    else{
      alert("Description can not be empty!")
      document.getElementById("submit_exp").disabled=false;
      return;
    }

    if(isNaN(Number(String(document.getElementById("input-amount").value))) || document.getElementById("input-amount").value==""){
      alert("Enter a valid number");
      document.getElementById("submit_exp").disabled=false;
      return;
    }
    else{
      expense_entry.amount=Number(String(document.getElementById("input-amount").value))
    }

    if(document.getElementById("category-input").value!="none"){
      expense_entry.category=document.getElementById("category-input").value;
    }
    else{
      alert("Please select an option!");
      document.getElementById("submit_exp").disabled=false;
      return;
    }
    let due_Date=document.getElementById("due_date").value;
    if(due_Date.length>2){
          expense_entry.due_date=due_Date;
         
    }

    //check if its a recurring expense
    const recurring_input=document.getElementById("recurring-expense");
    if(recurring_input || recurring_input.checked){

      expense_entry.recurring=1;

    }

    //send data to the database
    fetch("https://trackwise-9l4u.onrender.com/api/expenses/new_expense",{
      method:"POST",
      headers:{
               "Content-Type":"application/json"
             },
      credentials: "include",
      body:JSON.stringify(expense_entry)
    })
    .then(res=>{
      if (res.status === 401) {
          log_out(); // auto-logout on unauthorized
          return;
      }
      if(!res.ok) {
        document.getElementById("submit_exp").disabled=false;
        throw new  Error("Server error: " + res.status);
        
      }
       return res.json()
    })
    .then(res=>{

      if(res.status){

        //ensure the table is not  hidden
        if(document.getElementById("expense-table").style.display=="none"){

           document.getElementById("expense-trans-alternative").style.display="none";
           document.getElementById("expense-table").style.display="";
       }
        let current_total=0;
        if(document.getElementById("exp_table_total")){

          current_total=document.getElementById("exp_table_total").cells[1].innerHTML.substring(1);
          document.getElementById("exp_table_total").remove()
          current_total=Number(current_total)+expense_entry.amount;
        }
        const id=res.id;
        const trans_list=document.getElementById("expense-trans")
        const row=document.createElement("tr");
        row.id="exp_row-"+id;
        let  status="Not Paid"
        if(expense_entry.status==1){
          status="Paid"
        }
        
        row.innerHTML=`
            <td>${expense_entry.description}</td>
            <td>${expense_entry.amount}</td>
            <td>${status}</td>
            <td>${due_Date}</td>
            <td>${expense_entry.category}</td>
            <td></td>
          `;
        row.cells[5].innerHTML=`
          <button class="enable_exp_editing"><i class="fa-solid fa-pen"></i></button>  
          <button class="delete_exp"> <i class="fa-solid fa-trash"></i> </button> 
        `;
       
        const t_row=document.createElement("tr");
        t_row.id="exp_table_total";
        t_row.innerHTML=`
            <td>Total</td>
            <td id="expense-sum">R${current_total}</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          `;
        t_row.style.fontWeight = "bold";
        t_row.style.height = "20px"; 
        trans_list.appendChild(row)
        trans_list.appendChild(t_row);
        addentry();
        document.getElementById("submit_exp").disabled=false;
      }
    })   
}

// variables to hold amount values before editing entries
let prev_income_amount=0;
let prev_expense_amount=0;

//Enable editing in the expense table
function enable_exp_editing(event){

  const row = event.target.closest("tr");

  //Retrieve current data in the cells
  const description=row.cells[0].innerText;
  const category=row.cells[4].innerText;
  const amount=row.cells[1].innerText;
  const status=row.cells[2].innerHTML;
  prev_expense_amount=amount;
  row.cells[0].innerHTML=`<input class="input-field"  type="text" maxlength="30" value="${description}">
  `;
  row.cells[4].innerHTML=`
  <select class="input-field" name="Category">

    <option value="none">Select</option>
    <option value="Groceries"> Groceries</option>
    <option value="Entertainment"> Entertainment</option>
    <option value="Transport"> Transport</option>
    <option value="Emergency"> Emergency</option>
    <option value="Taxes">Taxes</option>
    <option value="Rent">Rent</option>
    <option value="Travel"> Travel</option>
    <option value="Personal care"> Personal care</option>
    <option value="Health care">Health care</option>
    <option value="Clothing & Accessories">Clothing</option>
    <option value="Other">Other</option>

  </select>
  `;

  row.cells[4].querySelector("select").value = category;
  row.cells[1].innerHTML=` <input class="input-field"  type="text" maxlength="7" value="${amount}">`;
  row.cells[2].innerHTML=`Paid ?<input  type="checkbox">`
  if(status=="Paid"){
    row.cells[2].innerHTML=`Paid ?<input  type="checkbox"  checked>`
  }
  else{
    row.cells[2].innerHTML=`Paid ? <input  type="checkbox">`
  }
  row.cells[5].innerHTML=`<button class="update-exp-" >Save</button>`;
  
}

//event delagation
document.getElementById("expense-table").addEventListener("click", (e)=>{
  const element=e.target;

  if(element.closest(".update-exp-")){
    update_exp(e);
  }

  if(element.closest(".enable_exp_editing")){
    enable_exp_editing(e);
  }

  if(element.closest(".delete_exp")){
    delete_expense_entry(e);
  }

})

function delete_expense_entry(event){

  const selected_exp=event.target.closest("tr");
  const confirmed = confirm("Are you sure you want to delete this expense?");
  //confirm first if a user wants to delete an expense 
  if (!confirmed){
    return 
  }
  try {
    fetch("https://trackwise-9l4u.onrender.com/api/expenses/delete_expense",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      credentials: "include",
      body:JSON.stringify({
        id:selected_exp.id.replace("exp_row-" , "")})
    })
    .then(res=>{

      if (res.status === 401) {
          log_out(); // auto-logout on unauthorized
          return;
      }
      if(!res.ok){
        throw new Error("Error deleting an expense");
      }
      else{
        return res.json();
      }
      
    })
    .then(res=>{

      if(res.response){

        const total=Number((document.getElementById("expense-sum").innerHTML).substring(1));
        const amount=Number(selected_exp.cells[1].innerHTML);

        if(!isNaN(total) && !isNaN(amount)){
          const new_total=Number(total)-Number(amount);
          document.getElementById("expense-sum").innerHTML=`R ${new_total}`;
        }
      selected_exp.remove();
      }
      else{
        window.alert("expense not deleted");
      }
    })
    .catch(err=>{
      alert(err); 
      console.log(err)
    })

  } 
  catch (error) {
  window.alert("expense not deleted");

  }
}

function update_exp(event){

    const btn = event.target.closest(".update-exp-");
    const row=event.target.closest("tr");
    if(btn){
      btn.disabled=true;
      btn.innerText="Saving..."
    }
    event.target.closest(".update-exp-").disabled=true;
    let updated_expense={
      expense_id:row.id.replace("exp_row-",""),
      description:"",
      category:"",
      amount:0.00,
      status:0
     }

    //get the updated values
    const description=row.cells[0].querySelector("input");
    if(description.value.length<3){
      alert("Description too short");
      btn.disabled=false;
      btn.innerText="Save"
      return;
    }

    updated_expense.description=description.value;
    const category=row.cells[4].querySelector("select");
    if(category.value!="none"){
      updated_expense.category=category.value;
    }
    else{
      alert("Please select an option!")
      btn.disabled=false;
      btn.innerText="Save"
      return;
    }

    const amount=row.cells[1].querySelector("input");
    if(isNaN(Number(String(amount.value))) || amount.value=="" || amount.value<1){
      alert("Enter a valid number");
      btn.disabled=false;
      btn.innerText="Save"
      return;
    }

    updated_expense.amount=amount.value;
    const status=row.cells[2].querySelector("input");

    if(status.checked){
        updated_expense.status=1;
        status.checked=false;  
    }

    try {

      fetch("https://trackwise-9l4u.onrender.com/api/expenses/update_expense",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        credentials: "include",
        body:JSON.stringify(updated_expense)
      })
      .then(res=>{
        if (res.status === 401) {
          log_out(); // auto-logout on unauthorized
          return;
        }
        if(!res.ok){
          alert("network error, failed to update expense")
          throw new Error("Invaild db_resp");
        }
        return res.json();
      })
      .then(data=>{

        if(data.response){

          //update description
          description.value="";
          row.cells[0].innerHTML=updated_expense.description;

          //updtate category
          category.value="";
          row.cells[4].innerHTML=updated_expense.category;

          //update amount
          row.cells[1].innerHTML=updated_expense.amount;
          
          if(updated_expense.status==1){

              row.cells[2].innerHTML=`Paid`; 
          }else{

            row.cells[2].innerHTML="Not paid"
          }

          row.cells[5].innerHTML = `
            <button class="enable_exp_editing"><i class="fa-solid fa-pen"></i></button>  
            <button class="delete_exp"> <i class="fa-solid fa-trash"></i> </button> 
          `;

          //update the total
          const total=Number(document.getElementById("expense-sum").innerHTML.substring(1));
          if(!isNaN(total)) {

            const new_total=Number(total)-Number(prev_expense_amount)+Number(amount.value);
            document.getElementById("expense-sum").innerHTML=`R ${new_total}`;
            prev_expense_amount=0;
          }
          btn.innerText="Save"
          btn.disabled=false;
        }
        else{
          alert("DB_ERR:update exp");
          btn.disabled=false;
          btn.innerText="Save"
          return
        }
      })
      
    } catch (error) {
      console.log(error)
      
    }  
}

function cancel_update(){
    document.getElementById("edit_exp").classList.replace("edit-expense1","edit-expense");
}

async function get_overdue_expenses() {

   fetch("https://trackwise-9l4u.onrender.com/api/expenses/load_overdue_expenses",{
    method:"GET",
    headers:{"Content-Type":"application/json"},
    credentials:"include",
   })
   .then( res=>{

     if (res.status === 401) {
        log_out();// auto-logout on unauthorized
        return;
    }
    if(!res.ok){
      throw new Error("Error has occured _couldn't get graph data");
    }
    else{
      return res.json();
    }
   })
   .then(data=>{
    if(!data.response){
      alert("over_d-load-err");
      return;
    }
    else{
      if(!Array.isArray(data.rows)){
        alert("db-ovd-err");
        return
      }else{

        if(data.rows.length==0){
          document.getElementById("overdue-expense-section1").style.display="none";
        }
        else{
          document.getElementById("overdue-expense-section1").style.display="";
        }

        document.getElementById("overdue_exp_list").innerText=``;
        data.rows.forEach(item=>{
          const row=document.createElement("tr");
          row.innerHTML=`
            <td>${item.description}</td>
            <td>${item.amount}</td>
            <td>${item.due_date.substring(0,10)}</td>
      
          `;
          document.getElementById("overdue_exp_list").appendChild(row);

        })

      }
    }
   })
   .catch(error => {
        console.error("Fetch failed:", error);
    });
  
}
get_overdue_expenses();

//Income section
function submit_income(){

  document.getElementById("submit_income").disabled=true;
  if(document.getElementById("income-category-input").value=="none"){
    alert("Please select a category");
    document.getElementById("submit_income").disabled=false;
    return;
  }
  if(document.getElementById("income-amount").value=="" || isNaN(Number(document.getElementById("income-amount").value))){
    alert("Enter a valid amount");
    document.getElementById("submit_income").disabled=false;
    return;
  }

  const income_entry={
  category:document.getElementById("income-category-input").value,
  amount:document.getElementById("income-amount").value,
  recurring:0
  }

  //check if its a recurring income entry
  const recurring_input=document.getElementById("recurring-income");
  if(recurring_input || recurring_input.checked){
     income_entry.recurring=1;
  }

  document.getElementById("income-category-input").value="";
  document.getElementById("income-amount").value="";
  try {
    fetch("https://trackwise-9l4u.onrender.com/api/income/new_income",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      credentials: "include",
      body: JSON.stringify({
      category: income_entry.category,
      amount: income_entry.amount,
      user_id: user_info.id,
      recurring:income_entry.recurring
      })
    })
    .then(res=>{

      if (res.status === 401) {
        log_out(); // auto-logout on unauthorized
        return;
      }
      if(!res.ok){
        document.getElementById("submit_income").disabled=false;
        throw new Error("error adding an income entry");
      }
      return res.json()
      })
    .then(res=>{

      if(res.response){//entry added to the Database successfully

        //ensure the table is not hidden
        if(document.getElementById("income-table").style.display=="none"){
          document.getElementById("income-trans-alternative").style.display="none";
          document.getElementById("income-table").style.display="";
        }

        let current_total=0;
        if(!isNaN(Number(document.getElementById("income-sum").innerHTML.substring(1)))){ 
          current_total = Number(document.getElementById("income-sum").innerHTML.substring(1));
          current_total = Number(current_total)+Number(income_entry.amount);
          document.getElementById("income_table_total").remove()

        }
        if(document.getElementById("income_table_total")){
          document.getElementById("income_table_total").remove();
        }

        const id=res.id;
        const trans_list=document.getElementById("income-trans")
        const row=document.createElement("tr");

        row.id="income_row-"+id;
        row.innerHTML=`
          <td>${getdate()}</td>
          <td>${income_entry.category}</td>
          <td>${income_entry.amount}</td>
          <td></td>
        `;
        row.cells[3].innerHTML=`
          <button class="enable_income_editing"><i class="fa-solid fa-pen"></i></button>  
          <button class="delete_inc"> <i class="fa-solid fa-trash"></i> </button> 
        `;

        const t_row=document.createElement("tr");
        t_row.id="income_table_total";
        t_row.innerHTML=`
          <td>Total</td>
          <td></td>
          <td id="income-sum">R ${current_total}</td>
          <td></td>
        `;
        t_row.style.fontWeight = "bold";
        t_row.style.height = "20px"; 
        trans_list.appendChild(row)
        trans_list.appendChild(t_row);
        document.getElementById("submit_income").disabled=false;

      }
      else{
        document.getElementById("submit_income").disabled=false;
        alert("entry not added")
      }
      })             
    }
  catch (error) {
    console.log(error);
  }

  addentry1()
}

//delete income entry
function delete_income(event){

    const selected_income=event.target.closest("tr");
    const confirmed = confirm("Are you sure you want to delete this income entry?"+selected_income.id);
    
    if(confirmed){
      try {
        fetch("https://trackwise-9l4u.onrender.com/api/income/delete_income",{
          method:"POST",
          headers:{"Content-Type":"application/json"},
          credentials: "include",
          body:JSON.stringify({
            id:selected_income.id.replace("income_row-","")
          })
        })
        .then(res=>{
          if (res.status === 401) {
            log_out(); // auto-logout on unauthorized
            return;
          }
          if(!res.ok){
             throw new Error("Error deleting an income entry");  
          }
          else{
             return res.json();
          }
        })
        .then(res=>{

          if(res.response){

            //update the total
            const total=Number(document.getElementById("income-sum").innerHTML.substring(1));
            const amount=Number(selected_income.cells[2].innerHTML);

            if(!isNaN(total) && !isNaN(amount)){
              const new_total=Number(total)-Number(amount);
              document.getElementById("income-sum").innerHTML=`R ${new_total}`;
            }
            selected_income.remove();
          }
          else{
           window.alert("Income entry not deleted");
          }

        })
      }
      catch (error) {

        throw new error("income not deleted");
      }
      }
  else{
      window.alert("Income entry not deleted");
  }

}
//Load existing income entries
function load_income(){

  remove_table_Rows("income-table")
  load_income_filters();

  fetch("https://trackwise-9l4u.onrender.com/api/income/load_income",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      credentials: "include",
      body:JSON.stringify(default_income_filter)
  })
  .then(res=>{

    if (res.status === 401) {
      log_out(); // auto-logout on unauthorized
      return;
    }

    if(!res.ok){
       throw new Error("Failed to load existing income entries");
    }

    return res.json();

  })
  .then(data=>{

    if(!Array.isArray(data)){
      throw new Error("Invalid data format:income entries couldn't load");
    }

    if(data.length==0){
      document.getElementById("income-table").style.display="none";
      document.getElementById("income-trans-alternative").style.display="";
      return;
    }
    else{
      
      document.getElementById("income-trans-alternative").style.display="none";
      document.getElementById("income-table").style.display="";

    }

    let total=0;
    const trans_list=document.getElementById("income-trans");
    trans_list.innerHTML="",

    data.forEach(el=>{

        const edit=document.createElement("button");
        edit.innerHTML=`<i class="fa-solid fa-pen"></i> `;
        edit.classList.add("enable_income_editing")

        const delete_btn=document.createElement("button");
        delete_btn.innerHTML=` <i class="fa-solid fa-trash"> </i>  `;
        delete_btn.classList.add("delete_inc");

        const row=document.createElement("tr");
        row.id="income_row-"+el.income_id;
        row.innerHTML=`
            <td>${el.date.substring(0,10)}</td> 
            <td>${el.category}</td>
            <td>${el.amount}</td>
            <td></td>
          `;
        row.cells[row.cells.length - 1].appendChild(edit);
        row.cells[row.cells.length - 1].appendChild(delete_btn);
        trans_list.appendChild(row);
        total+=Number(el.amount);
    })
    const row=document.createElement("tr");
    row.id="income_table_total";
    row.innerHTML=`
        <td>Total</td>
        <td></td>
        <td id="income-sum">R ${total.toFixed(2)}</td>
        <td></td>
      `;
    row.style.fontWeight = "bold";
    row.style.height = "20px";   
    trans_list.appendChild(row);

  })
}

//event delagation
document.getElementById("income-table").addEventListener("click", (e)=>{
  const element=e.target;

  if(element.closest(".update-inc-")){
    update_income(e);
  }

  if(element.closest(".enable_income_editing")){
    enable_income_editing(e);
  }

  if(element.closest(".delete_inc")){
    delete_income(e);
  }

});

function addentry1(){

    const entry=document.getElementById('C-income-card');

    if(entry.classList.contains("create-income-card1")){
        entry.classList.replace("create-income-card1","create-income-card");
    }
    else{
        entry.classList.replace("create-income-card","create-income-card1");
    }
}

function update_income(event){
    
    const btn = event.target.closest(".update-inc-");
    if(btn){
      btn.disabled=true;
      btn.innerText="Saving..."
    }
  
    const row=event.target.closest("tr");
    const update_id=row.id;

    if(update_id==""){
      alert("Err_Id");
      btn.disabled=false;
      btn.innerText="Save"
      return;
    }

    //get the updated values
    const category=row.cells[1].querySelector("select");
    let new_cate=category.value;
    if(category.value!="none"){
      new_cate=category.value;
    }
    else{
      alert("Please select an option!")
      btn.disabled=false;
      btn.innerText="Save"
      return;
    }
    const amount=row.cells[2].querySelector("input");
    if(isNaN(Number(String(amount.value))) || amount.value=="" || amount.value<1){
      alert("Enter a valid number");
      btn.disabled=false;
      btn.innerText="Save"
      return;
    }
  
    try {
      let data={ 
        income_id:update_id.replace("income_row-",""),
        category:new_cate,
        amount:amount.value
      }
      fetch("https://trackwise-9l4u.onrender.com/api/income/update_income",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        credentials: "include",
        body:JSON.stringify(data)
      })
      .then(res=>{

        if(res.status === 401){
          log_out(); // auto-logout on unauthorized
          return;
        }
        if(!res.ok){

          throw new Error("DB_Err");
          
        }else{
          return res.json();
        }
      })
      .then(data=>{

        if(data.response){

          //updtate category
          category.value="";
          row.cells[1].innerHTML=new_cate;
  
          row.cells[2].innerHTML=amount.value;
          row.cells[3].innerHTML=`
            <button class="enable_income_editing"><i class="fa-solid fa-pen"></i></button>  
            <button class="delete_inc"> <i class="fa-solid fa-trash"></i> </button> 
          `;
          
          //update the total
          const total=Number(document.getElementById("income-sum").innerHTML.substring(1));
          if(!isNaN(total)) {

            const new_total=Number(total)-prev_income_amount+Number(amount.value);
            document.getElementById("income-sum").innerHTML=`R ${new_total}`;
            prev_income_amount=0;
            
          }
          btn.disabled=false;
          btn.innerText="Save"
        }
      })
      
    } 
    catch (error) {
      console.log(error)
      alert("err updating an entry")
      
    }
    
}
function enable_income_editing(event){

  const row = event.target.closest("tr");

  //Retrieve current data from the cells
  const category=row.cells[1].innerText;
  const amount=row.cells[2].innerText;
  prev_income_amount=amount;
  row.cells[1].innerHTML=` 
  <select class="input-field" name="Category">

    <option value="none">Select an option</option>
    <option value="Salary"> Salary</option>
    <option value="Investments">Investments</option>
    <option value="Donations">Donations</option>
    <option value="other">Other</option>
                          
  </select>
  `;
  row.cells[1].querySelector("select").value = category;
  row.cells[2].innerHTML=` <input class="input-field"  type="text" maxlength="7" value="${amount}">`
  row.cells[3].innerHTML=`<button class="update-inc-" >Save</button>`;
  
}
function cancel_update1(){
    document.getElementById("income_edit").classList.replace("edit-income1","edit-income");
}

function load_balances(){

  const balace_button=document.getElementById("current-balance");
  const income_btn=document.getElementById("total-income");
  const  expense_btn=document.getElementById("total-expenses");

  try {
    fetch("https://trackwise-9l4u.onrender.com/api/summary/load_balances", {
      method:"GET",
      headers:{"Content-Type":"application/json"},
      credentials: "include",
    })
    .then(res=>{
      if (res.status === 401) {
          log_out(); // auto-logout on unauthorized
          return;
      }
        if(!res.ok){
          throw new Error("DB_Err_load_balaces");
        }
        return res.json();
      })
    .then(data=>{
      if(data.response){

        balace_button.innerHTML="Balance: R  "+data.balance.toFixed(2);
        income_btn.innerHTML="Income: R  " + data.income;
        expense_btn.innerHTML="Expenses: R  "+data.expenses;
        const limit=Number(document.getElementById("setting-monthly-limit").value);
        
        //update budget indicator
        if (!isNaN(limit) && limit>0){

          const limitProgress = Math.min((data.expenses/limit)* 100,100).toFixed(2);
          document.getElementById("limit-progress").innerHTML= `Budget Used : ${limitProgress}%, (R${data.expenses} / R${limit} )`;
          
          if(limitProgress>85){
            document.getElementById("progress-container").style.color="red";
          }
          else{
            document.getElementById("progress-container").style.color="green"
          }
        }
         
      }
      else{
        alert("Summary not loaded!")
      }
      
    })
    
  } catch (error) {
    
  }

}

function recent_transactions(){
  remove_table_Rows("trans-table")
  try {
    fetch("https://trackwise-9l4u.onrender.com/api/summary/recent_trans",{
      method:"GET",
      headers:{"Content-Type":"application/json"},
      credentials: "include",
    })
    .then(res=>{
    if (res.status === 401) {
        log_out(); // auto-logout on unauthorized
        return;
    }
      if(!res.ok){
        throw new Error("DB_trans_resp_err");
      }
      return res.json();
    })
    .then(data=>{
      if(data.response){

        if(data.length==0){
          document.getElementById("trans-table").style.display="none";
          document.getElementById("recents-trans-alternative").style.display="";
          return;
        }
        else{
          document.getElementById("recents-trans-alternative").style.display="none";
          document.getElementById("trans-table").style.display="";
        }

        data.recent_transactions.forEach(entry=>{

          const trans_list=document.getElementById("recents-trans");
          trans_list.style.display=""

          const row=document.createElement("tr");
          row.id=entry.id;
          row.innerHTML=`
            <td>${entry.category}</td>
            <td>${entry.amount}</td>
            <td>${entry.type}</td>
          `;
          if(entry.type.toLowerCase() === "income") {
            row.style.color = "green";
          } else if(entry.type.toLowerCase() === "expense") {
            row.style.color = "red";
          }
          trans_list.appendChild(row);
        });
      }

    })
    
  } catch (error) {
    console.error(error);
  }
} 
recent_transactions();

//switch between sections

function show_expense(){
  
  const exp=document.getElementById("expense");  
  const income=document.getElementById("income");  
  const overview=document.getElementById("overview");
  const settings=document.getElementById("show-settings");
  const summary=document.getElementById("show-summary");
  const recurring=document.getElementById("recurring-section");

  if(recurring.className!="recurring"){
    recurring.classList.replace("recurring1","recurring")
  }

  if(summary.className!="show-summary"){
    summary.classList.replace("show-summary1","show-summary")
  }
  if(settings.className!="show-settings"){
    settings.classList.replace("show-settings1","show-settings")
  }  
  if(exp.className!="expsnse1"){
    exp.classList.replace("expense","expense1")
  }
  if(income.className!="income"){
    income.classList.replace("income1","income");
  }
  if(overview.className!="overview"){
    overview.classList.replace("overview1","overview");
  }
}

function show_income(){

  const exp=document.getElementById("expense");  
  const income=document.getElementById("income");  
  const overview=document.getElementById("overview");
  const settings=document.getElementById("show-settings");
  const summary=document.getElementById("show-summary");
  const recurring=document.getElementById("recurring-section");

  if(recurring.className!="recurring"){
    recurring.classList.replace("recurring1","recurring")
  }

  if(summary.className!="show-summary"){
    summary.classList.replace("show-summary1","show-summary")
  }

  if(settings.className!="show-settings"){
    settings.classList.replace("show-settings1","show-settings")
  } 

  if(exp.className!="expsnse"){
    exp.classList.replace("expense1","expense")
  }

  if(income.className!="income1"){
    income.classList.replace("income","income1");
  }

  if(overview.className!="overview"){
    overview.classList.replace("overview1","overview");
  }

}

function show_overview(){

  const exp=document.getElementById("expense");  
  const income=document.getElementById("income");  
  const overview=document.getElementById("overview"); 
  const settings=document.getElementById("show-settings");
  const summary=document.getElementById("show-summary");
  const recurring=document.getElementById("recurring-section");

  if(recurring.className!="recurring"){
    recurring.classList.replace("recurring1","recurring")
  }

  if(summary.className!="show-summary"){
    summary.classList.replace("show-summary1","show-summary")
  }

  if(settings.className!="show-settings"){
    settings.classList.replace("show-settings1","show-settings")
  }

  if(exp.className!="expsnse"){
    exp.classList.replace("expense1","expense")
  }

  if(income.className!="income"){
    income.classList.replace("income1","income");
  }

  if(overview.className!="overview1"){
    overview.classList.replace("overview","overview1");
  }

  //hide the charts section if both charts are empty
  if(document.getElementById("expenses_chart").style.display=="none" && document.getElementById("income_chart").style.display=="none"){
    document.getElementById("graph").style.display="none";
  }
  else{
    document.getElementById("graph").style.display="";

  }
  income_chart();
  expense_chart();
  monthly_summary();
  get_overdue_expenses();
  recent_transactions();
  load_balances();
}

function show_settings(){
  const exp=document.getElementById("expense");  
  const income=document.getElementById("income");  
  const overview=document.getElementById("overview");
  const settings=document.getElementById("show-settings");
  const summary=document.getElementById("show-summary");
  const recurring=document.getElementById("recurring-section");

  if(recurring.className!="recurring"){
    recurring.classList.replace("recurring1","recurring")
  }

  if(summary.className!="show-summary"){
    summary.classList.replace("show-summary1","show-summary")
  }

  if(settings.className!="show-settings1"){
    settings.classList.replace("show-settings","show-settings1")
  }

  if(exp.className!="expsnse"){
    exp.classList.replace("expense1","expense")
  }

  if(income.className!="income"){
    income.classList.replace("income1","income");
  }

  if(overview.className!="overview"){
    overview.classList.replace("overview1","overview");
  }
}


function show_summary(){

  const exp=document.getElementById("expense");  
  const income=document.getElementById("income");  
  const overview=document.getElementById("overview"); 
  const settings=document.getElementById("show-settings");
  const summary=document.getElementById("show-summary");
  const recurring=document.getElementById("recurring-section");

  if(recurring.className!="recurring"){
    recurring.classList.replace("recurring1","recurring")
  }

  if(summary.className!="show-summary1"){
    summary.classList.replace("show-summary","show-summary1")
  }

  if(settings.className!="show-settings"){
    settings.classList.replace("show-settings1","show-settings")
  }

  if(exp.className!="expsnse"){
    exp.classList.replace("expense1","expense")
  }

  if(income.className!="income"){
    income.classList.replace("income1","income");
  }

  if(overview.className!="overview"){
    overview.classList.replace("overview1","overview");
  }

}
function show_recurring(){

  const exp=document.getElementById("expense");  
  const income=document.getElementById("income");  
  const overview=document.getElementById("overview");
  const settings=document.getElementById("show-settings");
  const summary=document.getElementById("show-summary");
  const recurring=document.getElementById("recurring-section");

  if(recurring.className!="recurring1"){
    recurring.classList.replace("recurring","recurring1")
  }

  if(summary.className!="show-summary"){
    summary.classList.replace("show-summary1","show-summary")
  }

  if(settings.className!="show-settings"){
    settings.classList.replace("show-settings1","show-settings")
  }

  if(exp.className!="expsnse"){
    exp.classList.replace("expense1","expense")
  }

  if(income.className!="income"){
    income.classList.replace("income1","income");
  }

  if(overview.className!="overview"){
    overview.classList.replace("overview1","overview");
  }

  //load recurring entries
  load_recurring();
}


//log out 
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

//load monthly summary
function monthly_summary(){

  fetch("https://trackwise-9l4u.onrender.com/api/summary/monthly_summary", {

    method:"GET",
    headers:{"Content-Type":"application/json"},
    credentials: "include",


  })
  .then(res=>{

    if (res.status === 401) {
        log_out(); // auto-logout on unauthorized
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
      alert(res.error);
    }
    else{

      if(res.data.length==0){
        document.getElementById("charts").style.display="none";
        return;
      }
      else{
        document.getElementById("charts").style.display="";
      }

      const month_names=["Jan", "Feb", "Mar", "Apr", "May" ,"Jun" ,"Jul" , "Aug", "Sep" , "Oct" , "Nov", "Dec"];
      const expense_data=res.data.map(d=>d.expense);
      let income_data=res.data.map(d=>d.income);
      let labels=res.data.map(d=>` ${month_names[d.month-1]} ${d.year}`);
      
      const summary_chart=document.getElementById("monthly_summary_graph");
      const ctx = summary_chart.getContext("2d");
      const dpr = window.devicePixelRatio || 1;

      // Resize the canvas to match CSS size * DPR
      const rect = summary_chart.getBoundingClientRect();
      summary_chart.width = rect.width * dpr;
      summary_chart.height = rect.height * dpr;
      ctx.scale(dpr, dpr);

      const existingChart = Chart.getChart(summary_chart);

      if (existingChart) {
        existingChart.destroy();  // destroy it before creating a new chart
      }

      //create a income vs expense bar graph
      new Chart(ctx,{
        type:"bar",
        data:{

          labels:labels,
          datasets:[{
            label:"Income",
            data:income_data,
            backgroundColor:'rgba(75, 192, 192, 0.6)'

          },{

            label:"Expense",
            data:expense_data,
            backgroundColor:'rgba(255, 99, 132, 0.6)'
            
          }]
        },
        options:{

          responsive: true,
          plugins: {
              legend: { position: 'top' },
              title: { display: true,
                 text: 'Monthly Income vs Expense ',
                font:{
                  size:'16',
                  weight:'bold'
                },
               },
          },
          scales: { y: { beginAtZero: true } }
        }
      })

    }
  })

}
monthly_summary();

function income_chart(){


  fetch("https://trackwise-9l4u.onrender.com/api/summary/income_chart", {

    method:"GET",
    headers:{"Content-Type":"application/json"},
    credentials: "include",


  })
  .then(res=>{
      if (res.status === 401) {
        log_out(); // auto-logout on unauthorized
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
      alert(res.error);
    }
    else{

       if(res.data.length==0){
        document.getElementById("income_chart").style.display="none";
        return;
      }
      else{
        document.getElementById("income_chart").style.display="";

      }

      const labels=res.data.map(d=>d.category);
      const totals=res.data.map(d=>d.total);
      const summary_chart=document.getElementById("income_chart");
      const ctx = summary_chart.getContext("2d");
      const dpr = window.devicePixelRatio || 1;

      // Resize the canvas to match CSS size * DPR
      const rect = summary_chart.getBoundingClientRect();
      summary_chart.width = rect.width * dpr;
      summary_chart.height = rect.height * dpr;
      ctx.scale(dpr, dpr);

       const existingChart = Chart.getChart(summary_chart);

      if (existingChart) {
        existingChart.destroy();  // destroy it before creating a new chart
      }

      new Chart(ctx,{

        type:"pie",
        data:{

          labels:labels,

          datasets:[{
            data: totals,
            backgroundColor: [
              'rgba(255, 99, 132, 0.7)',    
              'rgba(54, 162, 235, 0.7)',    
              'rgba(255, 206, 86, 0.7)',   
              'rgba(75, 192, 192, 0.7)',    
              'rgba(153, 102, 255, 0.7)',   
              'rgba(255, 159, 64, 0.7)',    
              'rgba(199, 199, 199, 0.7)',   
              'rgba(255, 99, 255, 0.7)',    
              'rgba(99, 255, 132, 0.7)',    
              'rgba(54, 235, 162, 0.7)',    
              'rgba(86, 206, 255, 0.7)',   
              'rgba(192, 75, 192, 0.7)',    
              'rgba(255, 206, 128, 0.7)',   
              'rgba(153, 255, 102, 0.7)',   
              'rgba(102, 153, 255, 0.7)'  
            ],
            borderColor: '#fff',
            borderWidth: 1
          }]
        },
        options:{

          responsive: true,
          plugins: {
              legend: { position: 'right',
                labels: {
                  boxWidth: 20, 
                  padding: 10,
                  font: { size: 14}
                }},
              title: { display: true,
                 text: 'Income breakdown',
                font:{
                  size:'16',
                  weight:'bold'
                },
               },
          },
        }
      })

    }
  })

}
function expense_chart(){


  fetch("https://trackwise-9l4u.onrender.com/api/summary/expense_chart", {

    method:"GET",
    headers:{"Content-Type":"application/json"},
    credentials: "include",

  })
  .then(res=>{

    if (res.status === 401) {
        log_out(); // auto-logout on unauthorized
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
      alert(res.error);
    }
    else{

      if(res.data.length==0){
        document.getElementById("expenses_chart").style.display="none";
        return;
      }
      else{
        document.getElementById("expenses_chart").style.display="";
      }
      
      const labels=res.data.map(d=>d.category);
      const totals=res.data.map(d=>d.total);

      const maxLabelLength = 10;

      const truncatedLabels = labels.map(label =>
            label.length > maxLabelLength ? label.slice(0, maxLabelLength) + '…' : label
      );

      const summary_chart=document.getElementById("expenses_chart");
      const ctx = summary_chart.getContext("2d");
      const dpr = window.devicePixelRatio || 1;

      // Resize the canvas to match CSS size * DPR
      const rect = summary_chart.getBoundingClientRect();
      summary_chart.width = rect.width * dpr;
      summary_chart.height = rect.height * dpr;
      ctx.scale(dpr, dpr);

      const existingChart = Chart.getChart(summary_chart);

      if (existingChart) {
        existingChart.destroy();  // destroy it before creating a new chart
      }

      new Chart(ctx,{

        type:"pie",
        data:{

          labels:truncatedLabels,

          datasets:[{
            data: totals,
            backgroundColor: [
              'rgba(255, 99, 132, 0.7)',    
              'rgba(54, 162, 235, 0.7)',    
              'rgba(255, 206, 86, 0.7)',   
              'rgba(75, 192, 192, 0.7)',    
              'rgba(153, 102, 255, 0.7)',   
              'rgba(255, 159, 64, 0.7)',    
              'rgba(199, 199, 199, 0.7)',   
              'rgba(255, 99, 255, 0.7)',    
              'rgba(99, 255, 132, 0.7)',    
              'rgba(54, 235, 162, 0.7)',    
              'rgba(86, 206, 255, 0.7)',   
              'rgba(192, 75, 192, 0.7)',    
              'rgba(255, 206, 128, 0.7)',   
              'rgba(153, 255, 102, 0.7)',   
              'rgba(102, 153, 255, 0.7)'    
            ],
            borderColor: '#fff',
            borderWidth: 1
          }]
        },

        options:{

          responsive: true,
          plugins: {
              legend: { position: 'right',
                labels: {
                  boxWidth: 20,     
                  padding: 8,
                  font: { size: 14}
                }},
              title: { display: true,
                 text: 'Expense breakdown',
                font:{
                  size:'16',
                  weight:'bold'
                },
               },
          },
        }
      })

    }
  })
}
income_chart();
expense_chart();



function setting_toggle(){

  const inputs=document.querySelectorAll(".settings-input-field");
  const checkboxes=document.querySelectorAll(".settings-input-checkbox");

  //enable input
  inputs.forEach(element=>{
    if(element.readOnly){
      element.readOnly=false;
    }else{
      element.readOnly=true;
    }
    
  })
   
  //enable chekboxes
  checkboxes.forEach(element=>{
    if ( element.disabled) {
      element.disabled=false;
    }
    else{
      element.disabled=true;
    }
  })
  //make the update button visible
  if (document.getElementById("save-settings-update").style.display=="none") {

    document.getElementById("save-settings-update").style.display="";
    
  } else {
    // hide the button
    document.getElementById("save-settings-update").style.display="none";
    
  }
  
}
document.getElementById("setting-edit-button").addEventListener("click",setting_toggle);


//Update settings
async function validate_settings_input(){
  
  setting_toggle();
  const f_name=document.getElementById("setting-First-name").value;
  const l_name=document.getElementById("setting-last-name").value;
  
  //Ensure user provides an Input
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

  }else{
    notification_on=0;
  }
  if(p_remainders){

    p_remainders=1;

  }else{
    p_remainders=0;
  }
  if(overdue){
    overdue=1;

  }else{
    overdue=0;
  }

  //Ensure user provides an Input
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
    console.error(error);
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
 
  } catch (error) {
    return false;
  }
  
}
function delete_user_account(){

  document.getElementById("delete-account-btn").disabled=true;
  const delete_a=confirm("Are you sure you want to permanently delete your account?");
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
      if (res.status === 401) {
          log_out();// auto-logout on unauthorized
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
    }).then(res=>{
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

        //set settings fields
          const data=res.data;
          document.getElementById("setting-First-name").value=data.firstName;
          document.getElementById("setting-last-name").value=data.lastName;
          document.getElementById("setting-monthly-limit").value=data.budget_limit;
          document.getElementById("setting-user-email").value=data.email;
          let notification_on=data.notifications_status;
          let p_remainders=data.payment_remainder;
          let overdue=data.overdue_expenses;
          if(notification_on==1){
            document.getElementById("setting-notify-via email?").checked=true;
          }else{
            document.getElementById("setting-notify-via email?").checked=false;
          }
          if(p_remainders==1){

            document.getElementById("setting-payment-remainder?").checked=true;

          }else{
            document.getElementById("setting-payment-remainder?").checked=false;
          }
          if(overdue==1){
            document.getElementById("setting-overdue-exp?").checked=true;
          }else{
            document.getElementById("setting-overdue-exp?").checked=false;
          }

          //get user initials
          if( data.lastName && data.lastName.trim()!=""){
            document.getElementById("user-initials").innerHTML=data.lastName.charAt(0)+""+data.firstName.charAt(0)
          }
          else if( data.firstName && data.firstName.split(" ").length>1){
            const initials=data.firstName.split(" ");
            document.getElementById("user-initials").innerHTML=initials[1].charAt(0)+""+initials[0].charAt(0);
          }
          else if( data.firstName){

            document.getElementById("user-initials").innerHTML=data.firstName.charAt(0)

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


function generate_monthly_summary_cards( month, year,  expense, income ,amount,description){

  const summaryCard=document.createElement("div");
  summaryCard.classList.add("summary-card-month");

  //set background colour to red where the user overspent
  if( expense > income ){
    summaryCard.style.backgroundColor="rgba(255, 150, 150, 0.3)";
  }
  else{

    summaryCard.style.backgroundColor="rgba(170, 255, 170, 0.3)";

  }

  summaryCard.innerHTML= `
        <p >${ month_names[month-1] } ${year}</p>

        <label  > Total Expenses:R  ${ expense} </label>
        <label  > Total Income: R ${income}</label>
        <label  > Biggest spending: R ${ amount }:  ${description} </label>
      `;
  document.getElementById("summary-section").appendChild(summaryCard);
}

async function load_summary() {

  try {
        const res= await fetch("https://trackwise-9l4u.onrender.com/api/summary/load_summary",{
          method:"GET",
          headers:{"Content-Type":"application/json"},
          credentials:"include"
        })
        if (res.status === 401) {
            log_out(); // auto-logout on unauthorized
            return;
        }
        if(!res.ok){
          throw new Error("Couldn't load expense entries");
        }
        
        const results = await res.json();

        if(results.response){
          
          results.data.forEach( data=>{

            generate_monthly_summary_cards(data.month, data.year, data.expense, data.income, data.amount, data.description);

          })
        }
        else{
           alert("failed to load summary!!, try again later");
        }

    
  } catch (error) {
    console.log("err"+ error);
    
  }
}

//recurring Income / Expenses

async function delete_recurring_expense(e){

  if(!confirm("Delete entry?")){
    return;
  }

  //get entry's id
  const btn=e.target.closest("[data-id]");
  btn.disabled=true;

  if(!btn){
    return;
  }
  const id=btn.dataset.id;

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

    if (res.status === 401) {
          log_out(); // auto-logout on unauthorized
          return;
    }

    if(!res.ok){
      alert("network error, entry not deleted")
      throw new Error("Invaild db_resp");
    }
    
    const results= await res.json();
    if(results.response){

      //remove element from the table
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

  //get entry's id
  const btn=e.target.closest("[data-id]")
  btn.disabled=true;
  if(!btn){
    console.log("but not found");
    return;
  }
  const id=btn.dataset.id

  if(!id){
    alert("Err:entry not deleted"+id);
    return;
  }

  try {

    const res=await fetch("https://trackwise-9l4u.onrender.com/api/income/delete_recurring_income", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      credentials:"include",
      body:JSON.stringify({id:id})
    });

    if (res.status === 401) {
          log_out(); // auto-logout on unauthorized
          return;
    }

    if(!res.ok){
      alert("Err:entry not deleted");
      throw new Error("Invaild db_resp");
    }
    
    const results= await res.json();
    if(results.response){

      //remove element from the table
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

    if (res.status === 401) {
          log_out(); // auto-logout on unauthorized
          return;
    }

    if(!res.ok){
      alert("network error, failed to load reccuring entries")
      throw new Error("Invaild db_resp");
    }
    
    const results= await res.json();
     
    if(!results.response){
      return;//return if no data is received
    }

    const incomeTable= document.getElementById("recurring-income-t");
    incomeTable.innerHTML = ""//clear the table
    
    //Update recurring income table
    if(results.income.length!=0){
      
      const incomeEntries=results.income;
      
      incomeEntries.forEach(entry=>{

        const category=entry.category;
        const amount=entry.amount;
        const id=entry.id;
        const row=document.createElement("tr");

        row.innerHTML=`
                      <td>${id} </td>
                      <td>${category}</td>
                      <td>${amount} </td>
                      <td><button class="delete-recurring-income"  data-id=${id} ><i class="fa-regular fa-trash-can"></i></button> </td>
                      `
        incomeTable.appendChild(row);


      });


    }

    const expenseTable= document.getElementById("recurring-expenses");
    expenseTable.innerHTML = ""//clear the table
    
    //update recurring expenses table
    if(results.expense.length!=0){

    
      const expenseEntries=results.expense;
      
      
      expenseEntries.forEach(entry=>{

        const category=entry.category;
        const amount=entry.amount;
        const id=entry.id;
        const description=entry.description;
        const row=document.createElement("tr");

        row.innerHTML=`
                      <td>${id} </td>
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

const incomeTable = document.getElementById("recurring-income-t");
incomeTable.addEventListener("click", function(e){
  const btn = e.target.closest(".delete-recurring-income");
  if (!btn) return;
  delete_recurring_income(e);
});

const expenseTable = document.getElementById("recurring-expenses");
expenseTable.addEventListener("click", function(e){
  const btn = e.target.closest(".delete-recurring-expense");
  if (!btn) return;
  delete_recurring_expense(e);
});

  



