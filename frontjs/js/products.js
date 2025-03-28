const productName = document.getElementById("product");
const amount = document.getElementById("amount");
const unitPrice = document.getElementById("unitPrice");
const category = document.getElementById("categorySelect");
const table = document.getElementById("table");
const productButton = document.getElementById("productButton");

let categories = [];

async function getCategories(){
  try {
    const response = await fetch('http://localhost/categories');
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const json = await response.json();
    categories = json;
  } catch (e) {
    console.log(e);
  }
};

function showCategories() {
  let selectedValue = category.value;
    category.innerHTML = "<option value='' selected hidden>Select a category</option>";
    categories.forEach((c) => {
        let option = document.createElement("option");
        option.value = c.code;
        option.textContent = c.name;
        category.appendChild(option);
    });
    category.value = selectedValue; 
}

let products = [];

async function addProducts() {
  const product = {
    code: products.length > 0 ? products[products.length - 1].code + 1 : 1,
    name: productName.value,
    amount: amount.value,
    price: unitPrice.value,
    category: category.value,
  };
  if (!validInput()) {
    alert("The fields should be filled!");
    clearInputs();
    return true;
  } else if (category.value == null || category.value == "") {
    alert("Select a category before continue...");
    return true;
  } else if (
    !/^[0-9a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ'\s]*$/g.test(productName.value)
  ) {
    alert("Product name must be a word.");
    clearInputs();
    return false;
  } else if (unitPrice.value <= 0) {
    alert("Price must be a positive number.");
    clearInputs();
    return false;
  } else if (amount.value <= 0) {
    alert("Amount must be a positive number.");
    clearInputs();
    return false;
  }
  let existingItem = products.findIndex(
    (product) => product.name === productName.value
  );
  if (existingItem !== -1) {
    alert("This product already exists");
    clearInputs();
    return false;
  }
  try {
    const response = await fetch('http://localhost/products', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
  } catch (e) {
    console.error(e);
  }

  await getCategories();
  await getProducts();
  showTable();
  clearInputs();
}

productButton.addEventListener("click", addProducts, clearInputs);

document.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    addProducts();
  }
});

async function getProducts(){
  try {
    const response = await fetch('http://localhost/products');
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const json = await response.json();
    products = json;
  } catch (e) {
    console.error(e);
  }
};

function validInput() {
  if (
    !productName.value ||
    !amount.value ||
    !unitPrice.value ||
    !category.value
  ) {
    return false;
  } else {
    return true;
  }
}

async function showTable() {
  table.innerHTML = `<tr>
        <th>Code</th>
        <th>Product</th>
        <th>Amount</th>
        <th>Unit Price</th>
        <th>Category</th>
        <th>Action</th>
    </tr>`;
  for (let product of products) {
    table.innerHTML += `
            <tr>
                <td>${product.code}</td>
                <td>${product.name}</td>
                <td>${product.amount} units</td>
                <td>$${Number(product.price).toFixed(2)}</td>
                <td>${categories.find((c) => c.code == product.category_code).name}</td>
                <td><button onclick = "deleteProduct(${product.code})" class="cancel">Delete</button>
            </tr>`;
  }
}

function clearInputs() {
  document.getElementById("product").value = "";
  document.getElementById("amount").value = "";
  document.getElementById("unitPrice").value = "";
  document.getElementById("categorySelect").value = "";
}

let order = {};

async function getActiveOrder(){
  try {
    const response = await fetch('http://localhost/active-order', {
      method: "GET"
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const json = await response.json();
    order = json;
  } catch (e) {
    console.error(e);
  }
}

let items = [];

async function getOrderItemsById(id) {
  try {
    const response = await fetch(`http://localhost/order-item/${id}`, {
      method: "GET"
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const json = await response.json();
    items = json;
  } catch (e) {
    console.error(e);
  }
}

async function getOrderById(id) {
  try {
    const response = await fetch(`http://localhost/order/${id}`, {
      method: "GET"
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const json = await response.json();
    items = json;
  } catch (e) {
    console.error(e);
  }
}

async function isInPurchaseHistory(id) {
  try {
    const response = await fetch(`http://localhost/history-items/${id}`);
    if (!response.ok) throw new Error(`Response status: ${response.status}`);
    const purchases = await response.json();
    return purchases.length;
  } catch (e) {
    console.error(e);
    return false;
  }
 }

async function deleteProduct(id) {
  const hasCart = items.some(order => order.product_code == id);
  if (hasCart) {
    alert("You can't delete this product: there are carts using it.");
    return;
  }
  const hasHistory = await isInPurchaseHistory(id);
  if (hasHistory) {
    alert("You can't delete this product: it is in a purchase history.");
    return;
  }
  else if (confirm("Are you sure? This action will remove this product from your store!")) {

    const response = await fetch(`http://localhost/products/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      console.error(response.status);
      return;
    }
  }
  await getProducts();
  await getCategories();
  showTable();
 }

 setInterval(() => {
  if (productName.type !== "text") {
    productName.type = "text";
  }
  if (amount.type !== "number") {
    amount.type = "number";
  }
  if (unitPrice.type !== "number") {
    unitPrice.type = "number";
  }
  const currentOptions = Array.from(category.options).map(
    (opt) => opt.value
  );
  const correctOptions = categories.map((c) => c.name);
  if (JSON.stringify(currentOptions) !== JSON.stringify(correctOptions)) {
    showCategories();
}}, 500);

(async () => { 
  await getCategories();
  await getProducts();
  await getActiveOrder();
  await getOrderItemsById(order.code);
  showTable();
  showCategories();
  clearInputs();
  })();

