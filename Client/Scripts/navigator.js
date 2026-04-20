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
