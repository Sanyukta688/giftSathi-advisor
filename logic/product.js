/**
 * Product Management Utility
 * This file handles displaying products, cart, and wishlist functionality
 */

// Initialize Database from static project data
function initializeProductDatabase() {
  const existingProducts = JSON.parse(localStorage.getItem("products")) || [];

  // Check if we have seeded products already
  const hasSeeded = existingProducts.some((p) => p.isSeeded);

  // Only seed if no seeded products exist or localStorage is empty
  if (!hasSeeded && typeof allProjectProducts !== "undefined") {
    const seededProducts = allProjectProducts.map((p, index) => ({
      id: 2000 + index, // IDs starting from 2000 for seeded items
      name: p.name,
      price: p.price,
      category: p.category,
      image: p.image.startsWith("/")
        ? p.image
        : "/" + p.image.replace(/^(\.\.\/|\.\/)+/, ""),
      description: p.description || `Premium ${p.category} gift: ${p.name}.`,
      dateAdded: new Date().toLocaleDateString(),
      isSeeded: true,
    }));

    // Merge with any existing user-added products
    const finalProducts = [...existingProducts, ...seededProducts];
    localStorage.setItem("products", JSON.stringify(finalProducts));
    console.log(
      `Initialized database with ${seededProducts.length} base products and ${existingProducts.length} user products.`,
    );
  }
}

/**
 * Robustly save a product to localStorage with error handling for quota limits
 * @param {Object} product - The product object to add
 * @returns {Boolean} - True if successful, false otherwise
 */
function saveProduct(product) {
  try {
    const products = JSON.parse(localStorage.getItem("products")) || [];
    products.push(product);
    localStorage.setItem("products", JSON.stringify(products));
    return true;
  } catch (error) {
    console.error("Error saving product:", error);
    if (
      error.name === "QuotaExceededError" ||
      error.name === "NS_ERROR_DOM_QUOTA_REACHED"
    ) {
      alert(
        "Error: Storage limit reached! This usually happens when uploading large images. Try using a smaller image or picking from the gallery.",
      );
    } else {
      alert("An error occurred while saving the product.");
    }
    return false;
  }
}

// Function to load and display products for a specific category
function loadProductsByCategory(categoryName, containerSelector) {
  // Ensure we are initialized
  initializeProductDatabase();

  const products = JSON.parse(localStorage.getItem("products")) || [];
  const categoryProducts = products.filter((p) => p.category === categoryName);

  const container = document.querySelector(containerSelector);
  if (!container) return;

  // Clear container first (to remove hardcoded placeholders if any)
  container.innerHTML = "";

  if (categoryProducts.length === 0) {
    container.innerHTML = `<div class="col-span-full py-12 text-center text-gray-500">No products found in ${categoryName} category yet.</div>`;
    return;
  }

  // Determine path depth (if we are in /pages/ folder)
  const isSubPage = window.location.pathname.includes("/pages/");
  const pathPrefix = isSubPage ? "/" : "";

  const productHTML = categoryProducts
    .map((product) => {
      // Process image path to work from current page depth
      let imgPath = product.image;

      // Always ensure root path
      if (!imgPath.startsWith("http") && !imgPath.startsWith("data:")) {
        imgPath = imgPath.startsWith("/")
          ? imgPath
          : "/" + imgPath.replace(/^(\.\.\/|\.\/)+/, "");
      }

      return `
      <div class="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-2 group">
        <div class="relative overflow-hidden">
          <img src="${imgPath}" alt="${product.name}" class="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110" />
          <button
            onclick="toggleWishlist(this, ${product.id})"
            class="absolute top-3 right-3 bg-white/90 backdrop-blur-md p-2 rounded-full shadow-sm hover:scale-110 transition-all wishlist-btn"
            data-product-id="${product.id}"
          >
            🤍
          </button>
        </div>
        <div class="p-6">
          <div class="flex justify-between items-start mb-2">
            <h2 class="text-xl font-bold text-gray-800 leading-tight">${product.name}</h2>
            <span class="text-2xl font-black text-green-600">₹${product.price}</span>
          </div>
          <p class="text-gray-500 text-sm mb-6 line-clamp-2 italic font-light">${product.description || "A beautiful and unique gift for your special one."}</p>
          <button
            onclick="goToProductDetail(${product.id})"
            class="w-full bg-[#7c3aed] text-white py-3 rounded-xl hover:bg-purple-700 transition-colors shadow-lg shadow-purple-200 font-bold flex items-center justify-center gap-2"
          >
            🛒 Add to Cart
          </button>
        </div>
      </div>
    `;
    })
    .join("");

  container.innerHTML = productHTML;

  // Update wishlist buttons
  updateWishlistButtons();
}

// Toggle wishlist
function toggleWishlist(btn, productId) {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  const isLiked = btn.innerHTML.trim() === "❤️";

  if (isLiked) {
    wishlist = wishlist.filter((id) => id != productId);
    btn.innerHTML = "🤍";
  } else {
    if (!wishlist.includes(productId)) {
      wishlist.push(productId);
    }
    btn.innerHTML = "❤️";
  }

  localStorage.setItem("wishlist", JSON.stringify(wishlist));
}

// Update wishlist buttons based on local storage
function updateWishlistButtons() {
  const wishlist = (JSON.parse(localStorage.getItem("wishlist")) || []).map(
    (id) => String(id),
  );
  document.querySelectorAll(".wishlist-btn").forEach((btn) => {
    const productId = btn.getAttribute("data-product-id");
    if (wishlist.includes(productId)) {
      btn.innerHTML = "❤️";
    }
  });
}

// Helper to get cart page URL
function getCartPageUrl() {
  return window.location.pathname.includes("/pages/")
    ? "cart.html"
    : "pages/cart.html";
}

function goToProductDetail(productId) {
  const products = JSON.parse(localStorage.getItem("products")) || [];
  const product = products.find((p) => p.id == productId);

  if (!product) {
    alert("Product not found");
    return;
  }

  // Redirect to cart page with product id
  window.location.href = `${getCartPageUrl()}?productId=${productId}`;
}

// Like toggle function (kept for backward compatibility)
function toggleLike(btn) {
  btn.innerHTML = btn.innerHTML.trim() === "🤍" ? "❤️" : "🤍";
}
