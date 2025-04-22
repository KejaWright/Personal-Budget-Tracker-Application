//========Dark Mode and System Theme Change===============//
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
        root.setProperty('--light-mode-font', getComputedStyle(document.documentElement).getPropertyValue('--dark-mode-font'));
        document.getElementById('dark_mode').checked = true;
    } else {
        root.setProperty('--light-mode-background', '#ffffff');
        root.setProperty('--light-mode-sidebar-color', '#d9d9d9');
        root.setProperty('--light-mode-font', 'black');
        document.getElementById('dark_mode').checked = false;
    }

    // Also reflect color pickers
    if (document.getElementById('main_color')) {
        document.getElementById('main_color').value = mainColor;
        document.getElementById('acc_color').value = accColor;
    }
}

//Reset the colors based on "Reset Color Settings" button
function resetColorSettings() {
    localStorage.removeItem('darkMode');
    localStorage.removeItem('mainColor');
    localStorage.removeItem('accColor');
    setThemeFromStorage();
}

// Ensure theme is applied on page load
document.addEventListener('DOMContentLoaded', setThemeFromStorage);

//=========Display Table if there are elements in the table============//
function updateIncomeTableVisibility() {
    if ($('#income_table_body').children().length === 0) {
        $('#income_table').hide();
        $('#i_hide').show();
    } else {
        $('#income_table').show();
        $('#i_hide').hide();
    }
}

function updateExpenseTableVisibility() {
    if ($('#expense_table_body').children().length === 0) {
        $('#expense_table').hide();
        $('#e_hide').show();
    } else {
        $('#expense_table').show();
        $('#e_hide').hide();
    }
}

// Run it on page load
$(document).ready(function () {
    updateIncomeTableVisibility();
    updateExpenseTableVisibility();
});