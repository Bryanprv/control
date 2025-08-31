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