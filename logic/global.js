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
      const searchUrl = isSubPage ? "/index.html" : "index.html";

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

let currentProduct = null;

// Check if product detail view is needed (coming from shop pages)
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("productId");
const productName = urlParams.get("productName");
const productPrice = urlParams.get("price");

if (productId) {
  // Load from admin products
  const products = JSON.parse(localStorage.getItem("products")) || [];
  currentProduct = products.find((p) => p.id == productId);
  if (currentProduct) showProductDetail();
} else if (productName && productPrice) {
  // Static product from URL params
  currentProduct = {
    name: productName,
    price: parseInt(productPrice),
    category: urlParams.get("category") || "Gift",
    image: urlParams.get("image") || "/gifts/Logo.png",
    description:
      urlParams.get("description") || `Premium quality ${productName}.`,
  };
  showProductDetail();
} else {
  loadCart();
}

function showProductDetail() {
  if (!currentProduct) return;

  document.getElementById("productDetailView").classList.remove("hidden");
  document.getElementById("cartItemsView").style.display = "none";

  document.getElementById("detailImage").src = currentProduct.image;
  document.getElementById("detailName").textContent = currentProduct.name;
  document.getElementById("detailCategoryValue").textContent =
    currentProduct.category;
  document.getElementById("detailDescription").textContent =
    currentProduct.description;
  document.getElementById("detailPrice").textContent = currentProduct.price;
  document.getElementById("summaryPrice").textContent = currentProduct.price;

  updateDetailSummary();
}

function updateDetailSummary() {
  const qty = parseInt(document.getElementById("quantityInput").value);
  const total = currentProduct.price * qty;
  document.getElementById("summaryQuantity").textContent = qty;
  document.getElementById("summaryTotal").textContent = total;
}

function increaseQuantity() {
  const input = document.getElementById("quantityInput");
  input.value = parseInt(input.value) + 1;
  updateDetailSummary();
}

function decreaseQuantity() {
  const input = document.getElementById("quantityInput");
  if (parseInt(input.value) > 1) {
    input.value = parseInt(input.value) - 1;
    updateDetailSummary();
  }
}

function addCurrentProductToCart() {
  const qty = parseInt(document.getElementById("quantityInput").value);
  CartManager.addToCart(currentProduct, qty);
  alert("Product added to cart!");
  window.location.href = "cart.html";
}

function addCurrentProductToWishlist() {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  const productId =
    currentProduct.id || `${currentProduct.name}-${currentProduct.price}`;

  if (!wishlist.includes(productId)) {
    wishlist.push(productId);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    alert("Added to wishlist!");
  } else {
    alert("Already in wishlist!");
  }
}

function goBackToCart() {
  window.location.href = "cart.html";
}

function loadCart() {
  const cart = CartManager.getCart();
  const container = document.getElementById("cartContainer");
  const totals = CartManager.getTotals();

  if (cart.length === 0) {
    container.innerHTML =
      '<p class="col-span-full text-gray-500 text-center py-12">Your cart is empty. <a href="../index.html" class="text-[#7c3aed] hover:underline">Continue shopping</a></p>';
    document.getElementById("checkoutBtn").style.display = "none";
    document.getElementById("totalItems").textContent = 0;
    document.getElementById("subtotal").textContent = 0;
    document.getElementById("totalAmount").textContent = 0;
    updateNavbarCounts();
    return;
  }

  container.innerHTML = cart
    .map(
      (item) => `
          <div class="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition">
            <img src="${item.image}" alt="${item.name}" class="w-full h-40 object-cover rounded-lg mb-3" />
            <h3 class="font-semibold text-gray-800 mb-2">${item.name}</h3>
            <p class="text-green-600 font-bold mb-2">₹${item.price}</p>
            
            <div class="flex items-center gap-2 mb-3">
              <button onclick="updateCartQuantity('${item.id}', -1)" class="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400">-</button>
              <span class="px-3">${item.quantity}</span>
              <button onclick="updateCartQuantity('${item.id}', 1)" class="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400">+</button>
            </div>

            <p class="text-gray-600 text-sm mb-3">Subtotal: ₹${item.price * item.quantity}</p>
            
            <button onclick="removeFromCart('${item.id}')" class="w-full px-3 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600">
              Remove
            </button>
          </div>
        `,
    )
    .join("");

  document.getElementById("totalItems").textContent = totals.totalItems;
  document.getElementById("subtotal").textContent = totals.totalAmount;
  document.getElementById("totalAmount").textContent = totals.totalAmount;
  document.getElementById("checkoutBtn").style.display = "block";
  updateNavbarCounts();
}

function updateCartQuantity(id, change) {
  CartManager.updateQuantity(id, change);
  loadCart();
}

function removeFromCart(id) {
  if (confirm("Remove this item?")) {
    CartManager.removeFromCart(id);
    loadCart();
  }
}

function proceedToCheckout() {
  const totals = CartManager.getTotals();
  alert(
    `Order Summary:\nTotal Items: ${totals.totalItems}\nTotal Amount: ₹${totals.totalAmount}\n\nThank you for shopping!`,
  );
  CartManager.clearCart();
  window.location.href = "../index.html";
}

function updateNavbarCounts() {
  const cartCount = document.getElementById("cartCount");
  const wishlistCount = document.getElementById("wishlistCount");
  const totals = CartManager.getTotals();
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

  if (cartCount) {
    cartCount.textContent = totals.totalItems > 0 ? totals.totalItems : "";
  }
  if (wishlistCount) {
    wishlistCount.textContent = wishlist.length > 0 ? wishlist.length : "";
  }
}
