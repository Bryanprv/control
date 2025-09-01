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
  productosFiltrados.forEach(data => {
    const productLink = document.createElement('a');
    productLink.href = `product.html?id=${data.id}`;
    productLink.className = 'product-link';

    const productDiv = document.createElement('div');
    productDiv.className = 'product';
    productDiv.innerHTML = `
      <img src="${data.imagen}" alt="${data.nombre}" style="width:100%; border-radius: 1rem 1rem 0 0;">
      <div class="product-info">
        <h3>${data.nombre}</h3>
        <p>${data.descripcion.substring(0, 50)}...</p>
        <strong>$${data.precio}</strong>
        <div style="margin-top:0.5rem;color:#6366f1;font-size:0.95rem;">${data.categoria ? data.categoria : ''}</div>
      </div>
    `;
    productLink.appendChild(productDiv);
    productList.appendChild(productLink);
  });
}

let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
}

function addToCart(product) {
  const existingProduct = cart.find(item => item.id === product.id);
  if (existingProduct) {
    existingProduct.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  saveCart();
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
        <button class="quantity-change" data-id="${item.id}" data-change="-1">-</button>
        <span>${item.quantity}</span>
        <button class="quantity-change" data-id="${item.id}" data-change="1">+</button>
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
      const productId = parseInt(e.target.dataset.id);
      const change = parseInt(e.target.dataset.change);
      changeQuantity(productId, change);
    });
  });
}

function changeQuantity(productId, change) {
  const productInCart = cart.find(item => item.id === productId);
  if (productInCart) {
    productInCart.quantity += change;
    if (productInCart.quantity <= 0) {
      cart = cart.filter(item => item.id !== productId);
    }
    saveCart();
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
  saveCart();
});

// Cargar el carrito al iniciar
updateCart();