// ****** navToggle **********

const navToggle = document.querySelector(".nav-toggle");
const links = document.querySelector(".links");

navToggle.addEventListener("click", function () {
    links.classList.toggle("show-links");
});

let store = {
  searchTerms: [],
  initialImage: '',
  searching: false,
  responseSaved: false,
  response: '',
  savedRecipe: '',
}

/*****************html display******************/
function returnHomePage(responseJson) {
  return `
<section class="section-recipi">
    <div style="padding:2rem";>
    <h2>Recipi</h2>
    <h3>Need some last-minute idea on your grocery trip? </h3>
    <p>This app offers up to 9 recipes per search. In addition to ingredients display, it will also provide calories count and nutritional information of the dish.</p>
    <form action='' id="js-search-form">
        <label class="form-elem" for="search-term">Search by ingredient or recipe name:</label>
        <input class="form-elem" type="text" name="search-term" id="search-term" required placeholder="ex: garlic, italian">
        <input class="form-elem" type="submit" id="search-submit">
    </form>
    </div>
    <div style="padding:2rem";>
        <p>Not a recipe person? You can also keep hitting refresh button for picture inspiration.</p>
        <img class="hero-img" src="${responseJson.image}" alt="hero-image">
    </div>
</section>
   `
}

function returnRecipesPage(responseJson) {
  let results = []
  for (let i = 0; i < responseJson.hits.length; i++) {
    results.push(`
        <div class="recipe">
          <h3 class="recipe-label">${responseJson.hits[i].recipe.label}</h1>
          <div class="recipe-img-container">
            <img src="${responseJson.hits[i].recipe.image}" alt="recipe image"/>
          </div>
          <button class="recipe-button" id="${i}">Click here for ${responseJson.hits[i].recipe.label} recipe</button>
        </div>`)
  }
  results.unshift('<div class="recipe-page-container">')
  results.push('</div>')
  return results.join('')
}

function returnRecipeDetails(savedRecipe, obj) {
  let result = []
  result.push(`<h2 class="recipe-label">${savedRecipe.label}</h2>
    <div class="food-img-container">
      <img src="${savedRecipe.image}" alt="${savedRecipe.label}"/>
    </div>
    <h3 class="recipe-source">Source: ${savedRecipe.source}</h3>
    <p class="calories">Calories: ${savedRecipe.calories.toFixed(2)}</p>`)
  result.push(
      `<button class="recipe-button"><a href="${savedRecipe.url}" target="_blank">Recipe Link</a></button>`
  )

  let ingredientList = []
  for (let i = 0; i < savedRecipe.ingredientLines.length; i++) {
    ingredientList.push(
      `<li class="ingredient">${savedRecipe.ingredientLines[i]}</li>`
    )
  }
  ingredientList.unshift('<ul>')
  ingredientList.push('</ul>')
  ingredientList.unshift('<h4>Ingredients</h4>')
  ingredientList.unshift('<div class="ingredient-list">')
  ingredientList.push('</div>')
  result.push(ingredientList.join(''))

  let nutrientList = []
  for (let prop in obj) {
    console.log(prop)
    let quantity = obj[prop].quantity.toFixed(2)
    nutrientList.push(`
      <li class="nutrient">${obj[prop].label}: ${quantity} ${obj[prop].unit}</li>
      `)
  }
  nutrientList.unshift('<ul>')
  nutrientList.push('</ul>')
  nutrientList.unshift('<h4>Nutrition Information</h4>')
  nutrientList.unshift("<div class='nutrient-list'>")
  nutrientList.push(`</div>`)
  result.push(nutrientList.join(''))

  result.unshift('<div class="recipe-info">')
  result.push('</div>')

  return result.join('')
}

/******* fetch **********/
const edamamApiParams = {
  app_url: 'https://api.edamam.com/search',
  app_id: '10b62213',
  app_key: '9a9a4d0eba510cffc8d26aed4315c06b',
}
function fetchRecipes(query) {
  fetch(
    `https://api.edamam.com/search?q=${query}&q=chicken&app_id=10b62213&app_key=9a9a4d0eba510cffc8d26aed4315c06b`
  )
    .then((response) => response.json())
    .then((responseJson) => {
      store.response = responseJson
      store.searching = true
      render()
    })
    .catch((error) => console.log(error))
}

function fetchFoodishImage() {
  fetch(`https://foodish-api.herokuapp.com/api/`)
    .then((response) => response.json())
    .then((responseJson) => $('main').append(returnHomePage(responseJson)))
    .catch((error) => console.log(error))
}

/*********render functions**************/
function render() {
  $('main').empty()
  if (store.responseSaved === true) {
    $('main').append(
      returnRecipeDetails(store.savedRecipe, store.savedRecipe.totalNutrients)
    )
    return
  }
  if (store.searching === false) {
    fetchFoodishImage()
  } else if (store.searching === true) {
    console.log(store.response)
    $('main').append(returnRecipesPage(store.response))
  }
}

/**********event listener ***********/

function submitSearch() {
  $('main').on('submit', '#js-search-form', function (event) {
    event.preventDefault()
    let query = $('#search-term').val()
    // fetch search results with store.searchTerms data
    fetchRecipes(query)
    // render
  })
}

function getRecipeButton() {
  $('main').on('click', '.recipe-button', function (event) {
    let hitsIdx = $(this).attr('id')
    store.savedRecipe = store.response.hits[hitsIdx].recipe
    store.responseSaved = true
    render()
  })
}

function handleHomeButton() {
  $('aside').on('click', '.refresh-button', function (event) {
    store.searching = false
    store.responseSaved = false
    render()
  })
}

function runFunctions() {
  $(submitSearch)
  $(getRecipeButton)
  $(handleHomeButton)
  $(render)
}

$(runFunctions)
