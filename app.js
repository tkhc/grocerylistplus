// ****** select items **********

const form = document.querySelector(".grocery-form");
const alert = document.querySelector(".alert");
const grocery = document.getElementById("grocery");
const submitBtn = document.querySelector(".submit-btn");
const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");
const clearBtn = document.querySelector(".clear-btn");
// edit option
let editElement;
let editFlag = false;
let editID = "";
// ****** event listeners **********

// submit form
form.addEventListener("submit", addItem);
// clear list
clearBtn.addEventListener("click", clearItems);
// display items onload
window.addEventListener("DOMContentLoaded", setupItems);

// ****** functions **********

// add item
function addItem(e) {
  e.preventDefault();
  const value = grocery.value;
  const id = new Date().getTime().toString();

  if (value !== "" && !editFlag) {
    const element = document.createElement("article");
    let attr = document.createAttribute("data-id");
    attr.value = id;
    element.setAttributeNode(attr);
    element.classList.add("grocery-item");
    element.innerHTML = `<p class="title">${value}</p>
            <div class="btn-container">
              <!-- edit btn -->
              <button type="button" class="edit-btn">
                <i class="fas fa-edit"></i>
              </button>
              <!-- delete btn -->
              <button type="button" class="delete-btn">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          `;
    // add event listeners to both buttons;
    const deleteBtn = element.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", deleteItem);
    const editBtn = element.querySelector(".edit-btn");
    editBtn.addEventListener("click", editItem);

    // append child
    list.appendChild(element);
    // display alert
    displayAlert("item added to the list", "success");
    // show container
    container.classList.add("show-container");
    // set local storage
    addToLocalStorage(id, value);
    // set back to default
    setBackToDefault();
  } else if (value !== "" && editFlag) {
    editElement.innerHTML = value;
    displayAlert("value changed", "success");

    // edit  local storage
    editLocalStorage(editID, value);
    setBackToDefault();
  } else {
    displayAlert("please enter value", "danger");
  }
}
// display alert
function displayAlert(text, action) {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);
  // remove alert
  setTimeout(function () {
    alert.textContent = "";
    alert.classList.remove(`alert-${action}`);
  }, 1000);
}

// clear items
function clearItems() {
  const items = document.querySelectorAll(".grocery-item");
  if (items.length > 0) {
    items.forEach(function (item) {
      list.removeChild(item);
    });
  }
  container.classList.remove("show-container");
  displayAlert("empty list", "danger");
  setBackToDefault();
  localStorage.removeItem("list");
}

// delete item

function deleteItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  const id = element.dataset.id;

  list.removeChild(element);

  if (list.children.length === 0) {
    container.classList.remove("show-container");
  }
  displayAlert("item removed", "danger");

  setBackToDefault();
  // remove from local storage
  removeFromLocalStorage(id);
}
// edit item
function editItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  // set edit item
  editElement = e.currentTarget.parentElement.previousElementSibling;
  // set form value
  grocery.value = editElement.innerHTML;
  editFlag = true;
  editID = element.dataset.id;
  //
  submitBtn.textContent = "edit";
}
// set backt to defaults
function setBackToDefault() {
  grocery.value = "";
  editFlag = false;
  editID = "";
  submitBtn.textContent = "submit";
}

// ****** local storage **********

// add to local storage
function addToLocalStorage(id, value) {
  const grocery = { id, value };
  let items = getLocalStorage();
  items.push(grocery);
  localStorage.setItem("list", JSON.stringify(items));
}

function getLocalStorage() {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
}

function removeFromLocalStorage(id) {
  let items = getLocalStorage();

  items = items.filter(function (item) {
    if (item.id !== id) {
      return item;
    }
  });

  localStorage.setItem("list", JSON.stringify(items));
}
function editLocalStorage(id, value) {
  let items = getLocalStorage();

  items = items.map(function (item) {
    if (item.id === id) {
      item.value = value;
    }
    return item;
  });
  localStorage.setItem("list", JSON.stringify(items));
}

// SETUP LOCALSTORAGE.REMOVEITEM('LIST');

// ****** setup items **********

function setupItems() {
  let items = getLocalStorage();

  if (items.length > 0) {
    items.forEach(function (item) {
      createListItem(item.id, item.value);
    });
    container.classList.add("show-container");
  }
}

function createListItem(id, value) {
  const element = document.createElement("article");
  let attr = document.createAttribute("data-id");
  attr.value = id;
  element.setAttributeNode(attr);
  element.classList.add("grocery-item");
  element.innerHTML = `<p class="title">${value}</p>
            <div class="btn-container">
              <!-- edit btn -->
              <button type="button" class="edit-btn">
                <i class="fas fa-edit"></i>
              </button>
              <!-- delete btn -->
              <button type="button" class="delete-btn">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          `;
  // add event listeners to both buttons;
  const deleteBtn = element.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", deleteItem);
  const editBtn = element.querySelector(".edit-btn");
  editBtn.addEventListener("click", editItem);

  // append child
  list.appendChild(element);
}

// ****** Recipe Search **********

const apiId = "10b62213";
const apiKey = "9a9a4d0eba510cffc8d26aed4315c06b";
const url = "https://api.edamam.com/search";


const searchValue = document.getElementById("searchValue");
const searchButton = document.getElementById("searchButton");
const recipiContainer = document.querySelectorAll(".recipiContainer");
const contentContainer = document.querySelector(".contentContainer");
const moreButton = document.getElementById("moreButton");
const displayWarning = document.querySelector(".displayWarning");
let recipeFrame = [];
let memberCounter = 0;

/* Fetching first 6 recipes */
const getRecipi = async () => {
  const inputValue = searchValue.value;
  const urlToFetch =
    url +
    "?q=" +
    inputValue +
    "&app_id=" +
    apiId +
    "&app_key=" +
    apiKey +
    "&from=0&to=6";

  try {
    const response = await fetch(urlToFetch);
    if (response.ok) {
      const jsonResponse = await response.json();
      //console.log(jsonResponse);
      if (jsonResponse.hits.length >= 6) {
        return jsonResponse;
      } else {
        const displayNoResult = document.createElement("p");
        displayNoResult.append(document.createTextNode("No result found. Try again."));
        contentContainer.style.display = "none";
        moreButton.style.display = "none";
        displayWarning.append(displayNoResult);
      }
    }
    throw new Error("Sorry. Request failed. Try again.");
  } catch (error) {
    console.log(error);
  }
};

/* Rendering first 6 recipes to display */
const renderRecipi = (recipi) => {
  for (let j = 0; j < recipeFrame.length; j++) {
    const recipiName = document.createElement("h2");
    recipiName.append(document.createTextNode(recipi.hits[j].recipe.label));

    const recipiUrl = document.createElement("a");
    recipiUrl.append(document.createTextNode(recipi.hits[j].recipe.url));

    const recipiCaution = document.createElement("h4");
    if (recipi.hits[j].recipe.cautions[0]) {
      recipiCaution.append(
        document.createTextNode("Caution: " + recipi.hits[j].recipe.cautions[0])
      );
    } else {
      recipiCaution.append(
        document.createTextNode("Note: allergen undetermined")
      );
    }
    const recipiImage = document.createElement("img");
    recipiImage.src = recipi.hits[j].recipe.image;
    const recipiIngredientsList = document.createElement("ul");
    const recipiIngredientsHeader = document.createElement("h5");
    recipiIngredientsHeader.append(document.createTextNode("Ingredients >"));
    const recipiIngredientListCloser = document.createElement("p");
    recipiIngredientListCloser.append(document.createTextNode("X"));
    recipiIngredientsList.append(recipiIngredientListCloser);
    for (let i = 0; i < recipi.hits[j].recipe.ingredientLines.length; i++) {
      const recipiIngredientsListItem = document.createElement("li");
      recipiIngredientsListItem.append(
        document.createTextNode(recipi.hits[j].recipe.ingredientLines[i])
      );
      recipiIngredientsList.append(recipiIngredientsListItem);
    }
    recipeFrame[j].append(
      recipiName,
      recipiUrl,
      recipiImage,
      recipiCaution,
      recipiIngredientsHeader,
      recipiIngredientsList
    );
    recipiIngredientsHeader.addEventListener("click", () => {
      recipiIngredientsList.style.display = "block";
    });
    recipiIngredientListCloser.addEventListener("click", () => {
      recipiIngredientsList.style.display = "";
    });
  }
};

/* Display and search conditions */
const displayContent = (event) => {
  event.preventDefault();
  if (searchValue.value) {
    memberCounter = 0;
    displayWarning.innerHTML = "";
    if (recipeFrame[0]) {
      for (let k = 0; k < recipeFrame.length; k++) {
        recipeFrame[k].innerHTML = "";
      }
      for (let m = 7; m <= recipeFrame.length; m++) {
        const deleteContainer = document.querySelector(
          ".recipiContainer#recipeFrame" + m
        );
        deleteContainer.remove();
      }
    }
    const recipeFrames = [
      "recipeFrame1",
      "recipeFrame2",
      "recipeFrame3",
      "recipeFrame4",
      "recipeFrame5",
      "recipeFrame6",
    ];
    recipeFrame = [];
    recipeFrames.forEach((item) =>
      recipeFrame.push(document.getElementById(item))
    );
    contentContainer.style.display = "";
    moreButton.style.display = "";
    getRecipi().then((responseRecipi) => renderRecipi(responseRecipi));
  }
};

/* hiding container while page loading first */
const hideContainerFirst = () => {
  contentContainer.style.display = "none";
  moreButton.style.display = "none";
};

/* Fetching more recipes */
const getMoreRecipi = async () => {
  const inputValue = searchValue.value;
  let fromPoint = recipeFrame.length;
  let toPoint = fromPoint + 3;
  const moreFetchUrl =
    url +
    "?q=" +
    inputValue +
    "&app_id=" +
    apiId +
    "&app_key=" +
    apiKey +
    "&from=" +
    fromPoint +
    "&to=" +
    toPoint;
  try {
    const response = await fetch(moreFetchUrl);
    if (response.ok) {
      jsonResponse = await response.json();
      //console.log(jsonResponse);
      return jsonResponse;
    } else {
      throw new Error("Request failed!");
    }
  } catch (error) {
    console.log(error);
  }
};

/* calling more recipes function*/
const displayMoreContent = () => {
  getMoreRecipi().then((responseMoreRecipi) =>
    renderMoreRecipi(responseMoreRecipi)
  );
};

/* Rendering more recipes */
const renderMoreRecipi = (moreRecipi) => {
  if (recipeFrame.length < 18) {
    let counter = 1;
    while (counter < 4) {
      const divHolder = document.createElement("div");
      divHolder.classList.add("recipiContainer");
      divHolder.id = "recipeFrame" + [recipeFrame.length + 1];
      recipeFrame.push(divHolder);
      const recipiName = document.createElement("h2");
      recipiName.append(
        document.createTextNode(moreRecipi.hits[counter - 1].recipe.label)
      );
      const recipiUrl = document.createElement("a");
      recipiUrl.append(document.createTextNode(moreRecipi.hits[counter - 1].recipe.url));
      const recipiCaution = document.createElement("h4");
      if (moreRecipi.hits[counter - 1].recipe.cautions[0]) {
        recipiCaution.append(
          document.createTextNode(
            "Caution:" + moreRecipi.hits[counter - 1].recipe.cautions[0]
          )
        );
      } else {
        recipiCaution.append(
          document.createTextNode("Caution: allergen undetermined")
        );
      }
      const recipiImage = document.createElement("img");
      recipiImage.src = moreRecipi.hits[counter - 1].recipe.image;
      const recipiIngredientsHeader = document.createElement("h5");
      recipiIngredientsHeader.append(document.createTextNode("Ingredients >"));
      const recipiIngredientsList = document.createElement("ul");
      const recipiIngredientListCloser = document.createElement("p");
      recipiIngredientListCloser.append(document.createTextNode("X"));
      recipiIngredientsList.append(recipiIngredientListCloser);
      for (
        let i = 0;
        i < moreRecipi.hits[counter - 1].recipe.ingredientLines.length;
        i++
      ) {
        const recipiIngredientsListItem = document.createElement("li");
        recipiIngredientsListItem.append(
          document.createTextNode(
            moreRecipi.hits[counter - 1].recipe.ingredientLines[i]
          )
        );
        recipiIngredientsList.append(recipiIngredientsListItem);
      }
      recipeFrame[recipeFrame.length - 1].append(
        recipiName,
        recipiUrl,
        recipiImage,
        recipiCaution,
        recipiIngredientsHeader,
        recipiIngredientsList
      );
      recipiIngredientsHeader.addEventListener("click", () => {
        recipiIngredientsList.style.display = "block";
      });
      recipiIngredientListCloser.addEventListener("click", () => {
        recipiIngredientsList.style.display = "";
      });
      contentContainer.append(recipeFrame[recipeFrame.length - 1]);
      counter++;
    }
  } else {
    if (memberCounter === 0) {
      const exceedLimit = document.createElement("p");
      exceedLimit.append(document.createTextNode("Sign up for more recipes"));
      displayWarning.append(exceedLimit);
      memberCounter++;
    }
  }
};

/* main events listeners*/
searchButton.addEventListener("click", displayContent);
window.addEventListener("load", hideContainerFirst);
moreButton.addEventListener("click", displayMoreContent);
