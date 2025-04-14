//========global values=========//
let tot_income = 0;
let tot_expenses = 0;
let total_budget = 100; // Example total budget, you can dynamically change this


//===============Update Balance, Total Income and Expenses amounts on home page: under repair==============//
//User has ability to add a balance by adding a budget



//Pull all amount info from transaction table
function getTransactions() {
    // Example: Pull transactions from localStorage if you're saving them there
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    return transactions;
}

//add them all together
function calculateTotals() {
    let transactions = getTransactions();
    
    // Reset totals
    tot_income = 0;
    tot_expenses = 0;

    // Iterate over transactions and calculate totals
    transactions.forEach(transaction => {
        if (transaction.type === 'income') {
            tot_income += parseFloat(transaction.amount);
        } else if (transaction.type === 'expense') {
            tot_expenses += parseFloat(transaction.amount);
        }
    });
}

//display them in the correct labels in the index.html
function updatePage() {
    // Update balance, income, and expenses in the HTML
    console.log("Updating page...");
    console.log("Total income:", tot_income);
    console.log("Total expenses:", tot_expenses);
    console.log("Remaining budget:", total_budget - tot_expenses);
    
    document.getElementById('tot_bal').innerText = (tot_income - tot_expenses).toFixed(2);
    document.getElementById('tot_inc').innerText = tot_income.toFixed(2);
    document.getElementById('tot_exp').innerText = tot_expenses.toFixed(2);

    // Update remaining budget and total budget
    let remaining_budget = total_budget - tot_expenses;
    document.getElementById('remaining_budget').innerText = remaining_budget.toFixed(2);
    document.getElementById('total_budget').innerText = total_budget.toFixed(2);

    // Update progress bar
    let progress_value = (tot_expenses / total_budget) * 100;
    document.getElementById('total_budget_prog').value = progress_value;

    // Check if 10% of the budget is left
    if (remaining_budget <= total_budget * 0.1) {
        document.getElementById('expense').style.color = 'red'; // Change text color to red for warning
        alert("Warning: Budget is running low! Only 10% remaining.");
    } else {
        document.getElementById('expense').style.color = ''; // Reset color if above 10%
    }
}


//Update budget label when income/expense is affected
function updateBudget() {
    calculateTotals();
    updatePage();
}










//=============Update the Chart and other information for the Insights page====================//
//pull info from transactions table


//update income chart


//update expense chart