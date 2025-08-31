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
    const div = document.createElement('div');
    div.className = 'product';
    div.innerHTML = `
      <h3>${data.nombre}</h3>
      <p>${data.descripcion}</p>
      <strong>$${data.precio}</strong>
      <div style="margin-top:0.5rem;color:#6366f1;font-size:0.95rem;">${data.categoria ? data.categoria : ''}</div>
    `;
    productList.appendChild(div);
  });
}