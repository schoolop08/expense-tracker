document.addEventListener("DOMContentLoaded", () => {
    const moneyForm = document.getElementById("money-form");
    const expenseForm = document.getElementById("expense-form");
    const expenseList = document.getElementById("expense-list");
    const filterCategory = document.getElementById("filter-category");
    const filterDate = document.getElementById("filter-date");
    const balanceDiv = document.getElementById("balance");
    const feedbackDiv = document.getElementById("feedback");
    const amountInput = document.getElementById("amount");
    const categoryInput = document.getElementById("category");
    let availableMoney = 0;
  
    moneyForm.addEventListener("submit", setMoney);
    expenseForm.addEventListener("submit", addExpense);
    expenseList.addEventListener("click", deleteExpense);
    filterCategory.addEventListener("input", filterExpenses);
    filterDate.addEventListener("input", filterExpenses);
    amountInput.addEventListener("input", validateAmount);
  
    function setMoney(e) {
        e.preventDefault();
        availableMoney = parseFloat(document.getElementById("money").value);
        if (availableMoney < 0) {
            showFeedback("Money cannot be negative", "error");
            return;
        }
        localStorage.setItem("money", availableMoney);
        updateBalance();
        moneyForm.reset();
        showFeedback("Money set successfully", "success", true);
    }
  
    function addExpense(e) {
        e.preventDefault();
        const amount = parseFloat(amountInput.value);
        const category = categoryInput.value;
        const date = document.getElementById("date").value;
  
        if (amount <= 0) {
            showFeedback("Amount must be greater than zero", "error");
            return;
        }
  
        if (amount > availableMoney) {
            showFeedback("Amount exceeds available balance", "error");
            return;
        }
  
        const expense = {
            id: Date.now(),
            amount,
            category,
            date,
        };
  
        const expenses = getExpenses();
        expenses.push(expense);
        localStorage.setItem("expenses", JSON.stringify(expenses));
  
        availableMoney -= amount;
        localStorage.setItem("money", availableMoney);
        updateBalance();
  
        displayExpenses();
        expenseForm.reset();
        showFeedback("Expense added successfully", "success");
    }
  
    function deleteExpense(e) {
        if (e.target.tagName === "BUTTON") {
            const id = e.target.parentElement.dataset.id;
            const expenses = getExpenses();
            const expense = expenses.find((exp) => exp.id == id);
            const filteredExpenses = expenses.filter(
                (expense) => expense.id != id
            );
            localStorage.setItem("expenses", JSON.stringify(filteredExpenses));
  
            availableMoney += parseFloat(expense.amount);
            localStorage.setItem("money", availableMoney);
            updateBalance();
  
            displayExpenses();
            showFeedback("Expense deleted successfully", "success");
        }
    }
  
    function filterExpenses() {
        displayExpenses();
    }
  
    function displayExpenses() {
        const expenses = getExpenses();
        const filteredCategory = filterCategory.value.toLowerCase();
        const filteredDate = filterDate.value;
  
        // Sort expenses by date (descending)
        expenses.sort((a, b) => new Date(b.date) - new Date(a.date));
  
        // Clear the existing expense list
        expenseList.innerHTML = "";
  
        // Group expenses by date
        const groupedExpenses = expenses.reduce((groups, expense) => {
            const date = expense.date;
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(expense);
            return groups;
        }, {});
  
        // Display grouped expenses
        Object.keys(groupedExpenses).forEach((date) => {
            // Filter out groups based on filtered date if needed
            if (filteredDate === "" || date === filteredDate) {
                // Create a date header
                const dateHeader = document.createElement("h4");
                dateHeader.textContent = date;
                expenseList.appendChild(dateHeader);
  
                groupedExpenses[date].forEach((expense) => {
                    // Filter out individual expenses based on category if needed
                    if (
                        filteredCategory === "" ||
                        expense.category.toLowerCase().includes(filteredCategory)
                    ) {
                        const li = document.createElement("h3");
                        li.className = "expense-item";
                        li.dataset.id = expense.id;
                        li.innerHTML = `
                            ₹${expense.amount} - ${expense.category}
                            <button>×</button>
                        `;
                        expenseList.appendChild(li);
                    }
                });
            }
        });
    }
  
    function getExpenses() {
        return localStorage.getItem("expenses")
            ? JSON.parse(localStorage.getItem("expenses"))
            : [];
    }
  
    function updateBalance() {
        balanceDiv.innerHTML = `₹${availableMoney.toFixed(2)} 
                <button id="reset-balance">Reset Balance</button>`;
        document.getElementById("reset-balance").addEventListener("click", resetBalance);
        validateAmount();
    }
  
    function resetBalance() {
        const newBalance = prompt("Enter new balance:");
        if (newBalance !== null && !isNaN(newBalance) && newBalance >= 0) {
            availableMoney = parseFloat(newBalance);
            localStorage.setItem("money", availableMoney);
            updateBalance();
            showFeedback("Balance reset successfully", "success");
        } else if (newBalance !== null) {
            showFeedback("Invalid balance entered", "error");
        }
    }
  
    function validateAmount() {
        const amount = parseFloat(amountInput.value);
        if (amount > availableMoney) {
            amountInput.setCustomValidity("Amount exceeds available balance");
        } else {
            amountInput.setCustomValidity("");
        }
    }
  
    function showFeedback(message, type, oneTime = false) {
        feedbackDiv.textContent = message;
        feedbackDiv.className = `feedback ${type}`;
        if (!oneTime) {
            setTimeout(() => {
                feedbackDiv.textContent = "";
                feedbackDiv.className = "feedback";
            }, 3000);
        }
    }
  
    function loadInitialData() {
        availableMoney = parseFloat(localStorage.getItem("money")) || 0;
        if (availableMoney === 0) {
            showBalancePopup();
        }
        updateBalance();
        displayExpenses();
    }
  
    function showBalancePopup() {
        const popup = document.getElementById("balance-popup");
        const setBalanceBtn = document.getElementById("set-balance-btn");
  
        // Show the popup
        popup.classList.remove("hidden");
        popup.style.display = "block";
  
        // Set the balance when the button is clicked
        setBalanceBtn.addEventListener("click", () => {
            const initialBalance = parseFloat(document.getElementById("initial-balance").value);
            if (!isNaN(initialBalance) && initialBalance >= 0) {
                availableMoney = initialBalance;
                localStorage.setItem("money", availableMoney);
                updateBalance();
                popup.style.display = "none"; // Hide the popup
                showFeedback("Balance set successfully", "success");
            } else {
                showFeedback("Please enter a valid balance", "error");
            }
        });
    }
  
    loadInitialData();
  });
  