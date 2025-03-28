const amount = document.getElementById("amount");
const tax = document.getElementById("tax");
const price = document.getElementById("price");
const productSelect = document.getElementById("productSelect");
const table = document.getElementById("table");
const total = document.getElementById("total");
const addToCartButton = document.getElementById("addToCartButton");
const finalResult = document.getElementById("final-result");
const taxPrice = document.getElementById("taxPrice");
const purchaseHistory = document.getElementById("purchaseHistory");

let categories = [];

async function getCategories() {
  try {
    const response = await fetch("http://localhost/categories");
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const json = await response.json();
    categories = json;
  } catch (e) {
    console.error(e);
  }
}

let products = [];

async function getProducts() {
  try {
    const response = await fetch("http://localhost/products");
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const json = await response.json();
    products = json;
  } catch (e) {
    console.error(e);
  }
}

function showProducts() {
  productSelect.innerHTML =
    "<option value='' selected hidden>Select a product</option>";
  products.forEach((p) => {
    let option = document.createElement("option");
    option.value = p.code;
    option.textContent = p.name;
    if (p.amount > 0) {
      productSelect.appendChild(option);
    }
  });
}

async function findProductInfo() {
  let product = products.find((p) => p.code == productSelect.value);
  let category = categories.find((c) => c.code == product?.category_code);
  try {
    const response = await fetch("http://localhost/products", {
      method: "GET",
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const json = await response.json();
    products = json;
  } catch (e) {
    console.error(e);
  }
  try {
    const response = await fetch("http://localhost/categories", {
      method: "GET",
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const json = await response.json();
    categories = json;
  } catch (e) {
    console.error(e);
  }
  tax.value = `${category?.tax}%`;
  price.value = `$${Number(product?.price).toFixed(2)}`;
}
productSelect.addEventListener("change", findProductInfo);

async function addItems() {
  await findProductInfo();
  await getProducts();
  const item = {
    order: order.code,
    product: productSelect.value,
    amount: Number(amount.value),
    price: Number(price.value.toString().replace("$", "")),
    tax: Number(tax.value.toString().replace("%", "")),
    total:
      Number(amount.value) * Number(price.value.toString().replace("$", "")),
  };
  if (!validInput()) {
    alert("The fields should be filled!");
    clearInputs();
    return;
  } else if (productSelect.value == null || productSelect.value == "") {
    alert("Select a product before continue...");
    clearInputs();
    return true;
  } else if (amount.value <= 0) {
    alert("Amount must be a positive number.");
    clearInputs();
    return false;
  } else if (!amountProduct()) {
    alert("It's impossible to add this amount, we don't have it in stock");
    clearInputs();
    return;
  }
  await addOrSet(item);
  await getOrderItemsById(order.code);
  await showTable();
  clearInputs();
}

async function addOrSet(item) {
  let existingItem = items.find((i) => i.product_code == productSelect.value);
  if (existingItem) {
    try {
      const response = await fetch("http://localhost/set-increment", {
        method: "POST",
        body: JSON.stringify({
          ...existingItem,
          amount: Number(existingItem?.amount) + Number(amount.value),
        }),
      });
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
    } catch (e) {
      console.error(e);
    }
  } else {
    try {
      const response = await fetch("http://localhost/order-item", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
    } catch (e) {
      console.error(e);
    }
  }
}

addToCartButton.addEventListener("click", addItems);

document.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    addItems();
  }
});

let order = {};

async function getActiveOrder() {
  try {
    const response = await fetch("http://localhost/active-order", {
      method: "GET",
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
      method: "GET",
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

async function getOrderItems() {
  try {
    const response = await fetch(`http://localhost/order-item`, {
      method: "GET",
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

function amountProduct() {
  let productAmount =
    products[products.findIndex((p) => p.code == productSelect.value)].amount;
  let productIndexOnCart = items.findIndex(
    (p) => p.product_code == productSelect.value
  );
  let onCart = 0;
  if (productIndexOnCart !== -1) {
    onCart = items[productIndexOnCart].amount;
  }
  if (Number(amount.value) + Number(onCart) > Number(productAmount)) {
    return false;
  } else {
    return true;
  }
}

function validInput() {
  if (!amount.value) {
    return false;
  } else {
    return true;
  }
}

async function showTable() {
  if (items.length === 0) {
    table.innerHTML = `There's no products yet!`;
    return;
  }
  table.innerHTML = `<tr>
  <th>Product</th>
  <th>Amount</th>
  <th>Price</th>
  <th>Tax</th>
  <th>Product total</th>
  <th>Action</th>
  </tr>`;
  for (let item of items) {
    table.innerHTML += `
    <tr>
    <td>${products.find((p) => p.code == item.product_code).name}</td>
    <td>${item.amount} units</td>
    <td>$${Number(item.price).toFixed(2)}</td>
    <td>${item.tax}%</td>
    <td>$${((Number(item.amount) * Number(item.price))).toFixed(2)}</td>
    <td><button onclick = "deleteProduct(${
      item.code
    })" class="cancel">Delete</button></td>
    </tr>`;
  }
  await showResult();
}

function clearInputs() {
  document.getElementById("productSelect").value = "";
  document.getElementById("amount").value = "";
  document.getElementById("price").value = "";
  document.getElementById("tax").value = "";
}

async function deleteProduct(id) {
  if (
    !confirm(
      "Are you sure? This action will remove this product from your cart!"
    )
  ) {
    return;
  }
  const response = await fetch(`http://localhost/order-item/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    console.error(response.status);
    return;
  }
  await getActiveOrder();
  await getOrderItemsById(order.code);
  await showTable();
  await showResult();
}

async function showResult() {
  cartTotal = 0;
  fullTax = 0;
  
  for (let item of items) {
    cartTotal = Number(cartTotal) + Number(item.price) * Number(item.amount);
    fullTax =
    Number(fullTax) +
    (Number(item.tax) / 100) * Number(item.price) * Number(item.amount);
  }
  try {
    const response = await fetch(`http://localhost/update-orders`, {
      method: "POST",
      body: JSON.stringify({
        tax: fullTax,
        total: cartTotal,
        id: order.code
      })
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
  } catch (e) {
    console.error(e);
  }
  
  taxPrice.innerHTML = `<b>Tax:</b> $${fullTax.toFixed(2)}`;
  total.innerHTML = `<b>Total:</b> $${(cartTotal + fullTax).toFixed(2)}`;
}

async function cancelPurchase() {
  if (items.length === 0) {
    alert("Your cart is empty!");
    return;
  }
  if (
    !confirm(
      "Are you sure? This action will remove all the items of your cart!"
    )
  ) {
    return;
  }
  const response = await fetch("http://localhost/canceled-order", {
    method: "DELETE",
  });
  if (!response.ok) {
    console.error("Error:", response.status);
    return;
  }
  await getOrderItems();
  await showResult();
  showTable();
}

async function setActiveFalse() {
  try {
    const response = await fetch(`http://localhost/set-active-false`, {
      method: "GET",
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

async function getOrderFalse() {
  try {
    const response = await fetch(`http://localhost/get-order-false`, {
      method: "GET",
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

async function finishPurchase() {
  if (items.length === 0) {
    alert("Your cart is empty!");
    return;
  }
  console.log(items)
  console.log(products)
  items.forEach(async (cartItem) => {
      let product = products.find((p) => p.code == cartItem.product_code);
      try {
        const response = await fetch("http://localhost/set-decrement", {
          method: "POST",
          body: JSON.stringify({
            code: product.code,
            amount: Number(product?.amount) - Number(cartItem.amount),
          }),
        });
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
      } catch (e) {
        console.error(e);
      }
    });
    await createOrder();
    await getActiveOrder();
    await getOrderItemsById(order.code);
    await showResult();
    await showTable();
}

async function createOrder() {
  const response = await fetch(`http://localhost/order`, {
    method: "POST",
  });
  if (!response.ok) {
    console.error(response.status);
    return;
  }
}

async function getOrCreateOrder() {
  await getActiveOrder();
  if (!order.code) {
    await createOrder();
    await getActiveOrder();
  }
}

document
  .getElementById("finishButton")
  .addEventListener("click", finishPurchase);

setInterval(() => {
  if (amount.type !== "number") {
    amount.type = "number";
  }
  if (tax.type !== "text") {
    tax.type = "text";
  }
  if (price.type !== "text") {
    price.type = "text";
  }
  // const currentOptions = Array.from(products.options).map((opt) => opt.value);
  // const correctOptions = products.map((p) => p.name);
  // if (JSON.stringify(currentOptions) !== JSON.stringify(correctOptions)) {
  //   showProducts();
  // }
}, 500);

(async () => {
  await getProducts();
  await getCategories();
  await getOrCreateOrder();
  await getOrderItemsById(order.code);
  await showResult();
  await showTable();
  showProducts();
})();
