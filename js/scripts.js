
const products = [
  { id: 1, name: "Tomatoes", category: "Vegetables", price: 1.99, image: "images/tomatoes.jpg" },
  { id: 2, name: "Spinach", category: "Leafy Greens", price: 2.5, image: "images/spinach.jpg" },
  { id: 3, name: "Carrots", category: "Vegetables", price: 1.75, image: "images/carrots.jpg" },
  { id: 4, name: "Kale", category: "Leafy Greens", price: 2.0, image: "images/kale.jpg" }
];

function loadProducts() {
  const container = document.getElementById("product-list");
  const filter = document.getElementById("category-filter");
  if (!container) return;
  const selectedCategory = filter ? filter.value : "";
  const filteredProducts = selectedCategory ? products.filter(p => p.category === selectedCategory) : products;
  container.innerHTML = filteredProducts.map(product => `
    <div class="col-md-3 mb-4">
      <div class="card h-100">
        <img src="${product.image}" class="card-img-top" alt="${product.name}">
        <div class="card-body">
          <h5 class="card-title">${product.name}</h5>
          <p class="card-text">${product.price.toFixed(2)} USD</p>
          <button class="btn btn-success" onclick="addToCart(${product.id})">Add to Cart</button>
        </div>
      </div>
    </div>
  `).join('');
}

function addToCart(productId) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const item = products.find(p => p.id === productId);
  const index = cart.findIndex(p => p.id === productId);
  if (index > -1) cart[index].qty += 1;
  else cart.push({ ...item, qty: 1 });
  localStorage.setItem("cart", JSON.stringify(cart));
  alert(item.name + " added to cart!");
  loadCart();
}

function removeFromCart(productId) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart = cart.filter(p => p.id !== productId);
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
}

function updateQuantity(productId, delta) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const index = cart.findIndex(p => p.id === productId);
  if (index > -1) {
    cart[index].qty += delta;
    if (cart[index].qty < 1) cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
  }
}

function loadCart() {
  const cartItems = document.getElementById("cart-items");
  if (!cartItems) return;
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  let total = 0;
  cartItems.innerHTML = cart.map(item => {
    const subtotal = item.price * item.qty;
    total += subtotal;
    return `
      <li class="list-group-item d-flex justify-content-between align-items-center">
        ${item.name}
        <div>
          <button class="btn btn-sm btn-secondary" onclick="updateQuantity(${item.id}, -1)">-</button>
          <span class="mx-2">${item.qty}</span>
          <button class="btn btn-sm btn-secondary" onclick="updateQuantity(${item.id}, 1)">+</button>
          <button class="btn btn-sm btn-danger ms-2" onclick="removeFromCart(${item.id})">Remove</button>
        </div>
      </li>`;
  }).join('');
  cartItems.innerHTML += `<li class="list-group-item d-flex justify-content-between"><strong>Total</strong><strong>${total.toFixed(2)} USD</strong></li>`;
}

document.addEventListener("DOMContentLoaded", () => {
  loadProducts();
  loadCart();
  const filter = document.getElementById("category-filter");
  if (filter) filter.addEventListener("change", loadProducts);
});
