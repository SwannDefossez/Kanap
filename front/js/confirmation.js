localStorage.clear(); 

let str = window.location.href;
let url = new URL(str);
let idOrder = url.searchParams.get("id");


let orderId = document.getElementById("orderId");
orderId.textContent = idOrder;