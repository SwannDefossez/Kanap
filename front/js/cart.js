
let tri = getProductLS();

tri.sort(compare = (a, b) => {
    if (a.id < b.id)
        return -1;
    if (a.id > b.id)
        return 1;
    return 0;
});




const items = document.getElementById("cart__items");

const init = async () => {
    const productLS = await getProductLS();
    displayProduct(productLS);
    deleteItem(productLS);
    totalQuantity();
    checkProductLS();
};
init();

function getProductLS() {
    return JSON.parse(localStorage.getItem("product"));
}












console.log(getProductLS());

async function checkProductLS() {
    const productLS = await getProductLS();
    if (productLS.length == 0) {
        items.textContent = "Il n'y a aucun produit dans le panier";
        return true;
    }
}

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
                checkProductLS();


            })
            .catch((err) => {
                console.log("err");
            })
    };
};



async function totalPrice() {
    let kanap = await getProductLS();
    let quantities = document.querySelectorAll(".itemQuantity");
    let prices = document.querySelectorAll(".cart__item__content__description");
    let cartPrice = 0;
    for (let i = 0; i < prices.length; i++) {
        cartPrice +=
            parseInt(prices[i].lastElementChild.textContent) * quantities[i].value;
    }
    document.getElementById("totalPrice").textContent = cartPrice;
    saveProductLS(kanap);
};

async function totalQuantity() {
    let kanap = await getProductLS();
    let total = 0;
    for (const item of kanap) {
        total += parseInt(item.quantity);
    }
    const tQuantity = document.querySelector("#totalQuantity");
    tQuantity.textContent = total;
    saveProductLS(kanap);
};

function deleteItem(product) {
    const deleteButtons = document.querySelectorAll(".deleteItem");
    deleteButtons.forEach((btn) => {
        btn.addEventListener("click", async (e) => {
            const target = e.target.closest(".cart__item").dataset.id;
            const color = e.target.closest(".cart__item").dataset.color;
            const deleteItem = e.target.closest(".cart__item");
            let kanap = await getProductLS();
            kanap = kanap.filter((item) => {
                return item.id != target || item.colors != color;
            });
            deleteItem.remove();
            saveProductLS(kanap);
            totalQuantity();
            totalPrice();
            checkProductLS();
        });
    });
};


function saveProductLS(product) {
    return localStorage.setItem("product", JSON.stringify(product));
};


async function changeQuantity(product, productLS) {
    let kanap = await getProductLS();
    let inputQuantity = document.querySelectorAll(".itemQuantity");

    inputQuantity.forEach((item) => {
        item.addEventListener("input", (e) => {
            const target = e.target.closest(".cart__item").dataset.id;
            const color = e.target.closest(".cart__item").dataset.color;
            let kanapFind = kanap.find((item) => {
                return item.id == target && item.colors == color;
            });
            kanapFind.quantity = parseInt(e.target.value);
            saveProductLS(kanap);
            totalQuantity();
            totalPrice();
        });
    });

}


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



// formValidator = (champ, champError , champRegex , champTextError) => {
//     champ.addEventListener("input", (e) => {
//         valid(e.target.value);
//         contact.champ = e.target.value;
//     });

//     valid = (champ) => {
//         let valid = false;
//         let test = champRegex.test(champ);
//         if (test) {
//             champError.textContent = "";
//             valid = true;
//         } else {
//             champError.textContent = `${champTextError}`;
//             valid = false;
//         }
//         return valid;
//     };
// };

// formValidator(firstName , firstNameErrorMsg , firstNameRegex , "Prenom invalide");
// formValidator(lastName , lastNameErrorMsg , lastNameRegex , "Nom invalide");



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

        let kanap = getProductLS();
        for (let i of kanap) {
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
