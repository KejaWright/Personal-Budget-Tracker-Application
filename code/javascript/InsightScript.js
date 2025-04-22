//Pull all amount info from transaction table
function getTransactions() {
    // Example: Pull transactions from localStorage if you're saving them there
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    return transactions;
}


//=============Update the Chart and other information for the Insights page====================//
//way to add to table overall
function addToOverview(tableId, type, chartId) {
    let transactions = getTransactions();
    const table = document.getElementById(tableId);
    if (!table) {
        console.warn(`Table with ID '${tableId}' not found.`);
        return;
    }

    // Clear table
    table.innerHTML = '';

    // Filter and group transactions
    const filtered = transactions.filter(tx => tx.type === type);
    const grouped = {};

    filtered.forEach(tx => {
        const key = tx.category;
        if (!grouped[key]) {
            grouped[key] = {
                category: tx.category,
                cat_icon_img: tx.cat_icon_img,
                totalAmount: 0
            };
        }
        grouped[key].totalAmount += parseFloat(tx.amount);
    });

    const labels = [];
    const data = [];
    const backgroundColors = [];

    // Generate random pastel colors
    const getColor = () => `hsl(${Math.random() * 360}, 70%, 75%)`;

    Object.values(grouped).forEach(group => {
        const row = table.insertRow();
        row.innerHTML = `
            <td>${group.cat_icon_img}</td>
            <td>${group.category}</td>
            <td>$${group.totalAmount.toFixed(2)}</td>
        `;

        labels.push(group.category);
        data.push(group.totalAmount);
        backgroundColors.push(getColor());
    });

    // Render Chart
    const ctx = document.getElementById(chartId).getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels, 
            datasets: [{
                data: data,
                backgroundColor: backgroundColors,
                
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels:{color: '#000'},
                    position: 'bottom'
                },
                title: {
                    display: true,
                    text: type.charAt(0).toUpperCase() + type.slice(1) + ' Overview',
                    color: '#000'
                }
            }
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {
    addToOverview("inc_overview_body", 'income', 'incomeChart');
    addToOverview("exp_overview_body", 'expense', 'expenseChart');
});

//when button is clicked, income/expenses view is toggled
$('#ex_view_but').click(function(){//display exp view
    $('.exp_view').toggle();
    $('.inc_view').toggle();
    $('#ex_view_but').prop('disabled', true);
    $('#inc_view_but').prop('disabled', false);
});

$('#inc_view_but').click(function(){//display inc view
    $('.inc_view').toggle();
    $('.exp_view').toggle();
    $('#ex_view_but').prop('disabled', false);
    $('#inc_view_but').prop('disabled', true);
});

//export table based on what is visable
$('#print_but').on('click', async function () {
    const $incOver = $('#inc_overview');
    const $expOver = $('#exp_overview');

    async function exportTableAsCSV($table, excludedIndexes, filename) {
        try {
            const rows = [];

            // Headers
            const headers = [];
            $table.find('thead th').each((index, th) => {
                if (!excludedIndexes.includes(index)) {
                    headers.push($(th).text().trim());
                }
            });
            rows.push(headers);

            // Body rows
            $table.find('tbody tr').each((_, row) => {
                const rowData = [];
                $(row).find('td').each((index, cell) => {
                    if (!excludedIndexes.includes(index)) {
                        rowData.push($(cell).text().trim());
                    }
                });
                rows.push(rowData);
            });

            if (rows.length <= 1) {
                alert("No data to export.");
                return;
            }

            const csvContent = rows.map(row => row.join(",")).join("\n");

            const handle = await window.showSaveFilePicker({
                suggestedName: filename,
                types: [{
                    description: 'CSV Files',
                    accept: { 'text/csv': ['.csv'] },
                }],
            });

            const writable = await handle.createWritable();
            await writable.write(csvContent);
            await writable.close();

            alert('CSV file saved successfully!');
        } catch (err) {
            console.error('Error saving file:', err);
            alert('Export aborted');
        }
    }

    // Check visibility using jQuery
    if ($incOver.is(':visible')) {
        await exportTableAsCSV($incOver, [0], "income.csv");
    } else if ($expOver.is(':visible')) {
        await exportTableAsCSV($expOver, [0], "expenses.csv");
    } else {
        alert("No visible table to export.");
    }
});