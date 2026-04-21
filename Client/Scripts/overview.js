

async function get_overdue_expenses() {

  fetch("https://trackwise-9l4u.onrender.com/api/expenses/load_overdue_expenses",{
    method:"GET",
    headers:{"Content-Type":"application/json"},
    credentials:"include",
  })
  .then( res=>{

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

        document.getElementById("overdue_exp_list").innerHTML=``;
        data.rows.forEach(item=>{
          const row=document.createElement("tr");
          row.innerHTML=`
            <td>${item.description}</td>
            <td>${item.amount}</td>
            <td>${item.due_date.substring(0,10)}</td>
      
          `;
          document.getElementById("overdue_exp_list").appendChild(row);
        });

      }
    }
  })
  .catch(error => {
      console.error("Fetch failed:", error);
});
  
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
          document.getElementById("limit-progress").innerHTML= `Budget Used: ${limitProgress}%, (R${data.expenses} / R${limit})`;
          
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
        log_out(); // force log-out
        return;
    }
      if(!res.ok){
        throw new Error("Unexpected error has occurred!");
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
            backgroundColor:'rgba(47, 167, 121, 0.94)'

          },{

            label:"Expense",
            data:expense_data,
            backgroundColor:'rgba(233, 98, 98, 0.7)'
            
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                color: 'rgb(40, 40, 40)',
                font: {
                  size: 13,
                  weight: 'bold'
                }
              }
            },

            title: {
              display: true,
              text: 'Monthly Income vs Expense',
              color: 'rgb(20, 20, 20)',
              font: {
                size: 16,
                weight: 'bold'
              }
            }
          },

          scales: {
            x: {
              ticks: {
                color: 'rgb(50, 50, 50)',
                font: { weight: 'bold' }
              },
              grid: {
                color: 'rgba(0, 0, 0, 0.05)'
              }
            },

            y: {
              beginAtZero: true,
              ticks: {
                color: 'rgb(50, 50, 50)',
                font: { weight: 'bold' }
              },
              grid: {
                color: 'rgba(0, 0, 0, 0.08)'
              }
            }
          }
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
        existingChart.destroy();  // destroy the old chart it before creating a new chart
      }

      new Chart(ctx,{

        type:"doughnut",
        data:{

          labels:labels,

          datasets:[{
            data: totals,
            backgroundColor: [
              'rgb(255, 99, 133)',    
              'rgba(54, 163, 235, 0.93)',    
              'rgba(255, 207, 86, 0.96)',   
              'rgba(75, 192, 192, 0.95)',    
              'rgba(153, 102, 255, 0.91)',   
              'rgba(255, 160, 64, 0.88)',    
              'rgba(199, 199, 199, 0.91)',   
              'rgba(255, 99, 255, 0.94)',    
              'rgba(99, 255, 133, 0.92)',    
              'rgba(54, 235, 163, 0.91)',    
              'rgba(86, 207, 255, 0.94)',   
              'rgba(192, 75, 192, 0.91)',    
              'rgba(255, 206, 128, 0.92)',   
              'rgba(153, 255, 102, 0.9)',   
              'rgba(102, 153, 255, 0.9)'  
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
                  font: { size: 14,weight:400
                  }
                }},
              title: { display: true,
                 text: 'Income breakdown',
                font:{
                  size:16,
                  weight:600
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

        type:"doughnut",
        data:{

          labels:truncatedLabels,

          datasets:[{
            data: totals,
            backgroundColor: [
              'rgba(255, 99, 133, 0.93)',    
              'rgba(54, 163, 235, 0.92)',    
              'rgba(255, 207, 86, 0.91)',   
              'rgba(75, 192, 192, 0.92)',    
              'rgba(153, 102, 255, 0.93)',   
              'rgba(255, 160, 64, 0.9)',    
              'rgba(199, 199, 199, 0.93)',   
              'rgba(255, 99, 255, 0.93)',    
              'rgba(99, 255, 133, 0.93)',    
              'rgba(54, 235, 163, 0.9)',    
              'rgba(86, 207, 255, 0.9)',   
              'rgba(192, 75, 192, 0.9)',    
              'rgba(255, 206, 128, 0.9)',   
              'rgba(153, 255, 102, 0.9)',   
              'rgba(102, 153, 255, 0.9)'    
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
                  font: { size: 14, weight:400}
                }},
              title: { display: true,
                 text: 'Expense breakdown',
                font:{
                  size:16,
                  weight:600
                },
               },
          },
        }
      })

    }
  })
}


