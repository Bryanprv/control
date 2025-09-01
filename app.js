const productList = document.getElementById("product-list");

// Lee productos desde productos.json y muestra por categoría
let productosData = [];

function cargarProductosJSON() {
  fetch('productos.json')
    .then(res => res.json())
    .then(data => {
      productosData = data;
      poblarCategorias();
      mostrarProductos();
    });
}

function poblarCategorias() {
  const categoryFilter = document.getElementById('category-filter');
  // Limpiar opciones previas excepto la primera
  while (categoryFilter.options.length > 1) categoryFilter.remove(1);
  const categories = [...new Set(productosData.map(p => p.categoria).filter(Boolean))];
  categories.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    categoryFilter.appendChild(opt);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('category-filter').addEventListener('change', function() {
    mostrarProductos(this.value);
  });
  cargarProductosJSON();
});

function mostrarProductos(categoria) {
  const productList = document.getElementById('product-list');
  productList.innerHTML = '';
  let productosFiltrados = productosData;
  if (categoria) {
    productosFiltrados = productosData.filter(p => p.categoria === categoria);
  }
  productosFiltrados.forEach((data, index) => {
    const div = document.createElement('div');
    div.className = 'product';
    div.innerHTML = `
      <h3>${data.nombre}</h3>
      <p>${data.descripcion}</p>
      <strong>$${data.precio}</strong>
      <div style="margin-top:0.5rem;color:#6366f1;font-size:0.95rem;">${data.categoria ? data.categoria : ''}</div>
      <button class="add-to-cart-btn" data-index="${index}">Añadir al Carrito</button>
    `;
    productList.appendChild(div);
  });

  // Añadir listeners a los botones
  document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      const productIndex = e.target.dataset.index;
      addToCart(productosData[productIndex]);
    });
  });
}

let cart = [];

function addToCart(product) {
  const existingProduct = cart.find(item => item.nombre === product.nombre);
  if (existingProduct) {
    existingProduct.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  updateCart();
}

function updateCart() {
  const cartItemsContainer = document.getElementById('cart-items');
  const cartCounter = document.getElementById('cart-counter');
  const cartTotal = document.getElementById('cart-total');
  
  cartItemsContainer.innerHTML = '';
  let total = 0;
  let totalItems = 0;

  cart.forEach(item => {
    const itemElement = document.createElement('div');
    itemElement.className = 'cart-item';
    itemElement.innerHTML = `
      <div class="cart-item-info">
        <h4>${item.nombre}</h4>
        <p>$${item.precio} x ${item.quantity}</p>
      </div>
      <div class="cart-item-actions">
        <button class="quantity-change" data-name="${item.nombre}" data-change="-1">-</button>
        <span>${item.quantity}</span>
        <button class="quantity-change" data-name="${item.nombre}" data-change="1">+</button>
      </div>
    `;
    cartItemsContainer.appendChild(itemElement);
    total += item.precio * item.quantity;
    totalItems += item.quantity;
  });

  cartTotal.textContent = total.toFixed(2);
  cartCounter.textContent = totalItems;

  document.querySelectorAll('.quantity-change').forEach(button => {
    button.addEventListener('click', (e) => {
      const productName = e.target.dataset.name;
      const change = parseInt(e.target.dataset.change);
      changeQuantity(productName, change);
    });
  });
}

function changeQuantity(productName, change) {
  const productInCart = cart.find(item => item.nombre === productName);
  if (productInCart) {
    productInCart.quantity += change;
    if (productInCart.quantity <= 0) {
      cart = cart.filter(item => item.nombre !== productName);
    }
    updateCart();
  }
}

document.getElementById('cart-icon-container').addEventListener('click', () => {
  document.getElementById('cart-sidebar').classList.add('visible');
  document.getElementById('cart-overlay').classList.remove('hidden');
});

document.getElementById('cart-overlay').addEventListener('click', () => {
  document.getElementById('cart-sidebar').classList.remove('visible');
  document.getElementById('cart-overlay').classList.add('hidden');
});

document.getElementById('clear-cart').addEventListener('click', () => {
  cart = [];
  updateCart();
});