// Load products and initialize database on page load
document.addEventListener("DOMContentLoaded", () => {
  initializeProductDatabase();
  loadProducts();
  loadGallery();
});

let currentGalleryImage = "";

// Form submission
document.getElementById("productForm").addEventListener("submit", function (e) {
  e.preventDefault();
  addProduct();
});

function loadGallery() {
  const products = JSON.parse(localStorage.getItem("products")) || [];

  // Extract all unique image filenames from seeded data to populate gallery
  const allPossibleImages = [
    ...new Set(
      allProjectProducts.map((p) => {
        const parts = p.image.split("/");
        return parts[parts.length - 1];
      }),
    ),
  ].sort();

  // Find which images are already being used
  const usedImages = products
    .map((p) => {
      if (p.image.startsWith("data:")) return null; // Ignore base64
      const parts = p.image.split("/");
      return parts[parts.length - 1];
    })
    .filter(Boolean);

  const availableImages = allPossibleImages.filter(
    (img) => !usedImages.includes(img),
  );
  const container = document.getElementById("galleryContainer");

  if (availableImages.length === 0) {
    container.innerHTML =
      '<p class="col-span-full text-gray-500 text-center py-8">All gallery images are in use! Add custom products above.</p>';
    return;
  }

  container.innerHTML = availableImages
    .map(
      (img) => `
          <div 
            onclick="openQuickAddModal('${img}')" 
            class="cursor-pointer overflow-hidden rounded-lg border-2 border-gray-200 hover:border-[#7c3aed] hover:shadow-lg transition group"
          >
            <img src="/gifts/${img}" alt="${img}" class="w-full h-24 object-cover group-hover:scale-110 transition" />
            <div class="text-xs text-gray-600 text-center p-1 truncate">${img}</div>
          </div>
        `,
    )
    .join("");
}

function openQuickAddModal(imageName) {
  currentGalleryImage = imageName;
  document.getElementById("modalImage").src = `/gifts/${imageName}`;
  document.getElementById("modalImageName").textContent = imageName;
  document.getElementById("quickProductName").value = imageName
    .replace(/\.[^/.]+$/, "")
    .replace(/\d+$/, "")
    .trim();
  document.getElementById("quickProductPrice").value = "";
  document.getElementById("quickProductCategory").value = "";
  document.getElementById("quickAddModal").classList.remove("hidden");
}

function closeQuickAddModal() {
  document.getElementById("quickAddModal").classList.add("hidden");
}

function addQuickProduct() {
  const name = document.getElementById("quickProductName").value;
  const price = document.getElementById("quickProductPrice").value;
  const category = document.getElementById("quickProductCategory").value;

  if (!name || !price || !category) {
    alert("Please fill all fields");
    return;
  }

  // Create new product object (using relative path consistent with products.js)
  const newProduct = {
    id: Date.now(),
    name: name,
    price: parseInt(price),
    category: category,
    image: `/gifts/${currentGalleryImage}`,
    description: `${name} - Premium ${category} gift.`,
    dateAdded: new Date().toLocaleDateString(),
  };

  if (saveProduct(newProduct)) {
    closeQuickAddModal();
    loadGallery();
    loadProducts();
    alert("Product added successfully!");
  }
}

function addProduct() {
  const name = document.getElementById("productName").value;
  const price = document.getElementById("productPrice").value;
  const category = document.getElementById("productCategory").value;
  const imageFile = document.getElementById("productImage").files[0];

  if (!name || !price || !category || !imageFile) {
    alert("Please fill all fields and select an image");
    return;
  }

  // Convert image to base64
  const reader = new FileReader();
  reader.onload = function (e) {
    const imageBase64 = e.target.result;

    const newProduct = {
      id: Date.now(),
      name: name,
      price: parseInt(price),
      category: category,
      image: imageBase64,
      description: `${name} - Custom ${category} gift.`,
      dateAdded: new Date().toLocaleDateString(),
    };

    if (saveProduct(newProduct)) {
      document.getElementById("productForm").reset();
      document.getElementById("previewImg").classList.add("hidden");
      loadProducts();
      alert("Custom product added successfully!");
    }
  };
  reader.readAsDataURL(imageFile);
}

function loadProducts() {
  const products = JSON.parse(localStorage.getItem("products")) || [];
  const productsList = document.getElementById("productsList");

  if (products.length === 0) {
    productsList.innerHTML =
      '<p class="col-span-full text-gray-500 text-center py-8">No products found</p>';
    return;
  }

  // Only show products in reverse order (newest first)
  const displayProducts = [...products].reverse();

  productsList.innerHTML = displayProducts
    .map((product) => {
      let imgPath = product.image;
      if (!imgPath.startsWith("data:") && !imgPath.startsWith("http")) {
        imgPath = "../" + imgPath;
      }

      return `
            <div class="bg-gray-50 rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition">
              <img src="${imgPath}" alt="${product.name}" class="w-full h-40 object-cover" />
              <div class="p-4">
                <div class="flex justify-between items-start mb-1">
                  <h3 class="font-semibold text-gray-800 truncate flex-1">${product.name}</h3>
                  ${product.isSeeded ? '<span class="text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded">Seeded</span>' : ""}
                </div>
                <p class="text-sm text-gray-500 mb-2">Category: <span class="font-medium text-[#7c3aed]">${product.category}</span></p>
                <div class="flex justify-between items-center mb-3">
                  <p class="text-lg font-bold text-green-600">₹${product.price}</p>
                  <p class="text-[10px] text-gray-400">Added: ${product.dateAdded}</p>
                </div>
                <button 
                  onclick="deleteProduct(${product.id})" 
                  class="w-full px-3 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          `;
    })
    .join("");
}

function deleteProduct(productId) {
  if (confirm("Are you sure you want to delete this product?")) {
    let products = JSON.parse(localStorage.getItem("products")) || [];
    products = products.filter((p) => p.id !== productId);
    localStorage.setItem("products", JSON.stringify(products));
    loadProducts();
    loadGallery();
    alert("Product deleted successfully!");
  }
}

function previewImage() {
  const imageFile = document.getElementById("productImage").files[0];
  if (!imageFile) {
    alert("Please select an image first");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const previewImg = document.getElementById("previewImg");
    previewImg.src = e.target.result;
    previewImg.classList.remove("hidden");
  };
  reader.readAsDataURL(imageFile);
}

// Close modal when clicking outside
document
  .getElementById("quickAddModal")
  .addEventListener("click", function (e) {
    if (e.target === this) {
      closeQuickAddModal();
    }
  });

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
        ? p.image.substring(1)
        : p.image.startsWith("./")
          ? p.image.substring(2)
          : p.image,
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
  const pathPrefix = isSubPage ? "../" : "";

  const productHTML = categoryProducts
    .map((product) => {
      // Process image path to work from current page depth
      let imgPath = product.image;
      // If it's a relative path from root, add prefix
      if (!imgPath.startsWith("http") && !imgPath.startsWith("data:")) {
        imgPath = pathPrefix + imgPath;
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
