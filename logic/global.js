/**
 * Global search logic for the navbar across all pages
 */

function handleGlobalSearch(event, input) {
  if (event.key === "Enter") {
    const query = input.value.trim();
    if (query) {
      // Determine the search page URL (relative to the current page)
      const currentPath = window.location.pathname;
      const isSubPage = currentPath.includes("/pages/");
      const searchUrl = isSubPage ? "../index.html" : "index.html";

      // Redirect to home with search query in URL
      window.location.href = `${searchUrl}?search=${encodeURIComponent(query)}`;
    }
  }
}

// On page load, check for search query in URL (for Home page)
document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const searchQuery = urlParams.get("search");
  const searchInput = document.getElementById("searchInput");

  if (searchQuery && searchInput) {
    searchInput.value = searchQuery;
    displaySearchResults(searchQuery);
  }
});

function searchGift() {
  const searchInput = document.getElementById("searchInput");
  if (!searchInput) return;

  const query = searchInput.value.trim();
  if (!query) {
    alert("Please enter a search term");
    return;
  }

  window.location.href = `index.html?search=${encodeURIComponent(query)}`;
}

function displaySearchResults(searchQuery) {
  const section = document.getElementById("searchResultsSection");
  const container = document.getElementById("searchResultsContainer");
  const title = document.getElementById("searchResultsTitle");
  const subtitle = document.getElementById("searchResultsSub");

  if (!section || !container || !title || !subtitle) return;

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const sourceProducts =
    typeof allProjectProducts !== "undefined" ? allProjectProducts : [];

  const results = sourceProducts.filter((product) => {
    const name = product.name.toLowerCase();
    const category = product.category.toLowerCase();
    const description = (product.description || "").toLowerCase();
    return (
      name.includes(normalizedQuery) ||
      category.includes(normalizedQuery) ||
      description.includes(normalizedQuery)
    );
  });

  title.textContent = `Search Results for "${searchQuery}"`;
  subtitle.textContent =
    results.length > 0
      ? `${results.length} matching gift${results.length === 1 ? "" : "s"} found`
      : "No matching gifts found. Try another term.";

  section.classList.remove("hidden");
  container.innerHTML =
    results.length === 0
      ? '<div class="col-span-full py-12 text-center text-gray-500">No gifts found for your search. Please try a different keyword.</div>'
      : results
          .map((product) => {
            const imagePath = product.image.startsWith("/")
              ? product.image
              : `/${product.image}`;
            return `
          <div class="bg-white rounded-3xl shadow-md overflow-hidden hover:shadow-xl transition">
            <img src="${imagePath}" alt="${product.name}" class="w-full h-52 object-cover" />
            <div class="p-5 space-y-4">
              <div class="flex justify-between items-center">
                <div>
                  <h3 class="text-lg font-semibold text-gray-900">${product.name}</h3>
                  <p class="text-gray-500 text-sm">${product.category}</p>
                </div>
                <button onclick="quickAddToWishlist('${product.name}', ${product.price}, '${imagePath}', '${product.category}')" class="text-xl">❤️</button>
              </div>
              <p class="text-gray-500 text-sm line-clamp-2">${product.description || "Beautiful gift for any occasion."}</p>
              <div class="flex items-center justify-between">
                <span class="text-2xl font-bold text-green-600">₹${product.price}</span>
                <button onclick="quickAddToCart('${product.name}', ${product.price}, '${imagePath}', '${product.category}')" class="bg-[#7c3aed] text-white px-3 py-2 rounded-2xl text-sm hover:bg-purple-700 transition">Add to Cart</button>
              </div>
            </div>
          </div>
        `;
          })
          .join("");
}

function clearSearchResults() {
  const section = document.getElementById("searchResultsSection");
  const container = document.getElementById("searchResultsContainer");
  if (!section || !container) return;
  section.classList.add("hidden");
  container.innerHTML = "";
  const title = document.getElementById("searchResultsTitle");
  const subtitle = document.getElementById("searchResultsSub");
  if (title) title.textContent = "Search Results";
  if (subtitle)
    subtitle.textContent =
      "Use the search bar to find gift ideas by name, category, or keyword.";
}

function quickAddToWishlist(name, price, image = "", category = "Gift") {
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  const id = `${name}-${price}-${category}`.replace(/\s+/g, "-");
  const item = { id, name, price, image, category };
  const duplicate = wishlist.some(
    (entry) =>
      (entry && typeof entry === "object" && entry.id === id) || entry === id,
  );

  if (duplicate) {
    alert("This item is already in your wishlist.");
    return;
  }

  wishlist.push(item);
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  alert(`${name} added to wishlist!`);
}
