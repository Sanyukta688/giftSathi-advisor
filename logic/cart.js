const CartManager = {
  // Reusable function to fix image paths for deployment compatibility
  fixImagePath: function (path) {
    if (!path) return "/gifts/Logo.png";
    if (path.startsWith("http") || path.startsWith("data:")) return path;
    return path.startsWith("/")
      ? path
      : "/" + path.replace(/^(\.\.\/|\.\/)+/, "");
  },
  // Get cart from localStorage
  getCart: function () {
    return JSON.parse(localStorage.getItem("cart")) || [];
  },

  // Save cart to localStorage
  saveCart: function (cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  },

  // Add product to cart
  addToCart: function (product, quantity = 1) {
    let cart = this.getCart();

    // Support either product object or just name/price
    let productToId =
      product.id ||
      `${product.name}-${product.price}-${product.category || "Gift"}`.replace(
        /\s+/g,
        "-",
      );

    const existingItem = cart.find((item) => item.id == productToId);

    if (existingItem) {
      existingItem.quantity += parseInt(quantity);
    } else {
      cart.push({
        id: productToId,
        name: product.name,
        price: parseInt(product.price),
        image: this.fixImagePath(product.image) || "/gifts/Logo.png",
        quantity: parseInt(quantity),
        category: product.category || "Gift",
      });
    }

    this.saveCart(cart);
    return true;
  },

  // Remove from cart
  removeFromCart: function (productId) {
    let cart = this.getCart();
    cart = cart.filter((item) => item.id != productId);
    this.saveCart(cart);
  },

  // Update quantity
  updateQuantity: function (productId, change) {
    let cart = this.getCart();
    const item = cart.find((item) => item.id == productId);

    if (item) {
      item.quantity += change;
      if (item.quantity <= 0) {
        return this.removeFromCart(productId);
      }
      this.saveCart(cart);
    }
  },

  // Get totals
  getTotals: function () {
    const cart = this.getCart();
    return cart.reduce(
      (acc, item) => ({
        totalItems: acc.totalItems + item.quantity,
        totalAmount: acc.totalAmount + item.price * item.quantity,
      }),
      { totalItems: 0, totalAmount: 0 },
    );
  },

  // Clear cart
  clearCart: function () {
    localStorage.removeItem("cart");
  },
};

// Global helper for simple 'Add to Cart' buttons in HTML
function quickAddToCart(name, price, image = "", category = "Gift") {
  // Fix image path automatically
  if (image && !image.startsWith("/")) {
    image = "/" + image.replace(/^(\.\.\/|\.\/)+/, "");
  }

  const product = { name, price, image, category };
  CartManager.addToCart(product);
  alert(`${name} added to cart!`);
}
