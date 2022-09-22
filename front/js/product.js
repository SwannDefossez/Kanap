
//  Récupération de l'id depuis l'url
const urlSearch = window.location.search;
const urlSearchParams = new URLSearchParams(urlSearch);
const id = urlSearchParams.get("id");
console.log(id);

// Constantes qui serviront à ajouter des éléments HTML
const button = document.querySelector("#addToCart");
const img = document.querySelector(".item__img");
const price = document.querySelector("#price");
const title = document.querySelector("#title");
const desc = document.querySelector("#description");
const colors = document.querySelector("#colors");

// Objet vide qui servira pour le localStorage
const productValue = {
  id: "",
  colors: "",
  quantity: "",
}

// Requet GET à l'API
fetch(`http://localhost:3000/api/products/${id}`)
  .then((res) => res.json())
  .then((value) => {
    productData = value;
    document.title = productData.name;

    // Creation de l'image
    const productImg = document.createElement("img");
    productImg.setAttribute("src", `${productData.imageUrl}`);
    productImg.setAttribute("alt", `${productData.altTxt}`);
    img.appendChild(productImg);

    // Modification du texte en fonction du canapé
    title.textContent = `${productData.name}`;
    price.textContent = `${productData.price}`;
    desc.textContent = `${productData.description}`;

    // Boucle pour créer toutes les options de couleurs
    for (let i = 0; i < productData.colors.length; i++) {
      const productColors = document.createElement("option");
      productColors.setAttribute("value", `${productData.colors[i]}`);
      productColors.textContent = `${productData.colors[i]}`;
      colors.appendChild(productColors);
    }

    // ajouts des données dans l'objet
    productValue.id = productData._id;
    document.getElementById('colors').addEventListener("change", function () {
      console.log('Couleur: ', this.value);
      productValue.colors = this.value;
    });


  })
  .catch(function (err) {
    console.log("err");
  });



// fonction pour bloquer la quantité au minimum/maximum
function quantityFix() {
  if (this.value > 0 && this.value < 101 && this.value % 1 == 0) {
    productValue.quantity = this.value;
    console.log(productValue);
  } else {
    this.value = 1;
  }
  let value = this.value;
  return value;
};
document.getElementById("quantity").addEventListener("change", quantityFix);



// fonction pour ajouter l'objet dans le localStorage
button.addEventListener("click", () => {
  if (productValue.colors == "" || productValue.quantity == "") {
    alert("Veuillez choisir une couleur/quantité");

  } else {
    let oldData = JSON.parse(localStorage.getItem("product"));
    if (oldData == null) {
      oldData = [];
    }
    let getArticle = oldData.find((product) => product.id == productValue.id && product.colors == productValue.colors);
    if (getArticle) {
      getArticle.quantity = Number(productValue.quantity) + Number(getArticle.quantity);
      localStorage.setItem("product", JSON.stringify(oldData));
      window.confirm(`Quantité ajouté : ${productValue.quantity}`);
    } else {
      oldData.push(productValue);
      localStorage.setItem("product", JSON.stringify(oldData));
      window.confirm(`Vous avez ajouté : ${productValue.quantity} canapé(s) de couleur : ${productValue.colors} `);
    }
  };
});
