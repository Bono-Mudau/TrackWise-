
//MONTHLY SUMMARY 

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

        //FORCE LOG-OUT
        if (res.status === 401) {
            log_out(); 
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
