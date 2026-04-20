

function load_income_filters(){

  default_income_filter.no_of_months=Number(document.getElementById("show-last-x-income").value);
  default_income_filter.sort_by=document.getElementById("sort-income-by").value;
  
}
function submit_income(){

  document.getElementById("submit_income").disabled=true;

  //VALIDATE USER INPUT
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

  //CHECK IF IT'S A RECURRING ENTRY 
  const recurring_input=document.getElementById("recurring-income");
  if(recurring_input || recurring_input.checked){
    income_entry.recurring=1;
  }
  
  //CLEAR INPUT FIELDS
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

      // FORCE LOGOUT
      if (res.status === 401) {
        log_out(); 
        return;
      }
      if(!res.ok){
        document.getElementById("submit_income").disabled=false;
        throw new Error("error adding an income entry");
      }
      return res.json()
      })
    .then(res=>{

      if(res.response){

        //make the table visible
        if(document.getElementById("income-table").style.display=="none"){
          document.getElementById("income-trans-alternative").style.display="none";
          document.getElementById("income-table").style.display="";
        }

        //VALIDATE INPUT
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

          //FORCE LOGOUT
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

//LOAD  ENTRIES FROM THE DB
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
    
    //FORCE LOG-OUT
    if (res.status === 401) {
      log_out(); 
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
    
    //UPDATE THE TABLE
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
    });

    //UPDATE TOTALS
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

  });
}

//TABLES'S EVENT DELAGATION
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
      alert("Please select an option!");
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
      };

      fetch("https://trackwise-9l4u.onrender.com/api/income/update_income",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        credentials: "include",
        body:JSON.stringify(data)
      })
      .then(res=>{
        
        //FORCE LOG-OUT
        if(res.status === 401){
          log_out(); 
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
          btn.innerText="Save";
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