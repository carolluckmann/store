const purchaseDetails = document.getElementById("purchaseDetails");
const historyTable = document.getElementById("historyTable");

function openModal() {
  const modal = document.getElementById("modal-container");
  modal.classList.add("show");
}

function closeModal() {
  const modal = document.getElementById("modal-container");
  modal.classList.remove("show");
  localStorage.closeModal = "modal-container";
}

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("modal-container");

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
});

let items = [];

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
async function getPurchase() {
  await getOrderFalse();

  if (items.length === 0) {
    historyTable.innerHTML = "<p>No purchase history available.</p>";
    return;
  }

  historyTable.innerHTML = `<tr>
  <th>Code</th>
  <th>Tax</th>
  <th>Total</th>
  </tr>`;

  items.forEach((item) => {
    historyTable.innerHTML += `
    <tr>
    <td>${item.code}</td>
    <td>$${Number(item.tax).toFixed(2)}</td>
    <td>$${(Number(item.total) + Number(item.tax)).toFixed(2)}</td>
    <td class="button-history">
    <input onclick="getPurchaseDetails(${item.code}, ${item.tax}, ${item.total})" type="submit" value="View" class="finish">
    </tr>
    <div id="modal-container" class="modal-container">
    <div class="modal">
    <button onclick="closeModal()" class="close" id="close">x</button>
    </div>
    </div>`;
  });
}

async function getPurchaseDetails(id, tax, total) {
  await getOrderItemsById(id);
  let detailsContainer = document.getElementById("purchaseDetails");
  items.find((item) => {
    detailsContainer.innerHTML = `
          <h2>Purchase #${id}</h2>
          <br>
          <h4>Total: $${(Number(total) + Number(tax)).toFixed(2)} | Tax: $${Number(tax).toFixed(2)}</h4>
          <button onclick="closeModal()" class="close" id="close">x</button>
        </div> 
      </div>   
      <br>
         <table>
        <thead>
            <tr>
                <th>Product</th>
                <th>Amount</th>
                <th>Unit price</th>
                <th>Tax</th>
                <th class="last-elem">Total</th>
                </tr>
        </thead>
        <tbody id="table-history-body">
        </tbody>
    </table>`;
    const tableBody = document.getElementById("table-history-body")
    items.forEach((item) => {
      tableBody.innerHTML += `
       <tr>
        <td>${products.find((i) => i.code == item.product_code).name}</td>
        <td>${item.amount}</td>
        <td>$${Number(item.price).toFixed(2)}</td>
        <td>${item.tax}%</td>
        <td>$${(Number(item.price) * Number(item.amount)).toFixed(2)}</td>
      </tr>
       `;
    });
  });

  openModal();
}

(async () => {
  await getProducts();
  getPurchase();
})();
