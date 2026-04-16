const sidebar = document.getElementById("sidebar");
const openBtn = document.getElementById("openBtn");
const closeBtn = document.getElementById("closeBtn");
const categoriesBtn = document.getElementById("categoriesBtn");
const categoriesMenu = document.getElementById("categoriesMenu");
const arrow = document.getElementById("catArrow");

// OPEN SIDEBAR
function openSidebar() {
  sidebar.classList.remove("-translate-x-full");
}

// CLOSE SIDEBAR
function closeSidebar() {
  sidebar.classList.add("-translate-x-full");
}

// TOGGLE CATEGORIES
function toggleCategories() {
  categoriesMenu.classList.toggle("hidden");
  arrow.textContent = categoriesMenu.classList.contains("hidden") ? "▼" : "▲";
}

// EVENTS
openBtn.addEventListener("click", openSidebar);
closeBtn.addEventListener("click", closeSidebar);
categoriesBtn.addEventListener("click", toggleCategories);
