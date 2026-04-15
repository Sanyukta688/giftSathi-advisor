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
            if (!sidebar.contains(event.target) && !openBtn.contains(event.target) && !sidebar.classList.contains("-translate-x-full")) {
                sidebar.classList.add("-translate-x-full");
            }
        });

        // ===== DROPDOWN TOGGLES =====
        function toggleCategories() {
            document.getElementById("categoriesMenu").classList.toggle("hidden");
            document.getElementById("catArrow").textContent =
                document.getElementById("categoriesMenu").classList.contains("hidden") ? ">" : "v";
        }

        function toggleGifts() {
            document.getElementById("giftsMenu").classList.toggle("hidden");
            document.getElementById("giftsArrow").textContent =
                document.getElementById("giftsMenu").classList.contains("hidden") ? ">" : "v";
        }

        // ===== CART FUNCTIONALITY =====
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

        function addToCart(item) {
            cart.push(item);
            localStorage.setItem("cart", JSON.stringify(cart));
            updateCartCount();
            alert(item + " added to cart ✅");
        }

        function addToWishlist(item) {
            wishlist.push(item);
            localStorage.setItem("wishlist", JSON.stringify(wishlist));
            updateWishlistCount();
            alert(item + " added to wishlist ❤️");
        }

        function updateCartCount() {
            document.getElementById("cartCount").innerText = cart.length;
        }

        function updateWishlistCount() {
            document.getElementById("wishlistCount").innerText = wishlist.length;
        }

        // Initialize counts
        updateCartCount();
        updateWishlistCount();

        // ===== CATEGORY JUMP =====
        function jumpToCategory(category) {
            console.log("Jumping to " + category + " category");
            // You can add navigation logic here later
        }

        // ===== SEARCH FUNCTIONALITY =====
        function searchGift() {
            const searchInput = document.getElementById("searchInput").value;
            if (searchInput.trim() === "") {
                alert("Please enter a search term");
                return;
            }
            console.log("Searching for: " + searchInput);
            // Add your search logic here
        }

        // Allow Enter key to search
        document.getElementById("searchInput")?.addEventListener("keypress", function (event) {
            if (event.key === "Enter") {
                searchGift();
            }
        });