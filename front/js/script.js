const items = document.querySelector("#items");

// requête GET à l'API
fetch("http://localhost:3000/api/products")
  .then((res) => {
    if (res.ok) {
      return res.json();
    }
  })
  .then((value) => {
    console.table(value);

    // Boucle qui se répète pour chaque canapé dans la BDD
    for (let i of value) {

      // Création balise a
      const productLink = document.createElement("a");
      productLink.setAttribute("href", `./product.html?id=${i._id}`);
      productLink.setAttribute("class","productLink")
      items.appendChild(productLink);

      // Création balise article
      const productArticle = document.createElement("article");
      productArticle.setAttribute("class","productArticle");
      productLink.appendChild(productArticle);

      // Création balise img
      const productImg = document.createElement("img");
      productImg.setAttribute("src",i.imageUrl);
      productImg.setAttribute("alt",i.altTxt);
      productArticle.appendChild(productImg);

      // Création balise h3 (Nom du canapé)
      const productName = document.createElement("h3");
      productName.classList.add("productName");
      productName.textContent = i.name;
      productArticle.appendChild(productName);

      // Création balise p (Description)
      const productDesc = document.createElement("p");
      productDesc.classList.add("productDescription");
      productDesc.textContent = i.description;
      productArticle.appendChild(productDesc);

    };
  })
  .catch((err) => {
    console.log("err");
  });