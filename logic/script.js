const sidebar = document.getElementById("sidebar");
const openBtn = document.getElementById("openBtn");
const closeBtn = document.getElementById("closeBtn");

const categoriesBtn = document.getElementById("categoriesBtn");
const categoriesMenu = document.getElementById("categoriesMenu");

const giftsBtn = document.getElementById("giftsBtn");
const giftsMenu = document.getElementById("giftsMenu");

// Sidebar toggle
openBtn.addEventListener("click", () => {
  sidebar.classList.remove("-translate-x-full");
});

closeBtn.addEventListener("click", () => {
  sidebar.classList.add("-translate-x-full");
});

// Dropdowns
categoriesBtn.addEventListener("click", () => {
  categoriesMenu.classList.toggle("hidden");
});

giftsBtn.addEventListener("click", () => {
  giftsMenu.classList.toggle("hidden");
});

