//FUNCTIONS TO NAVIGATE BETWEEN SECTIONS

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
  load_income()

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
  load_recurring();
}

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
load_user_details();
show_overview()
load_all_expenses();
load_income();
load_summary();
load_balances();
