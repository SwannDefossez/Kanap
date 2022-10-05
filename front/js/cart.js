
// Tri des produits avec l'id
let tri = getProduct();
tri.sort(compare = (a, b) => {
    if (a.id < b.id)
        return -1;
    if (a.id > b.id)
        return 1;
    return 0;
});

const items = document.getElementById("cart__items");

// initialisation des fonctions
const initialisation = async () => {
    const productLS = await getProduct();
    displayProduct(productLS);
    deleteItem(productLS);
    totalQuantity();
    checkProduct();
};
initialisation();

// récuperer le contenu du localStorage
function getProduct() {
    return JSON.parse(localStorage.getItem("product"));
}

console.log(getProduct());

// vérification du localStorage
async function checkProduct() {
    const productLS = await getProduct();
    if (productLS.length == 0) {
        items.textContent = "Il n'y a aucun produit dans le panier";
        return true;
    }
}


// affichage des produits
async function displayProduct(productLS) {
    for (let item of productLS) {
        fetch(`http://localhost:3000/api/products/${item.id}`)
            .then((res) => res.json())
            .then((product) => {

                // Création balise article
                const productArticle = document.createElement("article");
                productArticle.setAttribute("class", "cart__item");
                productArticle.setAttribute("data-id", `${item.id}`);
                productArticle.setAttribute("data-color", `${item.colors}`);
                items.appendChild(productArticle);

                // Création balise div image
                const productDivImage = document.createElement("div");
                productDivImage.setAttribute("class", "cart__item__img");
                productArticle.appendChild(productDivImage);

                // Création Image
                const productImg = document.createElement("img");
                productImg.setAttribute("src", `${product.imageUrl}`);
                productImg.setAttribute("alt", `${product.imageAlt}`);
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
                productName.textContent = `${product.name}`;
                ItemContentDescription.appendChild(productName);

                // Création <p> couleur
                const productColors = document.createElement("p");
                productColors.textContent = `${item.colors}`;
                ItemContentDescription.appendChild(productColors);

                // Création <p> prix
                const productPrice = document.createElement("p");
                productPrice.textContent = `${product.price} €`;
                productPrice.setAttribute("class", "price");
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
                productQuantity.textContent = "Quantité : ";
                ItemContentSettingsQuantity.appendChild(productQuantity);


                // Création <input>
                const productQuantityInput = document.createElement("input");
                productQuantityInput.setAttribute("type", "number");
                productQuantityInput.setAttribute("class", "itemQuantity");
                productQuantityInput.setAttribute("name", "itemQuantity")
                productQuantityInput.setAttribute("min", "1");
                productQuantityInput.setAttribute("max", "100");
                productQuantityInput.setAttribute("value", `${item.quantity}`);
                ItemContentSettingsQuantity.appendChild(productQuantityInput);
                // Création balise div ItemContentSettingsDelete
                const ItemContentSettingsDelete = document.createElement("div");
                ItemContentSettingsDelete.setAttribute("class", "cart__item__content__settings__delete");
                ItemContentSettings.appendChild(ItemContentSettingsDelete);

                // Création <p> delete
                const productDelete = document.createElement("p");
                productDelete.textContent = "Supprimer";
                productDelete.setAttribute("class", "deleteItem");
                ItemContentSettingsDelete.appendChild(productDelete);



                totalPrice();
                totalQuantity();
                changeQuantity(product, productLS);
                deleteItem(product);
                checkProduct();


            })
            .catch((err) => {
                console.log("err");
            })
    };
};


// calcul du prix total
async function totalPrice() {
    let kanap = await getProduct();
    let quantities = document.querySelectorAll(".itemQuantity");
    let prices = document.querySelectorAll(".cart__item__content__description");
    let cartPrice = 0;
    for (let i = 0; i < prices.length; i++) {
        cartPrice +=
            parseInt(prices[i].lastElementChild.textContent) * quantities[i].value;
    }
    document.getElementById("totalPrice").textContent = cartPrice;
    saveProduct(kanap);
};

// calcul de la quantité total
async function totalQuantity() {
    let kanap = await getProduct();
    let total = 0;
    for (const item of kanap) {
        total += parseInt(item.quantity);
    }
    const tQuantity = document.querySelector("#totalQuantity");
    tQuantity.textContent = total;
    saveProduct(kanap);
};

// supprimer un produit
function deleteItem(product) {
    const deleteButtons = document.querySelectorAll(".deleteItem");
    deleteButtons.forEach((btn) => {
        btn.addEventListener("click", async (e) => {
            const target = e.target.closest(".cart__item").dataset.id;
            const color = e.target.closest(".cart__item").dataset.color;
            const deleteItem = e.target.closest(".cart__item");
            let kanap = await getProduct();
            kanap = kanap.filter((item) => {
                return item.id != target || item.colors != color;
            });
            deleteItem.remove();
            saveProduct(kanap);
            totalQuantity();
            totalPrice();
            checkProduct();
        });
    });
};

// sauvegarder dans le localStorage
function saveProduct(product) {
    return localStorage.setItem("product", JSON.stringify(product));
};

// changer la qté depuis le panier
async function changeQuantity(product, productLS) {
    let kanap = await getProduct();
    let inputQuantity = document.querySelectorAll(".itemQuantity");

    inputQuantity.forEach((item) => {
        item.addEventListener("input", (e) => {
            const target = e.target.closest(".cart__item").dataset.id;
            const color = e.target.closest(".cart__item").dataset.color;
            let kanapFind = kanap.find((item) => {
                return item.id == target && item.colors == color;
            });
            kanapFind.quantity = parseInt(e.target.value);
            saveProduct(kanap);
            totalQuantity();
            totalPrice();
        });
    });

}

// objet vide pour sauvegarder les informations clients
let contact = {
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    email: "",
};


let firstName = document.querySelector("#firstName");
let lastName = document.querySelector("#lastName");
let address = document.querySelector("#address");
let email = document.querySelector("#email");
let city = document.querySelector("#city");

let firstNameErrorMsg = document.querySelector("#firstNameErrorMsg");
let lastNameErrorMsg = document.querySelector("#lastNameErrorMsg");
let addressErrorMsg = document.querySelector("#addressErrorMsg");
let emailErrorMsg = document.querySelector("#emailErrorMsg");
let cityErrorMsg = document.querySelector("#cityErrorMsg");

let firstNameRegex = /^[a-z ,.'-]+$/i;
let lastNameRegex = /^[a-z ,.'-]+$/i;
let addressRegex = /^(.){2,50}$/;
let cityRegex = /^[a-zA-Zéèàïêç\-\s]{2,30}$/;
let emailRegex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

let submit = document.querySelector("#order");




firstName.addEventListener("input", (e) => {
    formValidator(firstName.value , firstNameErrorMsg , firstNameRegex , "Prénom Invalide") ;
});

lastName.addEventListener("input", (e) => {
    formValidator(lastName.value ,lastNameErrorMsg ,lastNameRegex , "Nom Invalide") ;
});

address.addEventListener("input", (e) => {
    formValidator(address.value ,addressErrorMsg ,addressRegex , "Adresse Invalide") ;
});

city.addEventListener("input", (e) => {
    formValidator(city.value ,cityErrorMsg ,cityRegex , "Ville Invalide") ;
});

email.addEventListener("input", (e) => {
    formValidator(email.value ,emailErrorMsg ,emailRegex , "Email Invalide") ;
});

// fonction pour tester les champs du formulaire
formValidator = (champ, champError , champRegex , champTextError) => {   
        let test = champRegex.test(champ);
        if (test) {
            champError.textContent = "";
            valid = true;
        } else {
            champError.textContent = champTextError; 
            valid = false;
        }
};



let products = [];

let ordeButton = document.querySelector("#order").addEventListener("click", (e) => {
    e.preventDefault();
    if (
        firstNameRegex.test(firstName.value) == false ||
        lastNameRegex.test(lastName.value) == false ||
        addressRegex.test(address.value) == false ||
        cityRegex.test(city.value) == false ||
        emailRegex.test(email.value) == false
    ) {
        window.alert("Champs remplis de manière incorrect");
    } else if (
        firstName.value === "" ||
        lastName.value === "" ||
        address.value === "" ||
        city.value === "" ||
        email.value === ""
    ) {
        window.alert("Coordonnées invalide");
    } else {


        contact = {
            firstName: firstName.value ,
            lastName: lastName.value,
            address: address.value,
            city: city.value,
            email: email.value,
        };
        

        localStorage.setItem("contact", JSON.stringify(contact));

        let kanap = getProduct();
        for (let i of kanap) {
            products.push(i.id)
        };

        let order = {
            contact: contact,
            products: products,
        };
        console.log(JSON.stringify(order));

        fetch("http://localhost:3000/api/products/order", {
            method: "POST",
            body: JSON.stringify(order),
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then((res) => res.json())
            .then((data) => {

                let orderId = data.orderId;
               
                window.location.assign("confirmation.html?id=" + orderId);

            });

    }
});
