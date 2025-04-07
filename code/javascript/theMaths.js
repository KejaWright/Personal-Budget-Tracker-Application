//Dark Mode and System Theme Change
function applyColorChange() {
    const darkMode = document.getElementById('dark_mode').checked;
    const mainColor = document.getElementById('main_color').value;
    const accColor = document.getElementById('acc_color').value;

    // Save preferences to localStorage
    localStorage.setItem('darkMode', darkMode);
    localStorage.setItem('mainColor', mainColor);
    localStorage.setItem('accColor', accColor);

    // Apply them immediately
    setThemeFromStorage();
}

function setThemeFromStorage() {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    const mainColor = localStorage.getItem('mainColor') || '#ff5757';
    const accColor = localStorage.getItem('accColor') || '#ff66c4';

    const root = document.documentElement.style;

    root.setProperty('--system-theme-1', mainColor);
    root.setProperty('--system-theme-2', accColor);

    if (darkMode) {
        root.setProperty('--light-mode-background', getComputedStyle(document.documentElement).getPropertyValue('--dark-mode-background'));
        root.setProperty('--light-mode-sidebar-color', getComputedStyle(document.documentElement).getPropertyValue('--dark-mode-sidebar-color'));
        document.getElementById('dark_mode').checked = true;
    } else {
        root.setProperty('--light-mode-background', '#ffffff');
        root.setProperty('--light-mode-sidebar-color', '#d9d9d9');
        document.getElementById('dark_mode').checked = false;
    }

    // Also reflect color pickers
    if (document.getElementById('main_color')) {
        document.getElementById('main_color').value = mainColor;
        document.getElementById('acc_color').value = accColor;
    }
}
// Ensure theme is applied on page load
document.addEventListener('DOMContentLoaded', setThemeFromStorage);

//Budget Math



// Mapping category to icon image path
const categoryIcons = {
    salary: "../../media/icons/salary.png",
    gift: "../../media/icons/gift.png",
    groceries: "../../media/icons/grocery.png",
    investments: "../../media/icons/investment.png",
    gas: "../../media/icons/gas.png",
    savings: "../../media/icons/savings.png",
    rent: "../../media/icons/rent.png",
    entertainment: "../../media/icons/entertainment.png",
    gym: "../../media/icons/gym.png",
    coffee: "../../media/icons/coffee.png",
    restaurant: "../../media/icons/restaurant.png",
    bills: "../../media/icons/bills.png",
    vacation: "../../media/icons/vacation.png",
    pub_trans: "../../media/icons/pubTrans.png",
    travel: "../../media/icons/travel.png",
    school: "../../media/icons/school.png"
};

//Adding Income Math
document.querySelector("form").addEventListener("submit", function(e) {
    e.preventDefault();

    const date = document.getElementById("date").value; 
    const type = document.getElementById("transactionType").value;
    const category = document.getElementById("icon").value;
    const cat_icon_url = categoryIcons[category] || ""; // fallback to empty if not found
    const cat_icon_img = `<img src="${cat_icon_url}" alt="${category}" style="width:24px; height:24px;">`;// Create image HTML
    const title = document.getElementById("title").value;
    const repeating = document.getElementById("repeat").value;
    const acc_type = document.getElementById("accountType").value;
    const paid = document.getElementById("paidOp").checked;
    const amount = document.getElementById("amount").value; 

    // Retrieve the existing transactions from localStorage
    const transactions = JSON.parse(localStorage.getItem("transactions")) || [];

    // Append the new transaction to the array
    transactions.push({ date, type, category, cat_icon_img, title, repeating, acc_type, paid, amount });

    // Save the updated transactions back to localStorage
    localStorage.setItem("transactions", JSON.stringify(transactions));

    // Add the transaction to both the income and expense tables if applicable
    if (type === 'income') {
        addTransactionToTable("income_table_body", date, type, cat_icon_img, category, title, repeating, acc_type, paid, amount);
    }

    if (type === 'expense') {
        addTransactionToTable("expense_table_body", date, type, cat_icon_img, category, title, repeating, acc_type, paid, amount);
    }

    // Always add the transaction to the general transaction table as well
    addTransactionToTable("transactionTableBody", date, type, cat_icon_img, category, title, repeating, acc_type, paid, amount);
});

// Function to add transaction to a table
function addTransactionToTable(tableId, date, type, cat_icon_img, category, title, repeating, acc_type, paid, amount) {
    const table = document.getElementById(tableId);
    const row = table.insertRow();
    row.innerHTML = `
        <td>${date}</td>
        <td>${type}</td>
        <td>${cat_icon_img}</td>
        <td>${category}</td>
        <td>${title}</td>
        <td>${repeating}</td>
        <td>${acc_type}</td>
        <td>${paid}</td>
        <td>$${amount}</td>
        <td><button onclick="editRow(row, '${tableId}')">Edit</button></td>
        <td><button onclick="deleteRow(row, '${tableId}')">Delete</button></td>
    `;
}

// Display transactions when each page loads
document.addEventListener("DOMContentLoaded", function() {
    displayTransactions("income_table_body", 'income');
    displayTransactions("expense_table_body", 'expense');
    displayTransactions("transactionTableBody", 'all');
});

// Function to display transactions on page load
function displayTransactions(tableId, type) {
    const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    const table = document.getElementById(tableId);
    if (!table) {
        console.error(`${tableId} not found!`);
        return;
    }

    // Clear existing table rows before adding new ones
    table.innerHTML = '';

    // Add each transaction to the table
    transactions.forEach(tx => {
        if (type === 'all' || tx.type === type) { // Only show income or expense based on the type filter
            const row = table.insertRow();
            row.innerHTML = `
                <td>${tx.date}</td>
                <td>${tx.type}</td>
                <td>${tx.cat_icon_img}</td>
                <td>${tx.category}</td>
                <td>${tx.title}</td>
                <td>${tx.repeating}</td>
                <td>${tx.acc_type}</td>
                <td>${tx.paid}</td>
                <td>$${tx.amount}</td>
                <td><button onclick="editRow(row, '${tableId}')">Edit</button></td>
                <td><button onclick="deleteRow(row, '${tableId}')">Delete</button></td>
            `;
        }
    });
}

function editRow(row, tableType){
    //to be edited eventually
}

function deleteRow(row, tableType){//broken-ish
    row.remove();
    // Optional: Update localStorage to remove the deleted transaction
    const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    // Find the index of the row and remove the corresponding transaction
    const index = Array.from(row.parentNode.children).indexOf(row);
    transactions.splice(index, 1);
    localStorage.setItem("transactions", JSON.stringify(transactions));
    console.log(`Row deleted from ${tableId}`);
}


//export/save csv document from transaction table
document.getElementById('exportTr').addEventListener('click', async function() {
    // Get the table element
    try{
        const table = document.getElementById("transactionTable");

        // Create a 2D array to hold the CSV data
        const rows = [];
        
        // Get table headers (excluding "Icon", "Edit", "Delete")
        const headers = [];
        const headerCells = table.querySelectorAll('thead th');
        headerCells.forEach((headerCell, index) => {
            // Exclude "Icon", "Edit", and "Delete" columns by their index
            if (index !== 2 && index !== 9 && index !== 10) {
                headers.push(headerCell.textContent.trim());
            }
        });
        rows.push(headers);

        // Get table rows (excluding the "Icon", "Edit", "Delete" columns)
        const tableRows = table.querySelectorAll('tbody tr');
        tableRows.forEach(row => {
            const cells = row.querySelectorAll('td');
            const rowData = [];
            cells.forEach((cell, index) => {
                // Exclude "Icon", "Edit", and "Delete" columns by their index
                if (index !== 2 && index !== 9 && index !== 10) {
                    rowData.push(cell.textContent.trim());
                }
            });
            rows.push(rowData);
        });

        // Convert rows array to CSV format
        let csvContent = "data:text/csv;charset=utf-8,";
        rows.forEach((rowArray, index) => {
            const row = rowArray.join(",");
            csvContent += index < rows.length ? row + "\n" : row;
        });

        // Create a downloadable link and trigger the download
        // Prompt user to pick a folder and save the file using File System Access API
        const handle = await window.showSaveFilePicker({
            suggestedName: "transactions.csv",
            types: [{
                description: 'CSV Files',
                accept: {'text/csv': ['.csv']},
            }],
        });

        // Create a writable stream and write the CSV content to the file
        const writableStream = await handle.createWritable();
        await writableStream.write(csvContent);
        await writableStream.close();

        alert('CSV file saved successfully!');
    } catch (err) {
        console.error('Error saving file:', err);
    }
});