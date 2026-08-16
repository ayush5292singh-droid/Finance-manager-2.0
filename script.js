// ================================
// FINANCE MANAGER
// ================================

const PASSWORD = "7890";

let salary = Number(localStorage.getItem("salary")) || 0;
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let notes = localStorage.getItem("notes") || "";


// ================================
// ELEMENTS
// ================================

const lockScreen = document.getElementById("lockScreen");
const app = document.getElementById("app");

const passwordInput = document.getElementById("passwordInput");
const unlockBtn = document.getElementById("unlockBtn");
const passwordError = document.getElementById("passwordError");

const balance = document.getElementById("balance");
const salaryText = document.getElementById("salary");
const salaryBtn = document.getElementById("salaryBtn");

const addExpenseBtn = document.getElementById("addExpenseBtn");
const expenseForm = document.getElementById("expenseForm");

const expenseTitle = document.getElementById("expenseTitle");
const expenseAmount = document.getElementById("expenseAmount");

const saveExpense = document.getElementById("saveExpense");
const cancelExpense = document.getElementById("cancelExpense");

const expenseList = document.getElementById("expenseList");
const expenseError = document.getElementById("expenseError");

const notesBox = document.getElementById("notes");
const saveNotes = document.getElementById("saveNotes");


// ================================
// PASSWORD
// ================================

unlockBtn.addEventListener("click", unlock);

passwordInput.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    unlock();
  }
});

function unlock() {

  if (passwordInput.value === PASSWORD) {

    lockScreen.style.display = "none";
    app.style.display = "block";

    renderAll();

  } else {

    passwordError.textContent = "Incorrect password";

    passwordInput.value = "";

  }
}


// ================================
// SALARY
// ================================

salaryBtn.addEventListener("click", function() {

  const value = prompt("Enter your monthly salary:");

  if (value === null) return;

  const amount = Number(value);

  if (isNaN(amount) || amount < 0) {
    alert("Please enter a valid amount.");
    return;
  }

  salary = amount;

  localStorage.setItem("salary", salary);

  renderAll();
});


// ================================
// BALANCE
// ================================

function calculateBalance() {

  const spent = expenses.reduce(function(total, expense) {
    return total + expense.amount;
  }, 0);

  return salary - spent;
}


function updateBalance() {

  const currentBalance = calculateBalance();

  balance.textContent = formatMoney(currentBalance);

  salaryText.textContent = formatMoney(salary);
}


function formatMoney(number) {

  return "₹" + Number(number).toLocaleString("en-IN");
}


// ================================
// EXPENSE FORM
// ================================

addExpenseBtn.addEventListener("click", function() {

  expenseForm.style.display = "block";

  expenseTitle.focus();

});


cancelExpense.addEventListener("click", function() {

  closeExpenseForm();

});


function closeExpenseForm() {

  expenseForm.style.display = "none";

  expenseTitle.value = "";
  expenseAmount.value = "";

  expenseError.textContent = "";

}


// ================================
// SAVE EXPENSE
// ================================

saveExpense.addEventListener("click", function() {

  const title = expenseTitle.value.trim();

  const amount = Number(expenseAmount.value);


  if (title === "") {

    expenseError.textContent = "Please enter an expense title.";

    return;
  }


  if (!amount || amount <= 0) {

    expenseError.textContent = "Please enter a valid amount.";

    return;
  }


  const newExpense = {

    id: Date.now(),

    title: title,

    amount: amount,

    date: new Date().toLocaleDateString("en-IN")

  };


  expenses.unshift(newExpense);


  localStorage.setItem(
    "expenses",
    JSON.stringify(expenses)
  );


  closeExpenseForm();

  renderAll();

});


// ================================
// DISPLAY EXPENSES
// ================================

function renderExpenses() {

  expenseList.innerHTML = "";


  if (expenses.length === 0) {

    expenseList.innerHTML = `
      <div class="empty">
        <div>💸</div>
        <h3>No expenses yet</h3>
        <p>Add your first expense to start tracking your money.</p>
      </div>
    `;

    return;
  }


  expenses.forEach(function(expense) {

    const card = document.createElement("div");

    card.className = "expenseCard";


    card.innerHTML = `

      <div class="expenseIcon">
        💸
      </div>

      <div class="expenseInfo">

        <h3>${escapeHTML(expense.title)}</h3>

        <p>${expense.date}</p>

      </div>

      <div class="expenseMoney">
        -${formatMoney(expense.amount)}
      </div>

      <button
        class="deleteBtn"
        onclick="deleteExpense(${expense.id})"
      >
        ×
      </button>

    `;


    expenseList.appendChild(card);

  });

}


// ================================
// DELETE EXPENSE
// ================================

function deleteExpense(id) {

  expenses = expenses.filter(function(expense) {

    return expense.id !== id;

  });


  localStorage.setItem(
    "expenses",
    JSON.stringify(expenses)
  );


  renderAll();
}


// ================================
// STATS
// ================================

function renderChart() {

  const chart = document.getElementById("chart");

  chart.innerHTML = "";


  const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];


  const values = [0,0,0,0,0,0,0];


  expenses.forEach(function(expense) {

    const date = new Date(expense.id);

    let day = date.getDay();

    day = day === 0 ? 6 : day - 1;

    values[day] += expense.amount;

  });


  const max = Math.max(...values, 1);


  days.forEach(function(day, index) {

    const box = document.createElement("div");

    box.className = "barBox";


    const bar = document.createElement("div");

    bar.className = "bar";


    const height = (values[index] / max) * 190;

    bar.style.height = Math.max(height, 4) + "px";


    const label = document.createElement("div");

    label.className = "barLabel";

    label.textContent = day;


    box.appendChild(bar);

    box.appendChild(label);

    chart.appendChild(box);

  });


  updateTip(values);

}


// ================================
// MONEY TIP
// ================================

function updateTip(values) {

  const tipTitle = document.getElementById("tipTitle");
  const tipText = document.getElementById("tipText");


  const total = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );


  if (expenses.length === 0) {

    tipTitle.textContent = "Start tracking";

    tipText.textContent =
      "Add some expenses to get personalized spending tips.";

    return;

  }


  if (salary > 0 && total > salary * 0.5) {

    tipTitle.textContent = "Watch your spending";

    tipText.textContent =
      "You have spent more than half of your monthly income.";

    return;

  }


  if (expenses.length >= 5) {

    tipTitle.textContent = "Great tracking";

    tipText.textContent =
      "You're consistently recording your expenses. Keep it up!";

    return;

  }


  tipTitle.textContent = "Good start";

  tipText.textContent =
    "Keep adding your expenses so you can understand your spending habits.";

}


// ================================
// NAVIGATION
// ================================

const navButtons = document.querySelectorAll(".navBtn");

navButtons.forEach(function(button) {

  button.addEventListener("click", function() {

    const pageName = button.dataset.page;


    document.querySelectorAll(".page").forEach(function(page) {

      page.classList.remove("activePage");

    });


    document.getElementById(pageName)
      .classList.add("activePage");


    navButtons.forEach(function(btn) {

      btn.classList.remove("active");

    });


    button.classList.add("active");

  });

});


// ================================
// NOTES
// ================================

notesBox.value = notes;


saveNotes.addEventListener("click", function() {

  notes = notesBox.value;

  localStorage.setItem("notes", notes);

  saveNotes.textContent = "SAVED ✓";

  setTimeout(function() {

    saveNotes.textContent = "SAVE NOTES";

  }, 1500);

});


// ================================
// SECURITY FOR TITLES
// ================================

function escapeHTML(text) {

  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}


// ================================
// RENDER EVERYTHING
// ================================

function renderAll() {

  updateBalance();

  renderExpenses();

  renderChart();

}


// ================================
// START
// ================================

console.log("Finance Manager loaded successfully.");
