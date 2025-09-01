document.addEventListener('DOMContentLoaded', () => {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const cartItemsContainer = document.getElementById('cart-page-items');
  const cartTotal = document.getElementById('cart-page-total');
  const whatsappBtn = document.getElementById('whatsapp-cart-page');

  function updateCartCounter() {
    const cartCounter = document.getElementById('cart-counter');
    if (cartCounter) {
      const cartArr = JSON.parse(localStorage.getItem('cart')) || [];
      const totalItems = cartArr.reduce((sum, item) => sum + (item.quantity || 0), 0);
      cartCounter.textContent = totalItems;
    }
  }

  // Icono del carrito redirige a cart.html
  const cartIcon = document.getElementById('cart-icon-container');
  if (cartIcon) {
    cartIcon.addEventListener('click', () => {
      window.location.href = 'cart.html';
    });
  }

  function renderCart() {
    cartItemsContainer.innerHTML = '';
    let total = 0;
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = '<p>Tu carrito está vacío.</p>';
      cartTotal.textContent = 'Total: $0.00';
      whatsappBtn.style.display = 'none';
      updateCartCounter();
      return;
    }
    whatsappBtn.style.display = 'inline-block';
    cart.forEach(item => {
      const itemDiv = document.createElement('div');
      itemDiv.className = 'cart-item';
      itemDiv.innerHTML = `
        <img src="${item.imagen}" alt="${item.nombre}" class="cart-item-thumb" style="width:48px;height:48px;object-fit:cover;border-radius:8px;margin-right:12px;">
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
      cartItemsContainer.appendChild(itemDiv);
      total += item.precio * item.quantity;
    });
    cartTotal.textContent = `Total: $${total.toFixed(2)}`;
    document.querySelectorAll('.quantity-change').forEach(button => {
      button.addEventListener('click', (e) => {
        const productId = parseInt(e.target.dataset.id);
        const change = parseInt(e.target.dataset.change);
        changeQuantity(productId, change);
      });
    });
    updateCartCounter();
  }

  function changeQuantity(productId, change) {
    const productInCart = cart.find(item => item.id === productId);
    if (productInCart) {
      productInCart.quantity += change;
      if (productInCart.quantity <= 0) {
        cart = cart.filter(item => item.id !== productId);
      }
      localStorage.setItem('cart', JSON.stringify(cart));
      renderCart();
    }
  }

  whatsappBtn.addEventListener('click', function(e) {
    e.preventDefault();
    if (cart.length === 0) {
      alert('El carrito está vacío.');
      return;
    }
    let mensaje = '¡Hola! Quiero hacer un pedido:%0A';
    cart.forEach(item => {
      mensaje += `- ${item.nombre} x${item.quantity} ($${item.precio})%0A`;
    });
    mensaje += `Total: $${cart.reduce((acc, item) => acc + item.precio * item.quantity, 0).toFixed(2)}`;
    const telefono = '521XXXXXXXXXX'; // Reemplaza por tu número de WhatsApp
    const url = `https://wa.me/${telefono}?text=${mensaje}`;
    window.open(url, '_blank');
  });

  renderCart();
  updateCartCounter();
});
