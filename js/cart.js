const CART_KEY = "storefront-cart";

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch (e) {}
}

function addToCart(productId) {
  const cart = getCart();
  const existing = cart.find(function(item) { return item.id === productId; });
  if (existing) {
    existing.qty += 1;
  } else {
    const product = PRODUCTS.find(function(p) { return p.id === productId; });
    cart.push({ id: product.id, name: product.name, price: product.price, qty: 1 });
  }
  saveCart(cart);
}

function updateQty(productId, delta) {
  let cart = getCart();
  cart = cart.map(function(item) {
    if (item.id === productId) item.qty = Math.max(1, item.qty + delta);
    return item;
  });
  saveCart(cart);
}

function removeFromCart(productId) {
  const cart = getCart().filter(function(item) { return item.id !== productId; });
  saveCart(cart);
}

function getCartTotal() {
  return getCart().reduce(function(sum, item) { return sum + item.price * item.qty; }, 0);
}

function getCartCount() {
  return getCart().reduce(function(sum, item) { return sum + item.qty; }, 0);
}

function clearCart() {
  saveCart([]);
}
