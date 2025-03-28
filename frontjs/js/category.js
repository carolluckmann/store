const categoryName = document.getElementById("category");
const tax = document.getElementById("tax");
const table = document.getElementById("table");
const categoryButton = document.getElementById("categoryButton");

let categories = [];

async function addCategory() {
  const category = {
    code:
      categories.length > 0 ? categories[categories.length - 1].code + 1 : 1,
    name: categoryName.value,
    tax: tax.value,
  };
  if (!validInput()) {
    alert("The fields should be filled!");
    return true;
  } else if (tax.value < 0 || tax.value > 100) {
    alert("Tax must be a number between 0 and 100.");
    categoryName.value = " ";
    tax.value = " ";
    return false;
  } else if (
    !/^[0-9a-zA-Z\sáàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ'\s]*$/g.test(
      categoryName.value
    )
  ) {
    alert("Category name must be a word.");
    clearInputs();
    return false;
  }

  let existingItem = categories.findIndex(
    (category) => category.name === categoryName.value
  );
  if (existingItem !== -1) {
    alert("This category already exists!");
    clearInputs();
    return true;
  }
  try {
    const response = await fetch("http://localhost/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(category),
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const json = await response.json();
    console.log(json);
    category = json;
  } catch (e) {
    console.error(e);
  }

  await getCategories();
  showTable();
  clearInputs();
}

categoryButton.addEventListener("click", addCategory, clearInputs);

document.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    addCategory();
  }
});

async function getCategories() {
  try {
    const response = await fetch("http://localhost/categories");
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const json = await response.json();
    console.log(json);
    categories = json;
  } catch (e) {
    console.error(e);
  }
}

function validInput() {
  if (!categoryName.value || !tax.value) {
    return false;
  } else {
    return true;
  }
}

function showTable() {
  table.innerHTML = `<tr>
  <th>Code</th>
  <th>Category</th>
  <th>Tax</th>
  <th>Action</th>
  </tr>`;
  for (let category of categories) {
    table.innerHTML += `
    <tr>
    <td class="td-align">${category.code}</td>
    <td>${category.name}</td>
    <td>${category.tax}%</td>
    <td><button onclick = "deleteCategory(${category.code})" class="cancel">Delete</button>
    </tr>`;
  }
}

function clearInputs() {
  document.getElementById("category").value = "";
  document.getElementById("tax").value = "";
}

let products = [];

async function getProducts() {
  try {
    const response = await fetch("http://localhost/products");
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const json = await response.json();
    console.log(json);
    products = json;
  } catch (e) {
    console.log(e);
  }
}

async function deleteCategory(id) {
    await getProducts();
    const hasProducts = products.some((product) => product.category_code == id);
    
    if (hasProducts) {
      alert("You can't delete this category: there are products using it.");
      return; 
    }
  
    if (!confirm("Are you sure? This action will remove this category from your store!")) {
      return;
    }
    try {
      const response = await fetch(`http://localhost/categories/${id}`, {
        method: "DELETE",
      });
  
      if (!response.ok) {
        console.error("Erro ao deletar categoria:", response.status);
        return;
      }
  
      await getCategories();
      showTable();
    } catch (e) {
      console.error("Erro ao deletar categoria:", e);
    }
  }

setInterval(() => {
  if (categoryName.type !== "text") {
    categoryName.type = "text";
  }
  if (tax.type !== "number") {
    tax.type = "number";
  }
}, 500);

(async () => {
  await getCategories();
  showTable();
})();
