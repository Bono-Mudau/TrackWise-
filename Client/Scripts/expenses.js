

function load_exp_filters(){

  default_exp_filter.filter=document.getElementById("Filter-expense").value;
  default_exp_filter.sort_by=document.getElementById("sort-exp-by").value;
  default_exp_filter.no_of_months=Number(document.getElementById("show-last-x-exp").value);

}

//show add expense card
function addentry(){

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
  load_exp_filters()

  fetch(`https://trackwise-9l4u.onrender.com/api/expenses/load_expenses`,{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    credentials: "include",
    body:JSON.stringify(default_exp_filter)
  })
  .then(res=>{

    //FORCE LOGOUT
    if (res.status === 401) {
      log_out(); 
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
      });

      //ADD TOTALS
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

    //VALIDATE USER INPUTS
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

      //FORCE LOGOUT
      if (res.status === 401) {
          log_out(); 
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

        //ensure the table is visible
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
       
        //add totals
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

      //FORCE LOGOUT
      if (res.status === 401) {
          log_out();
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

        //FORCE LOG-OUT
        if (res.status === 401) {
          log_out(); 
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
          }
          else{
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

