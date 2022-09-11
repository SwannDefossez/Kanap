const items = document.getElementById("cart__items");
const totalPrice = document.getElementById("totalPrice");
let deleteButton = document.getElementsByClassName("deleteItem");
let prix = 0;

let localStorageData = JSON.parse(localStorage.getItem("product"));


localStorageData.sort(function compare(a, b) {
    if (a.id < b.id)
        return -1;
    if (a.id > b.id)
        return 1;
    return 0;
});




for (let i in localStorageData) {
    fetch(`http://localhost:3000/api/products/${localStorageData[i].id}`)
        .then((res) => res.json())
        .then((value) => {
            productData = value;
            // Création balise article
            const productArticle = document.createElement("article");
            productArticle.setAttribute("class", "cart__item");
            productArticle.setAttribute("data-id", `${productData._id}`);
            productArticle.setAttribute("data-color", `${productData.colors}`);
            items.appendChild(productArticle);


            // Création balise div image
            const productDivImage = document.createElement("div");
            productDivImage.setAttribute("class", "cart__item__img");
            productArticle.appendChild(productDivImage);

            // Création Image

            const productImg = document.createElement("img");
            productImg.setAttribute("src", `${productData.imageUrl}`);
            productImg.setAttribute("alt", `${productData.imageAlt}`);
            productDivImage.appendChild(productImg);

            // Création balise div ItemContent
            const ItemContent = document.createElement("div");
            ItemContent.setAttribute("class", "cart__item__content");
            productArticle.appendChild(ItemContent);

            // Création balise div ItemContentDescription
            const ItemContentDescription = document.createElement("div");
            ItemContentDescription.setAttribute("class", "cart__item__content__description");
            ItemContent.appendChild(ItemContentDescription);

            // Création <h2> nom du produit
            const productName = document.createElement("h2");
            productName.textContent = `${productData.name}`;
            ItemContentDescription.appendChild(productName);

            // Création <p> couleur
            const productColors = document.createElement("p");
            productColors.textContent = `${localStorageData[i].colors}`;
            ItemContentDescription.appendChild(productColors);

            // Création <p> prix
            const productPrice = document.createElement("p");
            prix = localStorageData[i].quantity * productData.price;
            productPrice.textContent = prix + "€";
            ItemContentDescription.appendChild(productPrice);


            // Création balise div ItemContentSettings
            const ItemContentSettings = document.createElement("div");
            ItemContentSettings.setAttribute("class", "cart__item__content__settings");
            ItemContent.appendChild(ItemContentSettings);

            // Création balise div ItemContentSettingsQuantity
            const ItemContentSettingsQuantity = document.createElement("div");
            ItemContentSettingsQuantity.setAttribute("class", "cart__item__content__settings__quantity");
            ItemContentSettings.appendChild(ItemContentSettingsQuantity);


            // Création <p> quantité
            const productQuantity = document.createElement("p");
            productQuantity.textContent = "Quantité : " + localStorageData[i].quantity;
            ItemContentSettingsQuantity.appendChild(productQuantity);


            // Création <input>
            const productQuantityInput = document.createElement("input");
            productQuantityInput.setAttribute("type", "number")
            productQuantityInput.setAttribute("class", "itemQuantity");
            productQuantityInput.setAttribute("name", "itemQuantity")
            productQuantityInput.setAttribute("min", "1");
            productQuantityInput.setAttribute("max", "100");
            productQuantityInput.setAttribute("value", `${localStorageData[i].quantity}`);
            ItemContentSettingsQuantity.appendChild(productQuantityInput);
            productQuantityInput.addEventListener("change", (e) => {
                if (productQuantityInput.value > 0 && productQuantityInput.value < 101 && productQuantityInput.value % 1 == 0) {
                    localStorageData[i].quantity = e.target.value;
                    localStorage.setItem("product", JSON.stringify(localStorageData));
                    localStorageData = JSON.parse(localStorage.getItem("product"));
                    prix = localStorageData[i].quantity * productData.price;
                    productPrice.textContent = prix + "€";
                    productQuantity.textContent = "Quantité : " + localStorageData[i].quantity;
                    total()
                } else {
                    productQuantityInput.value = localStorageData[i].quantity;
                }
                productQuantity.textContent = "Quantité : " + e.target.value;
            });

            // Création balise div ItemContentSettingsDelete
            const ItemContentSettingsDelete = document.createElement("div");
            ItemContentSettingsDelete.setAttribute("class", "cart__item__content__settings__delete");
            ItemContentSettings.appendChild(ItemContentSettingsDelete);

            // Création <p> delete
            const productDelete = document.createElement("p");
            productDelete.textContent = "Supprimer";
            productDelete.setAttribute("class", "deleteItem");
            ItemContentSettingsDelete.appendChild(productDelete);





            productDelete.addEventListener("click", function (e) {
                console.log(localStorageData[i]);
                localStorageData.splice([i], 1);
                localStorage.removeItem("product");
                localStorage.setItem("product", JSON.stringify(localStorageData));
                alert("Produit supprimé du panier");
                window.location.href = "cart.html";
            });


            total();

        })
        .catch(function (err) {
            console.log("err");
        })
}



function total() {
    let totalQuantity = document.getElementById("totalQuantity");
    let number = 0;
    let total = 0;
    for (let i of localStorageData) {
        total += i.quantity * productData.price;
        number += JSON.parse(i.quantity);
    }
    totalQuantity.textContent = number;
    totalPrice.textContent = total;
    return { localStorageData, prix };
};




