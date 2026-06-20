const productGrid = document.getElementById("productGrid");
const filtersEl = document.getElementById("filters");
const searchInput = document.getElementById("searchInput");
const cartCountEl = document.getElementById("cartCount");
const cartItemsEl = document.getElementById("cartItems");
const cartTotalEl = document.getElementById("cartTotal");
const cartDrawer = document.getElementById("cartDrawer");
const overlay = document.getElementById("overlay");

let activeCategory = "All";

function renderFilters() {
  const categories = ["All", ...new Set(PRODUCTS.map(p => p.category))];
  filtersEl.innerHTML = categories.map(cat =>
    `<button class="filter-btn ${cat === activeCategory ? "active" : ""}" data-cat="${cat}">${cat}</button>`
  ).join("");

  filtersEl.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      activeCategory = btn.dataset.cat;
      renderFilters();
      renderProducts();
    });
  });
}

function renderProducts() {
  const query = searchInput.value.trim().toLowerCase();
  const filtered = PRODUCTS.filter(p => {
    const matchesCategory = activeCategory === "All" || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  productGrid.innerHTML = filtered.map(p => `
    <div class="product-card">
      <img src="${p.img}" alt="${p.name}" onerror="this.style.background='#eee'" />
      <h3>${p.name}</h3>
      <div class="price">₹${p.price}</div>
      <button class="add-btn" data-id="${p.id}">Add to Cart</button>
    </div>
  `).join("");

  productGrid.querySelectorAll(".add-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      addToCart(Number(btn.dataset.id));
      renderCart();
    });
  });
}

function renderCart() {
  const cart = getCart();
  cartCountEl.textContent = getCartCount();
  cartTotalEl.textContent = `₹${getCartTotal()}`;

  if (cart.length === 0) {
    cartItemsEl.innerHTML = `<p style="font-size:13px;color:#888;">Your cart is empty.</p>`;
    return;
  }

  cartItemsEl.innerHTML = cart.map(item => `
    <div class="cart-item">
      <span>${item.name} (₹${item.price})</span>
      <div class="qty-controls">
        <button data-action="dec" data-id="${item.id}">-</button>
        <span>${item.qty}</span>
        <button data-action="inc" data-id="${item.id}">+</button>
        <button data-action="remove" data-id="${item.id}">×</button>
      </div>
    </div>
  `).join("");

  cartItemsEl.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      const action = btn.dataset.action;
      if (action === "inc") updateQty(id, 1);
      if (action === "dec") updateQty(id, -1);
      if (action === "remove") removeFromCart(id);
      renderCart();
    });
  });
}

document.getElementById("cartBtn").addEventListener("click", () => {
  cartDrawer.classList.add("open");
  overlay.classList.add("show");
});
document.getElementById("closeCart").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);

function closeCart() {
  cartDrawer.classList.remove("open");
  overlay.classList.remove("show");
}

searchInput.addEventListener("input", renderProducts);

const checkoutModal = document.getElementById("checkoutModal");
const confirmModal = document.getElementById("confirmModal");

document.getElementById("checkoutBtn").addEventListener("click", () => {
  if (getCart().length === 0) return;
  closeCart();
  checkoutModal.classList.add("show");
});
document.getElementById("closeCheckout").addEventListener("click", () => {
  checkoutModal.classList.remove("show");
});

document.getElementById("checkoutForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("custName").value;
  const orderId = "ORD-" + Math.floor(100000 + Math.random() * 900000);

  checkoutModal.classList.remove("show");
  document.getElementById("confirmName").textContent = name;
  document.getElementById("confirmId").textContent = orderId;
  confirmModal.classList.add("show");

  clearCart();
  renderCart();
  document.getElementById("checkoutForm").reset();
});

document.getElementById("closeConfirm").addEventListener("click", () => {
  confirmModal.classList.remove("show");
});

renderFilters();
renderProducts();
renderCart();
