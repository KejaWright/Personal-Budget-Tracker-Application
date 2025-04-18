//=========Mapping category to icon image path=========//
const categoryIcons = {
    Salary: "../../media/icons/salary.png",
    Gift: "../../media/icons/gift.png",
    Groceries: "../../media/icons/grocery.png",
    Investments: "../../media/icons/investment.png",
    Gas: "../../media/icons/gas.png",
    Savings: "../../media/icons/savings.png",
    Rent: "../../media/icons/rent.png",
    Entertainment: "../../media/icons/entertainment.png",
    Gym: "../../media/icons/gym.png",
    Coffee: "../../media/icons/coffee.png",
    Restaurant: "../../media/icons/restaurant.png",
    Bills: "../../media/icons/bills.png",
    Vacation: "../../media/icons/vacation.png",
    Public_Transportation: "../../media/icons/pubTrans.png",
    Travel: "../../media/icons/travel.png",
    School: "../../media/icons/school.png"
};

//===========Adding to Table Math General===========//
document.querySelector("form").addEventListener("submit", function(e) {
    e.preventDefault();

    const date = document.getElementById("date").value; 
    const type = document.getElementById("transactionType").value;
    const category = document.getElementById("icon").value;
    const cat_icon_url = categoryIcons[category] || ""; // fallback to empty if not found
    const cat_icon_img = `<img src="${cat_icon_url}" alt="${category}" style="width:50px; height:50px;">`;// Create image HTML
    const title = document.getElementById("title").value;
    const repeating = document.getElementById("repeat").value;
    const acc_type = document.getElementById("accountType").value;
    const paid = document.getElementById("paidOp").checked;
    const amount = document.getElementById("amount").value; 

    const id = Date.now(); // Simple unique ID

    // Retrieve the existing transactions from localStorage
    const transactions = JSON.parse(localStorage.getItem("transactions")) || [];

    // Append the new transaction to the array
    transactions.push({ id, date, type, category, cat_icon_img, title, repeating, acc_type, paid, amount });

    // Save the updated transactions back to localStorage
    localStorage.setItem("transactions", JSON.stringify(transactions));

    // Add the transaction to both the income and expense tables if applicable
    if (type === 'income') {
        addTransactionToTable("income_table_body", date, type, cat_icon_img, category, title, repeating, acc_type, paid, amount, id);
    }

    if (type === 'expense') {
        addTransactionToTable("expense_table_body", date, type, cat_icon_img, category, title, repeating, acc_type, paid, amount, id);
    }

    // Always add the transaction to the general transaction table as well
    addTransactionToTable("transactionTableBody", date, type, cat_icon_img, category, title, repeating, acc_type, paid, amount, id);
});

// Function to add transaction to a table
function addTransactionToTable(tableId, date, type, cat_icon_img, category, title, repeating, acc_type, paid, amount, id) {
    const table = document.getElementById(tableId);
    if (!table) {
        console.warn(`Table with ID '${tableId}' not found.`);
        return;
    }
    const row = table.querySelector('tbody').insertRow();
    row.dataset.id = id; //This sets a data attribute on the row

    row.innerHTML = `
        <td>${date}</td>
        <td>${type}</td>
        <td><img src="${cat_icon_img}" alt="${category}" width="50" height="50"></td>
        <td>${category}</td>
        <td>${title}</td>
        <td>${repeating}</td>
        <td>${acc_type}</td>
        <td>${paid}</td>
        <td>$${amount}</td>
        <td><button onclick="editRow(this, '${tableId}')">Edit</button></td>
        <td><button onclick="deleteRow(this, '${tableId}')">Delete</button></td>
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
            row.dataset.id = tx.id; // ← ADD THIS!

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
                <td><button onclick="editRow(this, '${tableId}')">Edit</button></td>
                <td><button onclick="deleteRow(this, '${tableId}')">Delete</button></td>
            `;
        }
    });
}

//==========Sort the table===============//
function sortTransactionsByDate() {
    const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    
    transactions.sort((a, b) => new Date(a.date) - new Date(b.date));
    displaySortedTransactions("transactionTableBody", transactions);
}

function sortTransactionsByAmount() {
    const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    
    transactions.sort((a, b) => parseFloat(a.amount) - parseFloat(b.amount));
    displaySortedTransactions("transactionTableBody", transactions);
}

function displaySortedTransactions(tableId, sortedTransactions) {
    const table = document.getElementById(tableId);
    if (!table) return;

    table.innerHTML = '';

    sortedTransactions.forEach(tx => {
        const row = table.insertRow();
        row.dataset.id = tx.id;

        row.innerHTML = `
            <td>${tx.date}</td>
            <td>${tx.type}</td>
            <td>${tx.cat_icon_img}</td>
            <td>${tx.category}</td>
            <td>${tx.title}</td>
            <td>${tx.repeating}</td>
            <td>${tx.acc_type}</td>
            <td>${tx.paid}</td>
            <td>$${parseFloat(tx.amount).toFixed(2)}</td>
            <td><button onclick="editRow(this, '${tableId}')">Edit</button></td>
            <td><button onclick="deleteRow(this, '${tableId}')">Delete</button></td>
        `;
    });
}

//==========Export/Save csv document from transaction table=============//
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
        let csvContent = '';
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