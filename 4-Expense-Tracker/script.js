const balanceEl = document.querySelector(".header h1");
const incomeAmountEl = document.querySelector(".list:nth-child(1) p");
const expenseAmountEl = document.querySelector(".list:nth-child(2) p");
const transactionListEl = document.querySelector(".transaction-list");
const transactionFormEl = document.querySelector(".form form");
const descriptionEl = document.getElementById("description");
const amountEl = document.getElementById("amount");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

transactionFormEl.addEventListener("submit", addTransaction);

function addTransaction(e) {
  e.preventDefault();


  const description = descriptionEl.value.trim();
  const amount = parseFloat(amountEl.value);

  if (description === "" || isNaN(amount)) {
    alert("Please enter a valid description and amount");
    return;
  }

  transactions.push({
    id: Date.now(),
    description,
    amount,
  });

  localStorage.setItem("transactions", JSON.stringify(transactions));

  updateTransactionList();
  updateSummary();

  transactionFormEl.reset();
}

function updateTransactionList() {
  transactionListEl.innerHTML = "";

  const sortedTransactions = [...transactions].reverse();

  sortedTransactions.forEach((transaction) => {
    const transactionEl = createTransactionElement(transaction);
    transactionListEl.appendChild(transactionEl);
  });
}

function createTransactionElement(transaction) {
  const div = document.createElement("div");
  div.classList.add("transaction-item");
  // The CSS uses .transaction-item and has a border-right for green by default. 
  // We can add inline style for expense or just keep it simple.
  if (transaction.amount < 0) {
    div.style.borderRightColor = "#e74c3c"; // Red for expense
  }

  div.innerHTML = `
    <p>${transaction.description}</p>
    <p>
      ${formatCurrency(transaction.amount)}
      <button class="delete-btn" onclick="removeTransaction(${transaction.id})" style="margin-left: 10px; cursor: pointer; border: none; background: none; color: #e74c3c; font-weight: bold;">x</button>
    </p>
  `;

  return div;
}

function updateSummary() {

  const balance = transactions.reduce((acc, transaction) => acc + transaction.amount, 0);

  const income = transactions
    .filter((transaction) => transaction.amount > 0)
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  const expenses = transactions
    .filter((transaction) => transaction.amount < 0)
    .reduce((acc, transaction) => acc + transaction.amount, 0);


  balanceEl.textContent = formatCurrency(balance);
  incomeAmountEl.textContent = formatCurrency(income);
  expenseAmountEl.textContent = formatCurrency(expenses);
}

function formatCurrency(number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(number);
}

function removeTransaction(id) {

  transactions = transactions.filter((transaction) => transaction.id !== id);

  localStorage.setItem("transactions", JSON.stringify(transactions));

  updateTransactionList();
  updateSummary();
}


updateTransactionList();
updateSummary();