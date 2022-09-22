const items = document.getElementById("cart__items");
const totalPrice = document.getElementById("totalPrice");
let deleteButton = document.getElementsByClassName("deleteItem");
let localStorageData = JSON.parse(localStorage.getItem("product"));

let prix = 0;



// Tri des produits par Id
localStorageData.sort(compare = (a, b) => {
    if (a.id < b.id)
        return -1;
    if (a.id > b.id)
        return 1;
    return 0;
});


console.log(localStorageData);

for (let i = 0 ; i < localStorageData.length ; i++ ) {
    fetch(`http://localhost:3000/api/products/${localStorageData[i].id}`)
        .then((res) => res.json())
        .then((value) => {
            productData = value;
            

            // Création balise article
            const productArticle = document.createElement("article");
            productArticle.setAttribute("class", "cart__item");
            productArticle.setAttribute("data-id", `${productData._id}`);
            productArticle.setAttribute("id", i);
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
            productQuantityInput.setAttribute("type", "number");
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


            productDelete.addEventListener("click", (e) => {
                console.log(i);
                console.log(localStorageData);
                const number = document.getElementById(i);
                number.remove();
                localStorageData.splice([i], 1);
                localStorage.removeItem("product");
                const articles = document.getElementsByClassName(`cart__item`);
                console.log(articles);
                for( let j = 0 ; j < articles.length ; j++ ) {
                    articles[j].setAttribute("id", j);
                };
                
                localStorage.setItem("product", JSON.stringify(localStorageData));
                // alert("Produit supprimé du panier");
                // window.location.href = "cart.html";
                
            });
            total();

        })
        .catch((err) => {
            console.log("err");
        })
};



// Calcule le prix total et la quantité totale
total = () => {
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
    validFirstName(e.target.value);
    contact.firstName = e.target.value;
});

validFirstName = (firstName) => {
    let valid = false;
    let testName = firstNameRegex.test(firstName);
    if (testName) {
        firstNameErrorMsg.textContent = "";
        valid = true;
    } else {
        firstNameErrorMsg.textContent = "Prénom non valide";
        valid = false;
    }
    return valid;
}

lastName.addEventListener("input", (e) => {
    validLastName(e.target.value);
    contact.lastName = e.target.value;
});

validLastName = (lastName) => {
    let valid = false;
    let testLastName = lastNameRegex.test(lastName);
    if (testLastName) {
        lastNameErrorMsg.innerText = "";
        valid = true;
    } else {
        lastNameErrorMsg.textContent = "Nom non valide";
        valid = false;
    }
    return valid;
}


address.addEventListener("input", (e) => {
    validAddress(e.target.value);
    contact.address = e.target.value;
});

validAddress = (address) => {
    let valid = false;
    let testAddress = addressRegex.test(address);
    if (testAddress) {
        addressErrorMsg.textContent = "";
        valid = true;
    } else {
        addressErrorMsg.textContent = "Adresse non valide";
        valid = false;
    }
    return valid;
}


city.addEventListener("input", (e) => {
    validCity(e.target.value);
    contact.city = e.target.value;
});

validCity = (city) => {
    let valid = false;
    let testCity = cityRegex.test(city);
    if (testCity) {
        cityErrorMsg.textContent = "";
        valid = true;
    } else {
        cityErrorMsg.textContent = "Ville non valide";
        valid = false;
    }
    return valid;
}


email.addEventListener("input", (e) => {
    validEmail(e.target.value);
    contact.email = e.target.value;
});

validEmail = (email) => {
    let valid = false;
    let testEmail = emailRegex.test(email);
    if (testEmail) {
        emailErrorMsg.textContent = "";
        valid = true;
    } else {
        emailErrorMsg.textContent = "Email non valide";
        valid = false;
    }
    return valid;
}
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

        localStorage.setItem("contact", JSON.stringify(contact));


        for (let i of localStorageData) {
            products.push(i.id)
        };

        let order = {
            contact: contact,
            products: products,
        };


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
