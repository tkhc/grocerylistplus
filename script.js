$(document).ready(function () {

  //        if(document.cookie == 'age-verified') {
  //            $("#age-verify").addClass("hidden");
  //        }
  function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }
  function checkCookie() {
    var user = getCookie("age-verified");
    if (user != "") {
      $("#age-verify").addClass("hidden");
    }
  }


  var yesEl = document.getElementById('yes');
  var noEl = document.getElementById('no');

  yesEl.addEventListener('click', function () {
    //document.cookie = 'age-verified; expires=1';
    $('#age-verify').addClass('hidden');
    function setCookie(cname, cvalue, exdays) {
      var d = new Date();
      d.setTime(d.getTime() + (exdays * 1));
      var expires = "expires=" + d.toGMTString();
      document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }
  });

  noEl.addEventListener('click', function () {
    $('#age-text').addClass('hiddenText');
    $('#under-age').removeClass('hiddenText');
    $('#yes').addClass('hiddenText');
  });

});

// ****** navToggle **********

const navToggle = document.querySelector(".nav-toggle");
const links = document.querySelector(".links");

navToggle.addEventListener("click", function () {
  links.classList.toggle("show-links");
});

// ****** elixir ************
const getDrinkBtn = document.getElementById("get_drink");
const drinkContainer = document.getElementById("drink");

getDrinkBtn.addEventListener('click', () => {
  fetch('https://www.thecocktaildb.com/api/json/v1/1/random.php')
    .then(res => res.json())
    .then(res => {
      createDrink(res.drinks[0])
    })
});

//ingredient array
function createDrink(drink) {
  const ingredients = [];
  for (i = 1; i <= 20; i++) {
    if (drink[`strIngredient${i}`]) {
      ingredients.push(
        `${drink[`strIngredient${i}`]} -  ${drink[`strMeasure${i}`]}`
      )
    } else {
      break;
    }
  }

//body
  drinkContainer.innerHTML = `
    <div>
      <div class="columns five">
        <img src="${drink.strDrinkThumb}" alt="drink immg" /> 
    </div>
      <div class="columns five">
        <h4>${drink.strDrink}</h4>
        <p>${drink.strInstructions}</p>
        <p><strong>Category:</strong> ${drink.strCategory}</p>
        <p><strong>Glass:</strong> ${drink.strGlass}</p>
        <h5>Ingredients</h5>
        <ul>
          ${ingredients.map(ingredient => `
            <li>${ingredient}</li>
          `).join('')}
        </ul>
			</div>
		</div>
	`;
}

