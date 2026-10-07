const STORAGE_KEY = "fintrack_transactions_v2";
const THEME_KEY = "fintrack_theme_v1";

// One-time cleanup of the original demo dataset so this updated app starts empty.
const RESET_MARKER = "fintrack_empty_start_v1";
if (!localStorage.getItem(RESET_MARKER)) {
  localStorage.removeItem("fintrack_transactions_v1");
  localStorage.removeItem(STORAGE_KEY);
  localStorage.setItem(RESET_MARKER, "1");
}

const categories = {
  Food: { icon: "bi-cup-hot", color: "#ef8d5c" },
  Transportation: { icon: "bi-car-front", color: "#6d8cff" },
  Shopping: { icon: "bi-bag", color: "#b278ef" },
  Entertainment: { icon: "bi-controller", color: "#e96b9b" },
  Bills: { icon: "bi-receipt", color: "#e1a947" },
  Health: { icon: "bi-heart-pulse", color: "#48b995" },
  Education: { icon: "bi-mortarboard", color: "#4f9bd7" },
  Other: { icon: "bi-three-dots", color: "#8c97a8" }
};


const state = {
  transactions: loadTransactions(),
  editingId: null,
  filters: { search: "", type: "all", category: "all", sort: "newest" }
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const els = {
  balance: $("#balanceValue"),
  income: $("#incomeValue"),
  expenses: $("#expenseValue"),
  savings: $("#savingsValue"),
  incomeMeta: $("#incomeMeta"),
  expenseMeta: $("#expenseMeta"),
  savingsMeta: $("#savingsMeta"),
  transactionList: $("#transactionList"),
  emptyState: $("#emptyState"),
  transactionCount: $("#transactionCount"),
  categoryFilter: $("#categoryFilter"),
  search: $("#searchInput"),
  typeFilter: $("#typeFilter"),
  sort: $("#sortSelect"),
  spendingList: $("#spendingList"),
  legend: $("#categoryLegend"),
  donut: $("#donutChart"),
  donutTotal: $("#donutTotal"),
  trend: $("#trendChart"),
  modal: $("#modalBackdrop"),
  form: $("#transactionForm"),
  modalTitle: $("#modalTitle"),
  saveText: $("#saveButtonText"),
  type: $("#transactionType"),
  description: $("#description"),
  amount: $("#amount"),
  category: $("#category"),
  date: $("#transactionDate"),
  toastStack: $("#toastStack")
};

function loadTransactions() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}

function saveTransactions() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.transactions));
}

function money(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2
  }).format(value);
}

function shortMoney(value) {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
  return `$${Math.round(value)}`;
}

function formatDate(dateString) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short", day: "numeric", year: "numeric"
  }).format(new Date(`${dateString}T00:00:00`));
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[char]));
}

function calculateSummary(transactions = state.transactions) {
  const income = transactions.filter(t => t.type === "income").reduce((sum, t) => sum + Number(t.amount), 0);
  const expenses = transactions.filter(t => t.type === "expense").reduce((sum, t) => sum + Number(t.amount), 0);
  const balance = income - expenses;
  const savingsRate = income > 0 ? (balance / income) * 100 : 0;
  return { income, expenses, balance, savingsRate };
}

function getFilteredTransactions() {
  const { search, type, category, sort } = state.filters;
  let result = state.transactions.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(search.toLowerCase());
    const matchesType = type === "all" || t.type === type;
    const matchesCategory = category === "all" || t.category === category;
    return matchesSearch && matchesType && matchesCategory;
  });

  result.sort((a, b) => {
    if (sort === "newest") return new Date(b.date) - new Date(a.date);
    if (sort === "oldest") return new Date(a.date) - new Date(b.date);
    if (sort === "highest") return Number(b.amount) - Number(a.amount);
    if (sort === "lowest") return Number(a.amount) - Number(b.amount);
    if (sort === "az") return a.description.localeCompare(b.description);
    return 0;
  });
  return result;
}

function renderSummary() {
  const { income, expenses, balance, savingsRate } = calculateSummary();
  els.balance.textContent = money(balance);
  els.income.textContent = money(income);
  els.expenses.textContent = money(expenses);
  els.savings.textContent = `${Math.max(0, savingsRate).toFixed(0)}%`;
  els.incomeMeta.textContent = `${state.transactions.filter(t => t.type === "income").length} income entries`;
  els.expenseMeta.textContent = `${state.transactions.filter(t => t.type === "expense").length} expense entries`;
  els.savingsMeta.textContent = balance >= 0 ? `${money(balance)} retained` : `${money(Math.abs(balance))} over budget`;
  $("#savingsBadge").textContent = savingsRate >= 20 ? "Healthy" : savingsRate > 0 ? "Building" : "Review";
  $("#savingsBadge").className = `stat-badge ${savingsRate > 0 ? "positive" : "negative"}`;
  $("#balanceBadge").textContent = balance >= 0 ? "Positive" : "Negative";
  $("#balanceBadge").className = `stat-badge ${balance >= 0 ? "positive" : "negative"}`;
}

function populateCategories() {
  const current = els.category.value;
  els.category.innerHTML = Object.keys(categories)
    .map(cat => `<option value="${cat}">${cat}</option>`).join("");
  els.categoryFilter.innerHTML = `<option value="all">All categories</option>` +
    Object.keys(categories).map(cat => `<option value="${cat}">${cat}</option>`).join("");
  els.category.value = current || "Food";
  els.categoryFilter.value = state.filters.category;
}

function renderTransactions() {
  const transactions = getFilteredTransactions();
  els.transactionList.innerHTML = transactions.map(transactionRow).join("");
  els.emptyState.classList.toggle("hidden", transactions.length !== 0);
  els.transactionCount.textContent = `${transactions.length} ${transactions.length === 1 ? "transaction" : "transactions"}`;
}

function transactionRow(t) {
  const meta = categories[t.category] || categories.Other;
  const sign = t.type === "income" ? "+" : "−";
  return `
    <tr>
      <td>
        <div class="transaction-name">
          <div class="transaction-icon"><i class="bi ${meta.icon}"></i></div>
          <div><strong>${escapeHTML(t.description)}</strong><span>${escapeHTML(t.category)}</span></div>
        </div>
      </td>
      <td><span class="category-pill">${escapeHTML(t.category)}</span></td>
      <td><span class="date-copy">${formatDate(t.date)}</span></td>
      <td><span class="amount-copy ${t.type}">${sign}${money(t.amount)}</span></td>
      <td><span class="type-pill ${t.type}"><i class="bi ${t.type === "income" ? "bi-arrow-down-left" : "bi-arrow-up-right"}"></i>${t.type}</span></td>
      <td>
        <div class="row-actions">
          <button class="row-btn" data-action="edit" data-id="${t.id}" aria-label="Edit ${escapeHTML(t.description)}" title="Edit"><i class="bi bi-pencil"></i></button>
          <button class="row-btn delete" data-action="delete" data-id="${t.id}" aria-label="Delete ${escapeHTML(t.description)}" title="Delete"><i class="bi bi-trash3"></i></button>
        </div>
      </td>
    </tr>
  `;
}

function getCategoryTotals() {
  return Object.keys(categories).map(category => ({
    category,
    amount: state.transactions
      .filter(t => t.type === "expense" && t.category === category)
      .reduce((sum, t) => sum + Number(t.amount), 0)
  }));
}

function renderSpending() {
  const totals = getCategoryTotals();
  const max = Math.max(...totals.map(item => item.amount), 1);
  els.spendingList.innerHTML = totals.map(({ category, amount }) => {
    const meta = categories[category];
    const percentage = amount ? Math.round((amount / max) * 100) : 0;
    return `
      <div class="spending-row">
        <div class="spending-meta">
          <div class="spending-label"><span class="spending-icon"><i class="bi ${meta.icon}"></i></span>${category}</div>
          <span class="spending-amount">${money(amount)}</span>
        </div>
        <div class="progress-track"><div class="progress-bar" style="width:${percentage}%; background:${meta.color}"></div></div>
      </div>
    `;
  }).join("");
}

function renderDonut() {
  const totals = getCategoryTotals().filter(item => item.amount > 0);
  const total = totals.reduce((sum, item) => sum + item.amount, 0);
  els.donutTotal.textContent = shortMoney(total);

  if (!total) {
    els.donut.style.background = "conic-gradient(var(--border) 0 100%)";
    els.legend.innerHTML = `<div class="empty-state" style="padding:20px 0"><p>No expense data yet.</p></div>`;
    return;
  }

  let cursor = 0;
  const segments = totals.map(item => {
    const start = cursor;
    cursor += (item.amount / total) * 100;
    return `${categories[item.category].color} ${start}% ${cursor}%`;
  });
  els.donut.style.background = `conic-gradient(${segments.join(",")})`;

  els.legend.innerHTML = totals.map(item => {
    const percentage = Math.round((item.amount / total) * 100);
    return `<div class="legend-item">
      <span class="legend-dot" style="background:${categories[item.category].color}"></span>
      <span>${item.category}</span>
      <strong>${percentage}%</strong>
    </div>`;
  }).join("");
}

function renderTrend() {
  const days = [...Array(7)].map((_, index) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (6 - index));
    return date;
  });
  const values = days.map(day => {
    const key = day.toISOString().slice(0, 10);
    return {
      label: day.toLocaleDateString("en-US", { weekday: "short" }).slice(0, 2),
      income: state.transactions.filter(t => t.date === key && t.type === "income").reduce((s,t) => s + Number(t.amount), 0),
      expense: state.transactions.filter(t => t.date === key && t.type === "expense").reduce((s,t) => s + Number(t.amount), 0)
    };
  });
  const max = Math.max(...values.flatMap(v => [v.income, v.expense]), 1);

  els.trend.innerHTML = values.map(day => `
    <div class="trend-day">
      <div class="trend-bar income" style="height:${Math.max((day.income / max) * 88, day.income ? 4 : 1)}%"></div>
      <div class="trend-bar expense" style="height:${Math.max((day.expense / max) * 88, day.expense ? 4 : 1)}%"></div>
      <span class="trend-label">${day.label}</span>
    </div>
  `).join("");
}

function renderAll() {
  renderSummary();
  renderTransactions();
  renderSpending();
  renderDonut();
  renderTrend();
}

function openModal(id = null) {
  state.editingId = id;
  clearErrors();
  els.form.reset();

  if (id) {
    const transaction = state.transactions.find(t => t.id === id);
    if (!transaction) return;
    els.modalTitle.textContent = "Edit transaction";
    els.saveText.textContent = "Update transaction";
    els.description.value = transaction.description;
    els.amount.value = transaction.amount;
    els.date.value = transaction.date;
    els.category.value = transaction.category;
    setTransactionType(transaction.type);
  } else {
    els.modalTitle.textContent = "Add transaction";
    els.saveText.textContent = "Save transaction";
    els.date.value = new Date().toISOString().slice(0, 10);
    els.category.value = "Food";
    setTransactionType("expense");
  }

  els.modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
  setTimeout(() => els.description.focus(), 80);
}

function closeModal() {
  els.modal.classList.add("hidden");
  document.body.style.overflow = "";
  state.editingId = null;
  clearErrors();
}

function setTransactionType(type) {
  els.type.value = type;
  $$(".type-option").forEach(btn => btn.classList.toggle("active", btn.dataset.type === type));
}

function validateForm() {
  clearErrors();
  let valid = true;

  if (!els.description.value.trim()) {
    showError("description", "Description is required.");
    valid = false;
  }
  if (!els.amount.value || Number(els.amount.value) <= 0 || !Number.isFinite(Number(els.amount.value))) {
    showError("amount", "Enter an amount greater than 0.");
    valid = false;
  }
  if (!els.date.value || Number.isNaN(new Date(`${els.date.value}T00:00:00`).getTime())) {
    showError("date", "Choose a valid date.");
    valid = false;
  }
  if (!els.category.value) {
    showError("category", "Choose a category.");
    valid = false;
  }
  return valid;
}

function showError(field, message) {
  const error = $(`#${field}Error`);
  if (error) error.textContent = message;
  const input = $(`#${field}`);
  if (input) input.closest(".input-wrap")?.setAttribute("aria-invalid", "true");
}

function clearErrors() {
  $$(".field-error").forEach(el => el.textContent = "");
  $$(".input-wrap[aria-invalid]").forEach(el => el.removeAttribute("aria-invalid"));
}

function saveTransaction(event) {
  event.preventDefault();
  if (!validateForm()) {
    showToast("Please fix the highlighted fields.", "error");
    return;
  }

  const data = {
    description: els.description.value.trim(),
    amount: Number(Number(els.amount.value).toFixed(2)),
    type: els.type.value,
    category: els.category.value,
    date: els.date.value
  };

  if (state.editingId) {
    const index = state.transactions.findIndex(t => t.id === state.editingId);
    state.transactions[index] = { ...state.transactions[index], ...data };
    showToast("Transaction updated successfully.");
  } else {
    state.transactions.unshift({ id: crypto.randomUUID(), ...data });
    showToast("Transaction added successfully.");
  }

  saveTransactions();
  renderAll();
  closeModal();
}

function deleteTransaction(id) {
  const transaction = state.transactions.find(t => t.id === id);
  if (!transaction) return;
  const confirmed = window.confirm(`Delete "${transaction.description}"? This action cannot be undone.`);
  if (!confirmed) return;

  state.transactions = state.transactions.filter(t => t.id !== id);
  saveTransactions();
  renderAll();
  showToast("Transaction deleted.");
}

function clearAllData() {
  if (!state.transactions.length) {
    showToast("There is no transaction data to clear.", "error");
    return;
  }

  const confirmed = window.confirm(
    "Clear all transactions? This will reset your FinTrack data to zero and cannot be undone."
  );

  if (!confirmed) return;

  state.transactions = [];
  state.editingId = null;
  saveTransactions();
  resetFilters();
  renderAll();
  showToast("All transaction data has been cleared.");
}

function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `toast ${type === "error" ? "error" : ""}`;
  toast.innerHTML = `<i class="bi ${type === "error" ? "bi-exclamation-circle" : "bi-check-circle"}"></i><div><strong>${type === "error" ? "Something went wrong" : "FinTrack"}</strong><span>${escapeHTML(message)}</span></div>`;
  els.toastStack.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(5px)";
    setTimeout(() => toast.remove(), 180);
  }, 3000);
}

function exportData() {
  if (!state.transactions.length) {
    showToast("There is no transaction data to export.", "error");
    return;
  }
  const headers = ["Description", "Amount", "Type", "Category", "Date"];
  const rows = state.transactions.map(t => [t.description, t.amount, t.type, t.category, t.date]);
  const csv = [headers, ...rows].map(row => row.map(value => `"${String(value).replaceAll('"', '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `fintrack-transactions-${new Date().toISOString().slice(0,10)}.csv`;
  anchor.click();
  URL.revokeObjectURL(url);
  showToast("Transaction data exported as CSV.");
}

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem(THEME_KEY, theme);
  $("#themeToggle").innerHTML = `<i class="bi ${theme === "dark" ? "bi-sun" : "bi-moon-stars"}"></i>`;
  $("#themeToggle").setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
}

function initializeTheme() {
  const stored = localStorage.getItem(THEME_KEY);
  const preferred = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  setTheme(stored || preferred);
}

function resetFilters() {
  state.filters = { search: "", type: "all", category: "all", sort: "newest" };
  els.search.value = "";
  els.typeFilter.value = "all";
  els.categoryFilter.value = "all";
  els.sort.value = "newest";
  renderTransactions();
}

function bindEvents() {
  $("#addTransactionBtn").addEventListener("click", () => openModal());
  $("#sidebarAdd").addEventListener("click", () => { closeSidebar(); openModal(); });
  $("#emptyAddBtn").addEventListener("click", () => openModal());
  $("#closeModal").addEventListener("click", closeModal);
  $("#cancelModal").addEventListener("click", closeModal);
  els.form.addEventListener("submit", saveTransaction);

  $$(".type-option").forEach(btn => btn.addEventListener("click", () => setTransactionType(btn.dataset.type)));

  els.search.addEventListener("input", e => { state.filters.search = e.target.value; renderTransactions(); });
  els.typeFilter.addEventListener("change", e => { state.filters.type = e.target.value; renderTransactions(); });
  els.categoryFilter.addEventListener("change", e => { state.filters.category = e.target.value; renderTransactions(); });
  els.sort.addEventListener("change", e => { state.filters.sort = e.target.value; renderTransactions(); });
  $("#clearFiltersBtn").addEventListener("click", resetFilters);
  $("#clearAllBtn").addEventListener("click", clearAllData);
  $("#sidebarExport").addEventListener("click", exportData);

  els.transactionList.addEventListener("click", e => {
    const button = e.target.closest("[data-action]");
    if (!button) return;
    if (button.dataset.action === "edit") openModal(button.dataset.id);
    if (button.dataset.action === "delete") deleteTransaction(button.dataset.id);
  });

  $("#themeToggle").addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    setTheme(next);
  });

  $("#openSidebar").addEventListener("click", openSidebar);
  $("#closeSidebar").addEventListener("click", closeSidebar);
  $("#sidebarOverlay").addEventListener("click", closeSidebar);

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      if (!els.modal.classList.contains("hidden")) closeModal();
      else closeSidebar();
    }
  });
}

function openSidebar() {
  $("#sidebar").classList.add("open");
  $("#sidebarOverlay").classList.add("show");
}
function closeSidebar() {
  $("#sidebar").classList.remove("open");
  $("#sidebarOverlay").classList.remove("show");
}

populateCategories();
initializeTheme();
bindEvents();
renderAll();
