
function getdate(){
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return yyyy+"-"+mm+"-"+dd
}

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
load_all_expenses();
load_income();

//update names on the dashboard
document.getElementById("user-names").innerHTML="Wellcome, "+user_info.names;

//EXPENSES SECTION/
const expense_list=document.getElementById("expenses-list");
function addentry(){
    const entry=document.getElementById('C-exp-card');
    if(entry.classList.contains("create-expense-card1")){
        entry.classList.replace("create-expense-card1","create-expense-card");
    }else
    {
        entry.classList.replace("create-expense-card","create-expense-card1");
    }
}

function load_all_expenses(){
  fetch(`http://localhost:3000/api/expenses/load_expenses?user_id=${user_info.id}`,{
    method:"GET",
    headers:{"Content-Type":"application/json"},
  })
  .then(res=>{
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
        return alert("No expenses available")
      }
      let total=0;
      const trans_list=document.getElementById("expense-trans")
      data.forEach(element => {
        const row=document.createElement("tr");
        row.id="exp_row-"+element.exp_id;
        let status="Not Paid"
        if(element.status==1){
          status="Paid"
        }
        const edit=document.createElement("button");
        edit.innerHTML="edit";
        edit.addEventListener("click", enable_exp_editing)
        const delete_btn=document.createElement("button");
        delete_btn.innerHTML="Delete";
        delete_btn.addEventListener("click",delete_expense_entry)
        row.innerHTML=`
            <td>${element.exp_id}</td>
            <td>${element.date_created.substring(0,10)}</td>
            <td>${element.description}</td>
            <td>${element.category}</td>
            <td>${element.amount}</td>
            <td>${status}</td>
            <td></td>
          `;
        row.cells[row.cells.length - 1].appendChild(edit);
        row.cells[row.cells.length - 1].appendChild(delete_btn);
        trans_list.appendChild(row);
        total+=element.amount;
      })
      const row=document.createElement("tr");
      row.id="exp_table_total";
      row.innerHTML=`
          <td>Total</td>
          <td></td>
          <td></td>
          <td></td>
          <td id="expense-sum" >R${total}</td>
          <td></td>
          <td></td>
        `;
      row.style.fontWeight = "bold";
      row.style.height = "20px";   
      trans_list.appendChild(row);
      load_balances();
  })
  .catch(err => {
     alert("Unexpected error occurred");
     console.error(err);
  })
}

function submit_expense(){
    //Data to be sent to the database
    let expense_entry={
      date:getdate(),
      description:"",
      category:"",
      amount:"",
      status:0,
      user_id:user_info.id
    }
    if(String(document.getElementById("description-input").value).length>=1){
      expense_entry.description=document.getElementById("description-input").value;     
    }
    else{
      alert("Description can not be empty!")
      return;
    }

    if(isNaN(Number(String(document.getElementById("input-amount").value))) || document.getElementById("input-amount").value==""){
      alert("Enter a valid number");
      return;
    }
    else{
      expense_entry.amount=Number(String(document.getElementById("input-amount").value))
    }

    if(document.getElementById("category-input").value!="none"){
      expense_entry.category=document.getElementById("category-input").value;
    }
    else{
      alert("Please select an option!")
      return;
    }

    //send data to the database
    fetch("http://localhost:3000/api/expenses/new_expense",{
      method:"POST",
      headers:{
               "Content-Type":"application/json"
             },
      body:JSON.stringify(expense_entry)
    })
    .then(res=>{
      if(!res.ok) {
        throw new  Error("Server error: " + res.status);
      }
       return res.json()
    })
    .then(res=>{
      if(res.status){
        let current_total=0;
        if(document.getElementById("exp_table_total")){
          current_total=document.getElementById("exp_table_total").cells[4].innerHTML.substring(1);
          document.getElementById("exp_table_total").remove()
          alert(current_total);
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
            <td>${id}</td>
            <td>${expense_entry.date}</td>
            <td>${expense_entry.description}</td>
            <td>${expense_entry.category}</td>
            <td>${expense_entry.amount}</td>
            <td>${status}</td>
            <td></td>
          `;
        row.cells[6].innerHTML=`<button onclick="enable_exp_editing(event)"> Edit </button> <button onclick="delete_expense_entry(event)"> Delete</button> `
        const t_row=document.createElement("tr");
        t_row.id="exp_table_total";
        t_row.innerHTML=`
            <td>Total</td>
            <td></td>
            <td></td>
            <td></td>
            <td id="expense-sum">R${current_total}</td>
            <td></td>
            <td></td>
          `;
        t_row.style.fontWeight = "bold";
        t_row.style.height = "20px"; 
        trans_list.appendChild(row)
        trans_list.appendChild(t_row);
        load_balances();
        addentry()
      }
    })   
}

//Enable editing in the expense table
function enable_exp_editing(event){
  const row = event.target.closest("tr");
  const row_id=row.id;
  //Retrieve current data in the cells
  const description=row.cells[2].innerText;
  const category=row.cells[3].innerText;
  const amount=row.cells[4].innerText;
  const status=row.cells[5].innerHTML;
  row.cells[2].innerHTML=`<input class="input-field"  type="text" maxlength="30" value="${description}">
  `;
  row.cells[3].innerHTML=` <select class="input-field" name="Category">
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
                            <option value="Clothing & Accessories">Clothing & Accessories</option>
                            <option value="Other">Other</option>
                          </select>
  `;
  row.cells[3].querySelector("select").value = category;
  row.cells[4].innerHTML=` <input class="input-field"  type="text" maxlength="7" value="${amount}">`;
  row.cells[5].innerHTML=`Paid ?<input  type="checkbox">`
  if(status=="Paid"){
    row.cells[5].innerHTML=`Paid ?<input  type="checkbox"  checked>`
  }
  else{
    row.cells[5].innerHTML=`Paid ?<input  type="checkbox">`
  }
  row.cells[6].innerHTML=`<button onclick="update_exp(event)" >Save</button>`;
}

function add_expense_to_the_list(id,expense_entry){

        //Create an expense card and add it to the expsenses list
        const entry=document.createElement("div");
        entry.id=id+"";

        const exp_=document.createElement("label");
        exp_.textContent=id+"";
        exp_.id=id+"id";
        entry.appendChild(exp_);

        //date
        const exp_date=document.createElement("label");
        let date = expense_entry.date_created+"";
        date=date.substring(0,10);
        exp_date.textContent= date;

        exp_date.id=id+"-date";
        entry.appendChild(exp_date);
    
        //expense description
        const exp_des=document.createElement("label");
        exp_des.textContent=expense_entry.description;
        exp_des.id=id+"-description";
        entry.appendChild(exp_des);
      
        const exp_cate=document.createElement("label");
        exp_cate.textContent=expense_entry.category;
        exp_cate.id=id+"-category";
        entry.appendChild(exp_cate);
   
        const exp_amount=document.createElement("label");
        exp_amount.textContent=expense_entry.amount;
        exp_amount.id=id+"-amount";
        entry.appendChild(exp_amount);


        //Status label
        const exp_status=document.createElement("label");
        exp_status.id=id+"-status";
        if(expense_entry.status==1){
          exp_status.textContent="Paid"
        }
        else{
          exp_status.textContent="Not paid"
        }
        entry.appendChild(exp_status);
    
        //Edit button
        const edit_button=document.createElement("button");
        edit_button.textContent="edit";
        edit_button.addEventListener("click", function(e){
           //get the id of expense to be edited
           const parent_element=e.target.closest(".expense-card");
           const edit_id=parent_element.id;
           document.getElementById("expense-edit-id").textContent=String(edit_id);
           document.getElementById("edit_exp").classList.replace("edit-expense","edit-expense1") 
        })    
        //delete expense button
       const exp_button=document.createElement("button");
       exp_button.textContent="Delete";
       exp_button.id=id+"";
       //delete an expense from the list 
       exp_button.addEventListener("click",delete_expense_entry); 
       
      const lab=document.createElement("label");
      lab.appendChild(edit_button);
      lab.appendChild(exp_button);
      lab.className="lab"
      entry.appendChild(lab);
      expense_list.appendChild(entry);
      entry.className="expense-card";
      document.getElementById('C-exp-card').classList.replace("create-expense-card","create-expense-card1");

}
function delete_expense_entry(event){
         const selected_exp=event.target.closest("tr");
         const confirmed = confirm("Are you sure you want to delete this expense?");
         //confirm first if a user wants to delete an expense 
         if (!confirmed){
          return 
         }
         try {
           fetch("http://localhost:3000/api/expenses/delete_expense",{
             method:"POST",
             headers:{"Content-Type":"application/json"},
             body:JSON.stringify({
               id:selected_exp.id.replace("exp_row-", "")})
            })
           .then(res=>{
              if(!res.ok){
                throw new Error("Error deleting an expense");
              }
              else{
                return res.json();
              }
              
            })
           .then(res=>{
             if(res.response){
              selected_exp.remove();
              load_balances();
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
    const row=event.target.closest("tr");
    let updated_expense={
      expense_id:row.id.replace("exp_row-",""),
      description:"",
      category:"",
      amount:0.00,
      status:0
     }
    //get the updated values
    const description=row.cells[2].querySelector("input");
    if(description.value.length<3){
      alert("Description too short")
      return;
    }
    updated_expense.description=description.value;
    const category=row.cells[3].querySelector("select");
    if(category.value!="none"){
      updated_expense.category=category.value;
    }
    else{
      alert("Please select an option!")
      return;
    }
    const amount=row.cells[4].querySelector("input");
    if(isNaN(Number(String(amount.value))) || amount.value=="" || amount.value<1){
      alert("Enter a valid number");
      return;
    }
    updated_expense.amount=amount.value;
    const status=row.cells[5].querySelector("input");
    if(status.checked){
        updated_expense.status=1;
        status.checked=false;  
    }

    try {

      fetch("http://localhost:3000/api/expenses/update_expense",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(updated_expense)
      })
      .then(res=>{
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
          row.cells[2].innerHTML=updated_expense.description;

          //updtate category
          category.value="";
          row.cells[3].innerHTML=updated_expense.category;

          //update amount
          document.getElementById("exp-amount-edt").value="";
          row.cells[4].innerHTML=updated_expense.amount;
          
          if(updated_expense.status==1){
              row.cells[5].innerHTML=`Paid`; 
          }else{
            row.cells[5].innerHTML="Not paid"
          }
          row.cells[6].innerHTML=`<button onclick="enable_exp_editing(event)" > Edit </button> 
                                  <button onclick="delete_expense_entry(event)" > Delete </button>
                                `
          load_balances();
        }
        else{
          alert("DB_ERR:update exp");
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


//Income section
  function submit_income(){
    if(document.getElementById("income-amount").value=="" || isNaN(Number(document.getElementById("income-amount").value))){
      alert("Enter a valid amount");
      return;
    }
    if(document.getElementById("income-category-input").value=="none"){
      alert("Please select a category");
      return;
    }
    const income_entry={
      category:document.getElementById("income-category-input").value,
      amount:document.getElementById("income-amount").value,
    }
    try {
            fetch("http://localhost:3000/api/income/new_income",{
              method:"POST",
              headers:{"Content-Type":"application/json"},
              body: JSON.stringify({
                  category: income_entry.category,
                  amount: income_entry.amount,
                  user_id: user_info.id
                })
            })
            .then(res=>{
              if(!res.ok){
                throw new Error("error adding an income entry");
              }
              return res.json()
            })
            .then(res=>{
              if(res.response){//entry added to the Database successfully
                let current_total=0;
                if(document.getElementById("income_table_total")){
                  current_total=document.getElementById("income_table_total").cells[3].innerHTML.substring(1);
                  document.getElementById("income_table_total").remove()
                  current_total=Number(current_total)+Number(income_entry.amount);
                }
                
                const id=res.id;
                const trans_list=document.getElementById("income-trans")
                const row=document.createElement("tr");
                row.id="income_row-"+id;
                row.innerHTML=`
                    <td>${id}</td>
                    <td>date</td>
                    <td>${income_entry.category}</td>
                    <td>${income_entry.amount}</td>
                    <td></td>
                  `;
                row.cells[4].innerHTML=`<button onclick="enable_income_editing(event)"> edit </button> <button onclick="delete_income(event)"> Delete</button> `
                const t_row=document.createElement("tr");
                t_row.id="income_table_total";
                t_row.innerHTML=`
                    <td>Total</td>
                    <td></td>
                    <td></td>
                    <td id="expense-sum">R${current_total}</td>
                    <td></td>
                  `;
                t_row.style.fontWeight = "bold";
                t_row.style.height = "20px"; 
                trans_list.appendChild(row)
                trans_list.appendChild(t_row);
                load_balances();
                addentry1()
                }
              else{
                 alert("entry not added")
                }
            })             
           } catch (error) {
            
           }
    document.getElementById('C-income-card').classList.replace("create-income-card","create-income-card1");
}

//delete income entry
function delete_income(event){
    const selected_income=event.target.closest("tr");
    const confirmed = confirm("Are you sure you want to delete this income entry?"+selected_income.id);
    if(confirmed){
    try {
      fetch("http://localhost:3000/api/income/delete_income",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          id:selected_income.id.replace("income_row-","")
        })
      }).then(res=>{
        if(!res.ok){
          throw new Error("Error deleting an income entry");  
        }
        else{
          return res.json();
        }
      }).then(res=>{

        if(res.response){
          selected_income.remove();
          load_balances();
        }else{
              window.alert("Income entry not deleted");
          }
      })
    } catch (error) {
      throw new error("income not deleted");
      
    }
    }
  else{
      window.alert("Income entry not deleted");
  }

}
//Load existing income entries
function load_income(){
  const id=user_info.id;
  fetch("http://localhost:3000/api/income/load_income",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({id})
  }).then(res=>{
    if(!res.ok){
      throw new Error("Failed to load existing income entries");
    }
    return res.json();
  }).then(data=>{
    if(!Array.isArray(data)){
      throw new Error("Invalid data format:income entries couldn't load");
    }
    let total=0;
    const trans_list=document.getElementById("income-trans")
    data.forEach(el=>{
        const edit=document.createElement("button");
        edit.innerHTML="edit";
        edit.addEventListener("click", enable_income_editing)
        const delete_btn=document.createElement("button");
        delete_btn.innerHTML="Delete";
        delete_btn.addEventListener("click",delete_income)
        const row=document.createElement("tr");
        row.id="income_row-"+el.income_id;
        //edit.addEventListener("click",enable_editing)
        row.innerHTML=`
            <td>${el.income_id}</td>
            <td>${el.date.substring(0,10)}</td> 
            <td>${el.category}</td>
            <td>${el.amount}</td>
            <td></td>
          `;
        row.cells[row.cells.length - 1].appendChild(edit);
        row.cells[row.cells.length - 1].appendChild(delete_btn);
        trans_list.appendChild(row);
        total+=Number(el.amount)
    })
    const row=document.createElement("tr");
    row.id="income_table_total";
    row.innerHTML=`
        <td>Total</td>
        <td></td>
        <td></td>
        <td id="income-sum">R${total}</td>
        <td></td>
      `;
    row.style.fontWeight = "bold";
    row.style.height = "20px";   
    trans_list.appendChild(row);
    load_balances();
  })
}

function add_income_to_the_list(income_entry){

  //Create an income card and add it to the income list
  const entry=document.createElement("div");
  entry.id=income_entry.income_id+"";

  const inc_=document.createElement("label");
  inc_.textContent=income_entry.income_id;
  entry.appendChild(inc_);


  const income_cate=document.createElement("label");
  income_cate.textContent=income_entry.category;
  entry.appendChild(income_cate);

  const income_amount=document.createElement("label");
  income_amount.textContent=income_entry.amount;
  income_amount.id=income_entry.income_id+"income_amount"
  entry.appendChild(income_amount);

  //delete income button
  const income_button=document.createElement("button");
  income_button.textContent="Delete"; 
  income_button.addEventListener("click",delete_income);

  //Edit button
  const edit_buttonn=document.createElement("button");
  edit_buttonn.textContent="edit";
  edit_buttonn.addEventListener("click", function(e){

      //get the id of income to be edited
      const parent_element=e.target.closest(".income-card");
      const edit_id=parent_element.id;
      document.getElementById("income-edit-id").textContent=edit_id+"";
      document.getElementById("income_edit").classList.replace("edit-income","edit-income1")     
  });

  const lab=document.createElement("label");
  lab.appendChild(edit_buttonn);
  lab.appendChild(income_button);
  lab.className="lab"
  entry.appendChild(lab);

  income_list.appendChild(entry);
  entry.className="income-card";
}

function addentry1(){
    const entry=document.getElementById('C-income-card');
    if(entry.classList.contains("create-income-card1")){
        entry.classList.replace("create-income-card1","create-income-card");
    }else{
        entry.classList.replace("create-income-card","create-income-card1");
    }
}

function update_income(event){
    const row=event.target.closest("tr");
    const update_id=row.id;
    if(update_id==""){
      alert("Err_Id");
      return;
    }

    //get the updated values
    const category=row.cells[2].querySelector("select");
    let new_cate=category.value;
    if(category.value!="none"){
      new_cate=category.value;
    }
    else{
      alert("Please select an option!")
      return;
    }
    const amount=row.cells[3].querySelector("input");
    if(isNaN(Number(String(amount.value))) || amount.value=="" || amount.value<1){
      alert("Enter a valid number");
      return;
    }
  
    try {
      let data={ income_id:update_id.replace("income_row-",""),
        category:new_cate,
        amount:amount.value
      }
      fetch("http://localhost:3000/api/income/update_income",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(data)
      })
      .then(res=>{
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
          row.cells[2].innerHTML=new_cate;
          //update amount
          document.getElementById("exp-amount-edt").value="";
          row.cells[3].innerHTML=amount.value;
          row.cells[4].innerHTML=`<button onclick="enable_income_editing(event)"> Edit </button>  <button onclick="delete_income(event)" >Delete</button>`
          load_balances();
        }
      })
      
    } catch (error) {
      console.log(error)
      
    }
    
}
function enable_income_editing(event){
  const row = event.target.closest("tr");
  //Retrieve current data in the cells
  const category=row.cells[2].innerText;
  const amount=row.cells[3].innerText;
  row.cells[2].innerHTML=` <select class="input-field" name="Category">
                            <option value="none">Select an option</option>
                            <option value="Salary"> Salary</option>
                            <option value="Investments">Investments</option>
                            <option value="Donations">Donations</option>
                            <option value="other">Other</option>
                          </select>
  `;
  row.cells[2].querySelector("select").value = category;
  row.cells[3].innerHTML=` <input class="input-field"  type="text" maxlength="7" value="${amount}">`
  row.cells[4].innerHTML=`<button onclick="update_income(event)" >Save</button>`;
}
function cancel_update1(){
    document.getElementById("income_edit").classList.replace("edit-income1","edit-income");
}

function load_balances(){
  const balace_button=document.getElementById("current-balance");
  const welcome_btn=document.getElementById("welcome-msg");
  const income_btn=document.getElementById("total-income");
  const  expense_btn=document.getElementById("total-expenses");
  try {
    fetch("http://localhost:3000/api/summary/load_balances", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({user_id:user_info.id})
    })
    .then(res=>{
      if(!res.ok){
        throw new Error("DB_Err_load_balaces");
      }
      return res.json();
    })
    .then(data=>{
      if(data.response){
        balace_button.innerHTML="Balance: R"+data.balance;
        income_btn.innerHTML="Total Income: R" + data.income;
        expense_btn.innerHTML="Total Expenses: R"+data.expenses;
        document.getElementById("expense-sum").innerHTML="R"+data.expenses;
        document.getElementById("income-sum").innerHTML="R" +data.income;
      }
      else{
        alert("Summary not loaded!")
      }
      
    })
    
  } catch (error) {
    
  }

}

function recent_transactions(id){
  try {
    fetch("http://localhost:3000/api/summary/recent_trans",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({user_id:id})
    })
    .then(res=>{
      if(!res.ok){
        throw new Error("DB_trans_resp_err");
      }
      return res.json();
    })
    .then(data=>{
      if(data.response){

        data.recent_transactions.forEach(entry=>{
          const trans_list=document.getElementById("recents-trans")
          const row=document.createElement("tr");
          row.id=entry.id;
          row.innerHTML=`
            <td>${entry.id}</td>
            <td>${entry.date}</td>
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
recent_transactions(user_info.id);
function load_visuals(){
  
}

//switch between sections
function expense(){
  const exp=document.getElementById("expense");  
  const income=document.getElementById("income");  
  const overview=document.getElementById("overview"); 
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
function income(){

  const exp=document.getElementById("expense");  
  const income=document.getElementById("income");  
  const overview=document.getElementById("overview"); 
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
function overview(){
  const exp=document.getElementById("expense");  
  const income=document.getElementById("income");  
  const overview=document.getElementById("overview"); 
  if(exp.className!="expsnse"){
    exp.classList.replace("expense1","expense")
  }
  if(income.className!="income"){
    income.classList.replace("income1","income");
  }
  if(overview.className!="overview1"){
    overview.classList.replace("overview","overview1");
  }
}

//log out confirmation prompt 
function log_out(){
  if(confirm("Are you sure you want to log out?")){
    localStorage.clear();
    window.location.href="login_signup.html"
  }

}