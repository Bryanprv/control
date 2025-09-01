document.addEventListener('DOMContentLoaded', () => {
    const productDetailContainer = document.getElementById('product-detail-container');
    const params = new URLSearchParams(window.location.search);
    const productId = parseInt(params.get('id'));

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCounter();
    }

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

    fetch('productos.json')
        .then(res => res.json())
        .then(products => {
            const product = products.find(p => p.id === productId);

            if (product) {
                productDetailContainer.innerHTML = `
                    <img src="${product.imagen}" alt="${product.nombre}" class="product-detail-image">
                    <div class="product-detail-info">
                        <h2>${product.nombre}</h2>
                        <p>${product.descripcion}</p>
                        <strong class="product-detail-price">$${product.precio}</strong>
                        <button class="add-to-cart-btn" id="add-to-cart-detail">Añadir al Carrito</button>
                    </div>
                `;

                document.getElementById('add-to-cart-detail').addEventListener('click', () => {
                    addToCart(product);
                    alert('¡Producto añadido al carrito!');
                });
            } else {
                productDetailContainer.innerHTML = '<p>Producto no encontrado.</p>';
            }
            updateCartCounter();
        });

    function addToCart(product) {
        const existingProduct = cart.find(item => item.id === product.id);
        if (existingProduct) {
            existingProduct.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        saveCart();
    }

    // Actualizar contador al cargar
    updateCartCounter();
});
