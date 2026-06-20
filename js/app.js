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
  const categories = ["All"].concat(PRODUCTS.map(function(p) { return p.category; }).filter(function(c, i, arr) { return arr.indexOf(c) === i; }));
  filtersEl.innerHTML = categories.map(function(cat) {
    return '<button class="filter-btn ' + (cat === activeCategory ? "active" : "") + '" data-cat="' + cat + '">' + cat + '</button>';
  }).join("");

  const filterButtons = filtersEl.querySelectorAll(".filter-btn");
  filterButtons.forEach(function(btn) {
    btn.addEventListener("click", function() {
      activeCategory = btn.dataset.cat;
      renderFilters();
      renderProducts();
    });
  });
}

function renderProducts() {
  const query = searchInput.value.trim().toLowerCase();
  const filtered = PRODUCTS.filter(function(p) {
    const matchesCategory = activeCategory === "All" || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().indexOf(query) !== -1;
    return matchesCategory && matchesSearch;
  });

  productGrid.innerHTML = filtered.map(function(p) {
    return '<div class="product-card">' +
      '<img src="' + p.img + '" alt="' + p.name + '" onerror="this.style.background=\'#eee\'" />' +
      '<h3>' + p.name + '</h3>' +
      '<div class="price">Rs.' + p.price + '</div>' +
      '<button class="add-btn" data-id="' + p.id + '">Add to Cart</button>' +
      '</div>';
  }).join("");

  const addButtons = productGrid.querySelectorAll(".add-btn");
  addButtons.forEach(function(btn) {
    btn.addEventListener("click", function() {
      addToCart(Number(btn.dataset.id));
      renderCart();
    });
  });
}

function renderCart() {
  const cart = getCart();
  cartCountEl.textContent = getCartCount();
  cartTotalEl.textContent = "Rs." + getCartTotal();

  if (cart.length === 0) {
    cartItemsEl.innerHTML = '<p style="font-size:13px;color:#888;">Your cart is empty.</p>';
    return;
  }

  cartItemsEl.innerHTML = cart.map(function(item) {
    return '<div class="cart-item">' +
      '<span>' + item.name + ' (Rs.' + item.price + ')</span>' +
      '<div class="qty-controls">' +
      '<button data-action="dec" data-id="' + item.id + '">-</button>' +
      '<span>' + item.qty + '</span>' +
      '<button data-action="inc" data-id="' + item.id + '">+</button>' +
      '<button data-action="remove" data-id="' + item.id + '">x</button>' +
      '</div></div>';
  }).join("");

  const cartButtons = cartItemsEl.querySelectorAll("button");
  cartButtons.forEach(function(btn) {
    btn.addEventListener("click", function() {
      const id = Number(btn.dataset.id);
      const action = btn.dataset.action;
      if (action === "inc") updateQty(id, 1);
      if (action === "dec") updateQty(id, -1);
      if (action === "remove") removeFromCart(id);
      renderCart();
    });
  });
}

document.getElementById("cartBtn").addEventListener("click", function() {
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

document.getElementById("checkoutBtn").addEventListener("click", function() {
  if (getCart().length === 0) return;
  closeCart();
  checkoutModal.classList.add("show");
});
document.getElementById("closeCheckout").addEventListener("click", function() {
  checkoutModal.classList.remove("show");
});

document.getElementById("checkoutForm").addEventListener("submit", function(e) {
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

document.getElementById("closeConfirm").addEventListener("click", function() {
  confirmModal.classList.remove("show");
});

renderFilters();
renderProducts();
renderCart();
