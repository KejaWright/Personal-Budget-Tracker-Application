//======Clear all data based on what button the user clicks on the settings page========//
function clearData(type){//fixed
    if (confirm(`Are you sure you want to delete all ${type} transactions? This cannot be undone.`)) {
        const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
        const updatedTransactions = transactions.filter(tx => tx.type !== type);
        localStorage.setItem("transactions", JSON.stringify(updatedTransactions));
        alert(`All ${type} transactions deleted. Open the relevant page to see the changes.`);
    }
    console.log(`Cleared all ${type} transactions from table and localStorage.`);
}

//===================Delete a row froma table and update it===================//
function deleteRow(button, tableType){
    const row = button.closest('tr'); // Get the row containing the button
    const table = document.getElementById(tableType);
    const id = row.dataset.id;

    row.remove();

    const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    const updatedTransactions = transactions.filter(tx => tx.id != id);
    localStorage.setItem("transactions", JSON.stringify(updatedTransactions));

    console.log(`Row deleted from ${tableType}`);
}

//=====================Edit a row from a table and update it======================//
function editRow(button, tableId){
    const row = button.closest('tr');
    const cells = row.children;

    // Replace cells with editable fields
    const typeOptions = ['income', 'expense'];
    const categoryOptions = ['Salary', 'Gift', 'Groceries', 'Investments', 'Gas', 'Savings', 'Rent', 'Entertainment', 'Gym', 
        'Coffee', 'Restaurant', 'Bills', 'Vacation', 'Public_Transportation', 'Travel', 'School']; // Example categories
    const repeatingOptions = ['Never', 'Daily', 'Weekly', 'Biweekly', 'Monthly', 'Quarterly', 'Yearly'];
    const accOptions = ['Credit','Debit', 'Cash', 'Check', 'Checking', 'Savings'];


    //name the cells and pull/read data
    cells[1].innerHTML = createDropdown(typeOptions, cells[1].textContent);
    cells[3].innerHTML = createDropdown(categoryOptions, cells[3].textContent);
    cells[4].innerHTML = `<input type="text" value="${cells[4].textContent}">`;
    cells[5].innerHTML = createDropdown(repeatingOptions, cells[5].textContent);
    cells[6].innerHTML = createDropdown(accOptions, cells[6].textContent);
    cells[7].innerHTML = `<input type="checkbox" ${cells[7].textContent === 'true' ? 'checked' : ''}>`;
    cells[8].innerHTML = `<input type="number" value="${parseFloat(cells[8].textContent.replace('$', ''))}" step="0.01">`;

    button.textContent = "Add";
    button.onclick = () => saveEditedRow(button, tableId, row.dataset.id);
}

function createDropdown(options, selected, isCategory = false) {
    return `
        <select onchange="${isCategory ? 'updateCategoryIcon(this)' : ''}">
            ${options.map(opt => `<option value="${opt}" ${opt === selected ? 'selected' : ''}>${opt}</option>`).join('')}
        </select>
    `;
}

function getIconForCategory(category) {
    const iconMap = {
        Salary: "./media/icons/salary.png",
        Gift: "./media/icons/gift.png",
        Groceries: "./media/icons/grocery.png",
        Investments: "./media/icons/investment.png",
        Gas: "./media/icons/gas.png",
        Savings: "./media/icons/savings.png",
        Rent: "./media/icons/rent.png",
        Entertainment: "./media/icons/entertainment.png",
        Gym: "./media/icons/gym.png",
        Coffee: "./media/icons/coffee.png",
        Restaurant: "./media/icons/restaurant.png",
        Bills: "./media/icons/bills.png",
        Vacation: "./media/icons/vacation.png",
        Public_Transportation: "./media/icons/pubTrans.png",
        Travel: "./media/icons/travel.png",
        School: "./media/icons/school.png"
    };
    return iconMap[category] || '❓';
  }

function saveEditedRow(button, tableId, id) {
    if (!confirm("Are you sure you want to save changes to this transaction?")) return;
    const row = button.closest('tr');
    const cells = row.children;

    // Get updated values
    const date = cells[0].textContent; // Not editable
    const type = cells[1].querySelector('select').value;
    const category = cells[3].querySelector('select').value;
    const cat_icon_img = getIconForCategory(category);
    const title = cells[4].querySelector('input').value;
    const repeating = cells[5].querySelector('select').value;
    const acc_type = cells[6].querySelector('select').value;
    const paid = cells[7].querySelector('input').checked;
    const amount = parseFloat(cells[8].querySelector('input').value).toFixed(2);

    // Replace with plain text again
    row.innerHTML = `
        <td>${date}</td>
        <td>${type}</td>
        <td><img src="${cat_icon_img}" alt="${category}" style="width:50px; height:50px;"></td>
        <td>${category}</td>
        <td>${title}</td>
        <td>${repeating}</td>
        <td>${acc_type}</td>
        <td>${paid}</td>
        <td>$${amount}</td>
        <td><button onclick="editRow(this, '${tableId}')">Edit</button></td>
        <td><button onclick="deleteRow(this, '${tableId}')">Delete</button></td>
    `;

    // Update main transactions list
    const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    const index = transactions.findIndex(tx => tx.id == id);
    if (index !== -1) {
        transactions[index] = {
            id,
            date,
            type,
            category,
            cat_icon_img: `<img src="${cat_icon_img}" alt="${category}" style="width:50px; height:50px;">`,
            title,
            repeating,
            acc_type,
            paid,
            amount
        };
        localStorage.setItem("transactions", JSON.stringify(transactions));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const tables = document.querySelectorAll('.transaction-table');
    tables.forEach(table => {
      loadTableFromLocalStorage(table.id);
    });
});