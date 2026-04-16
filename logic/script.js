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
