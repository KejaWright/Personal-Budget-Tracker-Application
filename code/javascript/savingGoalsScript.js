//Read information from the sumbitted form and push to a created table
document.querySelector("form").addEventListener("submit", function(e) {
    e.preventDefault();
    const goalCat = document.getElementById("goal_cat").value.trim().toLowerCase();
    const goalName = document.getElementById("goal_name").value.trim();
    const goalAmount = document.getElementById("goal_am").value.trim();
    const id = Date.now(); // Simple unique ID
    
    const savingGoals = JSON.parse(localStorage.getItem("savingGoals")) || [];

    // Append the new transaction to the array
    savingGoals.push({ id, goalCat, goalName, goalAmount});

    // Save the updated transactions back to localStorage
    localStorage.setItem("savingGoals", JSON.stringify(savingGoals));

    window.location.reload();

    //add category to list
    if (document.getElementById(goalCat)) {
        addToExistingTable(goalCat, goalName, goalAmount, id);
    } 
    
    else {
        newGoal(goalCat, goalName, goalAmount, id);
    }
});

//if new goal category is created:
function newGoal(goalCat, goalName, goalAmount, id){
    const table = document.createElement('table');
    table.id = goalCat;

    const thead = document.createElement('thead');
    const headerRow = thead.insertRow();
    const headerCell = document.createElement('th');
    headerCell.colSpan = 4;
    headerCell.textContent = goalCat;
    headerRow.appendChild(headerCell);

    const tbody = document.createElement('tbody');
    table.appendChild(thead);
    table.appendChild(tbody);

    headerRow.innerHTML = `
        <th colspan="3">${goalCat.charAt(0).toUpperCase() + goalCat.slice(1)}</th>
        <th><button onclick="deleteTable('${goalCat}')">Delete Table</button></th>
    `;


    const row = table.querySelector('tbody').insertRow();
    row.dataset.id = id; //This sets a data attribute on the row
    row.innerHTML = `
        <td>${goalName}</td>
        <td>$${goalAmount}</td>
        <td><button onclick="editRow(this, '${goalCat}')">Edit</button></td>
        <td><button onclick="deleteRow(this, '${goalCat}')">Delete</button></td>
    `;

    // Append table to container
    document.getElementById("goals_section").appendChild(table);
    console.log("Table rows inserted");
}

//if already existing category is used:
function addToExistingTable(goalCat, goalName, goalAmount, id){
    const table = document.getElementById(goalCat);
    if (!table) {
        console.warn(`Table with ID '${goalCat}' not found.`);
        return;
    }

    const tbody = table.querySelector('tbody');
    const row = tbody.insertRow();
    row.dataset.id = id; //This sets a data attribute on the row

    row.innerHTML = `
        <td>${goalName}</td>
        <td>$${goalAmount}</td>
        <td><button onclick="editRow(this, '${goalCat}')">Edit</button></td>
        <td><button onclick="deleteRow(this, '${goalCat}')">Delete</button></td>
    `;
}


//delete entire table:
function deleteTable(goalCat) {
    if (!confirm(`Are you sure you want to delete the entire "${goalCat}" table?`)) {
        return; // Cancel if user says no
    }

    // Normalize the input
    const normalizedGoalCat = goalCat.trim().toLowerCase();

    // Remove from localStorage
    let savingGoals = JSON.parse(localStorage.getItem("savingGoals")) || [];
    savingGoals = savingGoals.filter(goal => goal.goalCat.trim().toLowerCase() !== normalizedGoalCat);
    localStorage.setItem("savingGoals", JSON.stringify(savingGoals));

    // Remove the table from the page
    const table = document.getElementById(normalizedGoalCat);
    if (table) {
        table.remove();
    }

    // Reload to rebuild page with updated localStorage
    window.location.reload();
}

//delete row slected in table
function deleteRow(button, tableCat){
    const row = button.closest('tr'); // Get the row containing the button
    const table = document.getElementById(tableCat);
    const id = row.dataset.id;

    row.remove();

    const savingGoals = JSON.parse(localStorage.getItem("savingGoals")) || [];
    const updatedgoals = savingGoals.filter(tx => tx.id != id);
    localStorage.setItem("savingGoals", JSON.stringify(updatedgoals));

    console.log(`Row deleted from ${tableCat}`);
}

function deleteAllTables(){
    if (confirm(`Are you sure you want to delete ALL savings goals? This cannot be undone.`)) {
        // Clear from localStorage
        localStorage.removeItem("savingGoals");

        // Remove all tables inside goals_section
        $('#goals_section table').remove();

        // Update placeholder visibility
        updateGoalSectionVisibility();

        alert(`All savings goals have been deleted.`);
    }
}


//edit selected row
function editRow(button, goalCat){
    const row = button.closest('tr');
    const cells = row.children;

    cells[0].innerHTML = `<input type="text" value="${cells[0].textContent}">`;
    cells[1].innerHTML = `<input type="number" value="${parseFloat(cells[1].textContent.replace('$', ''))}" step="0.01">`;

    button.textContent = "Add";
    button.onclick = () => saveEditedRow(button, goalCat, row.dataset.id);
}

//save the edited row
function saveEditedRow(button, goalCat, id) {
    if (!confirm("Are you sure you want to save changes to this transaction?")) return;
    const row = button.closest('tr');
    const cells = row.children;

    // Get updated values
    const goalName = cells[0].querySelector('input').value;
    const goalAmount = parseFloat(cells[1].querySelector('input').value).toFixed(2);

    // Replace with plain text again
    row.innerHTML = `
        <td>${goalName}</td>
        <td>$${goalAmount}</td>
        <td><button onclick="editRow(this, '${goalCat}')">Edit</button></td>
        <td><button onclick="deleteRow(this, '${goalCat}')">Delete</button></td>
    `;

    // Update main transactions list
    const savingGoals = JSON.parse(localStorage.getItem("savingGoals")) || [];
    const index = savingGoals.findIndex(tx => tx.id == id);
    if (index !== -1) {
        savingGoals[index] = {
            id,
            goalCat, 
            goalName, 
            goalAmount
        };
        localStorage.setItem("savingGoals", JSON.stringify(savingGoals));
    }
}

//hide h3 element if there are tables present
function updateGoalSectionVisibility() {
    if ($('#goals_section table').length === 0) {
        $('#placeholder').show();  // Show h3 if no tables
    } else {
        $('#placeholder').hide();  // Hide h3 if tables exist
    }
}

// Run it on page load
$(document).ready(function () {
    updateGoalSectionVisibility();
});

//actually display the tables
window.addEventListener("DOMContentLoaded", function() {
    const savingGoals = JSON.parse(localStorage.getItem("savingGoals")) || [];

    savingGoals.forEach(goal => {
        const normalizedCat = goal.goalCat.toLowerCase(); // normalize
        if (document.getElementById(normalizedCat)) {
            addToExistingTable(normalizedCat, goal.goalName, goal.goalAmount, goal.id);
        } else {
            newGoal(normalizedCat, goal.goalName, goal.goalAmount, goal.id);
        }
    });
});