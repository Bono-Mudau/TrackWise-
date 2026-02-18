
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
console.log(user_info.id)
console.log(user_info.names)

//update names on the dashboard
document.getElementById("user-names").innerHTML=user_info.names;
//EXPENSES//

const expense_list=document.getElementById("expenses-list");
function addentry(){
    const entry=document.getElementById('C-exp-card');
    if(entry.classList.contains("create-expense-card1")){
        entry.classList.replace("create-expense-card1","create-expense-card");
    }else{
        entry.classList.replace("create-expense-card","create-expense-card1");
    }
}
load_all_expenses();
load_income();
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
      total=0;
      data.forEach(element => {
        add_expense_to_the_list(element.exp_id,element);
        total+=element.amount;
      })
      document.getElementById("expense-sum").innerHTML="R"+total;
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
    console.log(expense_entry.date)
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
        const id=res.id;
        add_expense_to_the_list(id,expense_entry);
      }
    })   
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
function delete_expense_entry(e){
         const selected_exp=e.target.closest(".expense-card");
         const confirmed = confirm("Are you sure you want to delete this expense?");

         //confirm first if a user wants to delete an expense 
         if (!confirmed){
          return 
         }
         try {
           fetch("http://localhost:3000/api/expenses/delete_exp",{
             method:"POST",
             headers:{"Content-Type":"application/json"},
             body:JSON.stringify({
               id:selected_exp.id})
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
              console.log(res)
             if(res.response){
               expense_list.removeChild(document.getElementById(selected_exp.id));
               window.alert("Expense id="+selected_exp.id+" has been deleted");
             }
             else{
               window.alert("expense not deleted");
             }
            })
           .catch(err=>{
              alert("errrrr"); 
            })
  
        } 
         catch (error) {
          window.alert("expense not deleted");
          
        }
}

function update_exp(){
    //get an element  parent's 1
    let update_id=document.getElementById("expense-edit-id").innerHTML;
    //update description
    const new_des=document.getElementById("exp-des-edit").value;
    document.getElementById("exp-des-edit").value="";
    document.getElementById(update_id+"-description").textContent=new_des; 
    //updtate category
    const new_cate=document.getElementById("category-input-edit").value;
    document.getElementById("category-input-edit").value="";
    document.getElementById(update_id+"-category").textContent=new_cate;
    //update amount
    const new_amount=document.getElementById("exp-amount-edt").value;
    document.getElementById("exp-amount-edt").value="";
    document.getElementById(update_id+"-amount").textContent=new_amount;
    //update status
    if(document.getElementById("edit-exp-checkbox").checked){
        const status="Paid"
        document.getElementById("edit-exp-checkbox").checked=false;
        document.getElementById(update_id+"-status").textContent=status;
    }
    document.getElementById("edit_exp").classList.replace("edit-expense1","edit-expense");
}
function cancel_update(){
    document.getElementById("edit_exp").classList.replace("edit-expense1","edit-expense");
}


//Income section
const income_list=document.getElementById("income-list");
function submit_income(){
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
              if(res.response){//entry added successfully
                 
                 //Create an income card and add it to the income list
                 const entry=document.createElement("div");
                 entry.id=res.id+"";
    
                 const inc_=document.createElement("label");
                 inc_.textContent=res.id;
                 entry.appendChild(inc_);

                 const income_cate=document.createElement("label");
                 income_cate.textContent=income_entry.category;
                 income_cate.id=res.id+"-category";
                 entry.appendChild(income_cate);
   
                 const income_amount=document.createElement("label");
                 income_amount.textContent=income_entry.amount;
                 income_amount.id=res.id+"-amount";
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
              else{
                 alert("entry not added")
                }
            })             
           } catch (error) {
            
           }
    document.getElementById('C-income-card').classList.replace("create-income-card","create-income-card1");
}

//delete income entry
function delete_income(e){
    const selected_income=e.target.closest(".income-card");
    const confirmed = confirm("Are you sure you want to delete this income entry?"+selected_income.id);
    if(confirmed){
    try {
      fetch("http://localhost:3000/api/income/delete_income",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          id:selected_income.id
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
          income_list.removeChild(document.getElementById(selected_income.id));
        }else{
              window.alert("Income entry not deleted");
          }
      })
    } catch (error) {
      throw new err("Expense not deleted");
      
    }
    }
  else{
      window.alert("Income entry not deleted");
  }

}

//Load existing income entries
function load_income(){
  const id=user_info.id;
  console.log("id used for income retrieval "+id)
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
    data.forEach(el=>{

      add_income_to_the_list(el);

    })
  })
}

function add_income_to_the_list(income_entry){
  //Create an income card and add it to the income list
  const entry=document.createElement("div");
  entry.id=income_entry.income_id+"";
  console.log("income entry "+income_entry.income_id)

  const inc_=document.createElement("label");
  inc_.textContent=income_entry.income_id;
  entry.appendChild(inc_);


  const income_cate=document.createElement("label");
  income_cate.textContent=income_entry.category;
  entry.appendChild(income_cate);

  const income_amount=document.createElement("label");
  income_amount.textContent=income_entry.amount;
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
function update_income(){
    //get an element  parent's 1
    let update_id=document.getElementById("income-edit-id").innerHTML;
    //updtate category
    const new_cate=document.getElementById("income-category-edit").value;
    document.getElementById("income-category-edit").value="";
    document.getElementById(update_id+"-category").textContent=new_cate;
    //update amount
    const new_amount=document.getElementById("income-amount-edit").value;
    document.getElementById("income-amount-edit").value="";
    document.getElementById(update_id+"-amount").textContent=new_amount;
    document.getElementById("income_edit").classList.replace("edit-income1","edit-income");
}
function cancel_update1(){
    document.getElementById("income_edit").classList.replace("edit-income1","edit-income");
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