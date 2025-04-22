//create a savings goals and save to loacl storage
document.querySelector("form").addEventListener("submit", function(e) {
    e.preventDefault();

    //create variables for the goals
    const goalCategory = document.getElementById("goal_cat").value.trim();
    const goalName = document.getElementById("goal_name").value.trim();
    const goalAmount = document.getElementById("goal_am").value.trim();

    const id = Date.now(); // Simple unique ID
    const savingGoals = JSON.parse(localStorage.getItem("savingGoals")) || [];

    //add to localStorage
    savingGoals.push({id, goalCategory, goalName, goalAmount})
    localStorage.setItem("savingGoals", JSON.stringify(savingGoals));

    const categoryTable = document.querySelector(`table[data-category="${goalCategory}"]`);//does category exist already?

    if (categoryTable){
        newGoal(categoryTablele, id, goalName, goalAmount);
        window.location.reload();
    }

    else{
        newCategory(id, goalCategory, goalName, goalAmount);
        window.location.reload();
    }
});

function newCategory(id, categoryName, goalName, goalAmount){
    const container = document.getElementById("goals_section");

    const section = document.createElement("section");
  
    const table = document.createElement("table");
    table.setAttribute("data-category", categoryName);
  
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    const headerCell = document.createElement("th");
    headerCell.colSpan = 2;
    headerCell.textContent = `Category (${categoryName})`;
    headerRow.appendChild(headerCell);
    thead.appendChild(headerRow);
  
    const tbody = document.createElement("tbody");
    table.appendChild(thead);
    table.appendChild(tbody);
  
    section.appendChild(table);
    container.appendChild(section);
  
    newGoal(table, id, goalName, goalAmount);
  
}

function newGoal(table, id, goalName, goalAmount){
    const tbody = table.querySelector("tbody");
    const lastRow = tbody.lastElementChild;
    
    let row;
    if (!lastRow || lastRow.children.length === 2) {
      row = document.createElement("tr");
      tbody.appendChild(row);
    } else {
      row = lastRow;
    }
  
    const td = document.createElement("td");
  
    const box = document.createElement("div");
    box.className = "goal-box";
    box.setAttribute("data-id", id);
  
    const name = document.createElement("h3");
    name.textContent = goalName;
  
    const amount = document.createElement("p");
    amount.textContent = `$0/${goalAmount}`;
  
    const addBtn = document.createElement("button");
    addBtn.textContent = "Add";
  
    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
  
    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
  
    box.appendChild(name);
    box.appendChild(amount);
    box.appendChild(addBtn);
    box.appendChild(editBtn);
    box.appendChild(delBtn);
  
    td.appendChild(box);
    row.appendChild(td);
}
  
// Rebuild goals from localStorage when page loads
window.addEventListener("DOMContentLoaded", () => {
    const savingGoals = JSON.parse(localStorage.getItem("savingGoals")) || [];

    const categoryMap = {};

    savingGoals.forEach(goal => {
        if (!categoryMap[goal.goalCategory]) {
        categoryMap[goal.goalCategory] = document.createElement("table");
        categoryMap[goal.goalCategory].setAttribute("data-category", goal.goalCategory);

        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr");
        const headerCell = document.createElement("th");
        headerCell.colSpan = 2;
        headerCell.textContent = `Category (${goal.goalCategory})`;
        headerRow.appendChild(headerCell);
        thead.appendChild(headerRow);

        const tbody = document.createElement("tbody");

        categoryMap[goal.goalCategory].appendChild(thead);
        categoryMap[goal.goalCategory].appendChild(tbody);

        const section = document.createElement("section");
        section.appendChild(categoryMap[goal.goalCategory]);

        document.getElementById("goals_section").appendChild(section);
        }

        newGoal(categoryMap[goal.goalCategory], goal.id, goal.goalName, goal.goalAmount);
    });
});