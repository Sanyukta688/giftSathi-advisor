// ===== SIDEBAR TOGGLE =====
const sidebar = document.getElementById("sidebar");
const openBtn = document.getElementById("openBtn");
const closeBtn = document.getElementById("closeBtn");

function toggleSidebar() {
  sidebar.classList.toggle("-translate-x-full");
}

openBtn.addEventListener("click", toggleSidebar);
closeBtn.addEventListener("click", toggleSidebar);

// Close sidebar when clicking outside
document.addEventListener("click", function (event) {
  if (
    !sidebar.contains(event.target) &&
    !openBtn.contains(event.target) &&
    !sidebar.classList.contains("-translate-x-full")
  ) {
    sidebar.classList.add("-translate-x-full");
  }
});

// ===== DROPDOWN TOGGLES =====
function toggleCategories() {
  document.getElementById("categoriesMenu").classList.toggle("hidden");
  document.getElementById("catArrow").textContent = document
    .getElementById("categoriesMenu")
    .classList.contains("hidden")
    ? "🔻"
    : "🔻";
}



// ===== CART FUNCTIONALITY =====
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

// Category navigation helper
function jumpToCategory(category) {
  const categoryPages = {
    Birthday: "pages/birthday.html",
    Anniversary: "pages/anniversary.html",
    Wedding: "pages/wedding.html",
    Festival: "pages/festival.html",
    Couple: "pages/couple.html",
    General: "pages/general.html",
    Baby: "pages/baby.html",
    Friendship: "pages/friendship.html",
    Home: "pages/home.html",
    Creative: "pages/creative.html",
    Tech: "pages/tech.html",
    Fitness: "pages/fitness.html",
    Travel: "pages/travel.html",
  };

  const page = categoryPages[category];
  if (page) {
    window.location.href = page;
  }
}
