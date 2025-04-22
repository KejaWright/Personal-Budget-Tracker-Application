//========global values=========//
const total_income_display = document.getElementById("tot_inc");
const total_expense_display = document.getElementById("tot_exp");
const total_balance_display = document.getElementById("tot_bal");
let total_budget = 0; // Example total budget, you can dynamically change this
let tot_income = 0;
let tot_expense = 0;

//===============Update Balance, Total Income and Expenses amounts on home page: under repair==============//
//Update tot_income and tot_expense and display it
function balanceMath(tableId, type) {
    const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    const table = document.getElementById(tableId);
    
    if (!table) {
        console.error(`${tableId} not found!`);
        return;
    }

    console.log("All transactions:", transactions);

    // Filter transactions based on the provided type ('income' or 'expense')
    const filtered = transactions.filter(tx => tx.type === type);

    // Sum the amounts
    const total = filtered.reduce((sum, tx) => {
        const amt = parseFloat(tx.amount);
        return sum + (isNaN(amt) ? 0 : amt);
    }, 0);

    // Save to localStorage under "Budget_Info"
    let budgetInfo = JSON.parse(localStorage.getItem("Budget_Info")) || {};
    budgetInfo[type] = total;
    localStorage.setItem("Budget_Info", JSON.stringify(budgetInfo));

    return total;
}

const totalIncome = balanceMath("income_table", "income");
const totalExpense = balanceMath("expense_table", "expense");
console.log("Income:", totalIncome, "Expense:", totalExpense);

//update the display for total
total_income_display.textContent = totalIncome;
total_expense_display.textContent = totalExpense;

let budgetInfo = JSON.parse(localStorage.getItem("Budget_Info")) || {};
let currentBudget = parseFloat(budgetInfo.total_budget) || 0;
let total_balance = currentBudget + totalIncome - totalExpense;
total_balance_display.textContent = total_balance.toFixed(2);

// update remaining budget display
document.getElementById("remaining_budget").textContent = total_balance.toFixed(2);

// update progress bar
const progressBar = document.getElementById("total_budget_prog");
progressBar.max = currentBudget;
progressBar.value = total_balance;

//User has ability to add a balance by adding a budget
function budgetChange(button) {
    const totalBudgetSpan = document.getElementById("total_budget");

    // Only enter edit mode if not already editing
    if (!totalBudgetSpan.querySelector('input')) {
        const currentValue = parseFloat(totalBudgetSpan.textContent.trim());

        totalBudgetSpan.innerHTML = `<input type="number" id="budget_input" value="${currentValue}" step="0.01">`;
        button.textContent = "Commit";
        button.onclick = () => saveBudget(button);
    }
}

function saveBudget(button) {
    const inputField = document.getElementById("budget_input");
    const newBudAmount = parseFloat(inputField.value);

    if (isNaN(newBudAmount)) {
        alert("Please enter a valid number.");
        return;
    }

    if (!confirm(`Are you sure you want to set the budget to $${newBudAmount.toFixed(2)}?`)) return;

    // Update UI
    const totalBudgetSpan = document.getElementById("total_budget");
    const remainingBudgetSpan = document.getElementById("remaining_budget");

    totalBudgetSpan.textContent = newBudAmount.toFixed(2);

    const totalIncome = balanceMath("income_table", "income") || 0;
    const totalExpense = balanceMath("expense_table", "expense") || 0;
    const totalBalance = newBudAmount + totalIncome - totalExpense;

    remainingBudgetSpan.textContent = totalBalance.toFixed(2);
    total_balance_display.textContent = totalBalance.toFixed(2);

    // Save to localStorage
    const budgetData = {
        total_budget: newBudAmount,
        remaining_budget: totalBalance
    };
    localStorage.setItem("Budget_Info", JSON.stringify(budgetData));
    console.log("Saved to localStorage:", JSON.stringify(budgetData));

    // Update progress bar
    const progressBar = document.getElementById("total_budget_prog");
    progressBar.max = newBudAmount;
    progressBar.value = totalBalance;

    // Restore button state
    button.textContent = "Edit Budget";
    button.onclick = () => budgetChange(button);
    window.location.reload();
}

window.onload = function () {
    // Get stored values or defaults
    const budgetData = JSON.parse(localStorage.getItem("Budget_Info")) || {};
    const totalBudget = parseFloat(budgetData.total_budget) || 0;

    // Get income & expense from transactions
    const totalIncome = balanceMath("income_table", "income") || 0;
    const totalExpense = balanceMath("expense_table", "expense") || 0;

    // Compute remaining budget
    const totalBalance = totalBudget + totalIncome - totalExpense;

    // Display everything
    document.getElementById("total_budget").textContent = totalBudget.toFixed(2);
    document.getElementById("remaining_budget").textContent = totalBalance.toFixed(2);
    total_income_display.textContent = totalIncome.toFixed(2);
    total_expense_display.textContent = totalExpense.toFixed(2);
    total_balance_display.textContent = totalBalance.toFixed(2);

    // Set progress bar
    const progressBar = document.getElementById("total_budget_prog");
    progressBar.max = totalBudget;
    progressBar.value = totalBalance;

    // Optional: update localStorage so remaining_budget stays up to date
    localStorage.setItem("Budget_Info", JSON.stringify({
        total_budget: totalBudget,
        remaining_budget: totalBalance
    }));
};