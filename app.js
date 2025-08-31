const productList = document.getElementById("product-list");

db.collection("productos").get().then((querySnapshot) => {
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
      <h3>${data.nombre}</h3>
      <p>${data.descripcion}</p>
      <strong>$${data.precio}</strong>
    `;
    productList.appendChild(div);
  });
});

// Módulo para filtrar productos por categoría y exportar lista en JSON

// Filtrar productos por categoría
document.addEventListener('DOMContentLoaded', () => {
  const categoryFilter = document.createElement('select');
  categoryFilter.id = 'category-filter';
  categoryFilter.innerHTML = '<option value="">Todas las categorías</option>';
  document.querySelector('header').appendChild(categoryFilter);

  // Obtener categorías únicas de Firestore
  db.collection('productos').get().then((querySnapshot) => {
    const categories = new Set();
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.categoria) categories.add(data.categoria);
    });
    categories.forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat;
      opt.textContent = cat;
      categoryFilter.appendChild(opt);
    });
  });

  // Evento para filtrar productos
  categoryFilter.addEventListener('change', () => {
    mostrarProductos(categoryFilter.value);
  });

  // Botón para exportar productos a JSON
  const exportBtn = document.createElement('button');
  exportBtn.textContent = 'Exportar productos a JSON';
  exportBtn.id = 'export-json';
  exportBtn.style.marginLeft = '1rem';
  document.querySelector('header').appendChild(exportBtn);

  exportBtn.addEventListener('click', () => {
    db.collection('productos').get().then((querySnapshot) => {
      const productos = [];
      querySnapshot.forEach((doc) => {
        productos.push(doc.data());
      });
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(productos, null, 2));
      const dlAnchor = document.createElement('a');
      dlAnchor.setAttribute('href', dataStr);
      dlAnchor.setAttribute('download', 'productos.json');
      dlAnchor.click();
    });
  });

  // Mostrar todos los productos al cargar
  mostrarProductos();
});

// Función para mostrar productos filtrados por categoría
function mostrarProductos(categoria) {
  const productList = document.getElementById('product-list');
  productList.innerHTML = '';
  let ref = db.collection('productos');
  if (categoria) ref = ref.where('categoria', '==', categoria);
  ref.get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const data = doc.data();
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
  });
}