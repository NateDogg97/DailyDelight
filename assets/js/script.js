
// ====================
//      IMPORTS
// ====================

//import * as X from "Y";

// ====================
//  ACCESS HTML BY DOM
// ====================

var button = document.getElementById('searchBtn');
var userInput = document.getElementById('locSearch');
var reshuffle = document.querySelector('.waves-effect.waves-light.btn-large');
var instrEl = document.querySelectorAll('.instr');
var checked = document.getElementsByClassName('filled-in');
var resultEl = document.querySelector('#result');
var dayIconEl = document.querySelector('#day-icon');
var tempEl = document.querySelector('#temp');
var windEl = document.querySelector('#wind');
var humidityEl = document.querySelector('#humidity');
var cityNameEl = document.querySelector('#city-name');
var weatherEl = document.querySelector('#weather');
let theBtn = document.getElementById('searchBtn');
let modal = document.getElementById('modal');

// ====================
//   INITIALIZATIONS
// ==================== 

var locationName;
var allergiesArray = [];

// ====================
//      FUNCTIONS
// ====================

//CHECKBOXES
// Value of checked checkbox gets added to a total allergy array initialized at top of script
function checkBoxes(){
    for (i=0; i<checked.length; i++){
        if (checked[i].checked){
            allergiesArray.push(checked[i].nextElementSibling.textContent)
        }
    }
};

//BTN-GO
//Search Button Calls this function which begins the API Chain
function btnGO() {

    locationName = String(userInput.value);
    // console.log(locationName); //See string being passed into GeocodingAPI, i.e. the value user searched for

    checkBoxes();

    geocodingAPI(locationName);

};

//GEOCODING-API
//User input is passed inside and the longitude and latitude for that city is given and passed into the weather API
function geocodingAPI(locationName) {
    var LONGLATurl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + locationName + '&limit=1&appid=3b3319e2a4bdc403d7f45843c07de674';

    //Write our fetch request function as an expression
    const geoData = fetch(LONGLATurl)

        .then(function (response) {
            return response.json();
        })

        //We now have the LATITUDE and LOGITUDE of our city
        .then((data) => {
            // console.log(data); //See the data from the Geocoding API
            showWeather(data,0);
            return [data[0].lat, data[0].lon];
        });

    //Takes those Coords and passes those coords to the current weather API
    const giveLongLats = () => {
        geoData.then((a) => {
            currentAPI(a[0], a[1]);
        });
    };

    //Fires off the giveLongLats func
    giveLongLats();
};

//CURRENT-WEATHER-API
//Uses given Lat and Lon to tell current weather of that city
function currentAPI(Lat, Lon) {

    var currentURL = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + Lat + '&lon=' + Lon + '&units=imperial&exclude=minutely,hourly,daily,alerts&appid=3b3319e2a4bdc403d7f45843c07de674';

    //Makes the fetch current weather function an expression that is manipulatable
    const cityWeather = fetch(currentURL)

        .then(function (response) {
            return response.json();
        })

        //We now have the current weather data as the variable 'data'
        .then(function (data) {
            // console.log(data); //See data from the OneCall API
            //let theIcon = data.current.weather[0].icon; //From that data we can get a snapshot in the form of the weather icon
            //console.log(theIcon); //See the weather snapshot we are passing into the ingredientAPI conditionals, i.e. '01d' for clear sky day or '50n' for misty night
            return data;
        });

    //Now we pass the weather icon to the ingredientAPI
    const passtoCocktailDB = () => {
        cityWeather.then((data) => {
            ingredientAPI(data);
            showWeather(data, 1);
        });
    };

    passtoCocktailDB();

};

function showWeather(data , x) {
    dayIconEl.style.display = 'block';
    if (x === 0) {
        cityNameEl.innerText = data[0].name;
        return;
    }
    weatherEl.innerText = data.current.weather[0].main;
    dayIconEl.setAttribute('src', 'http://openweathermap.org/img/wn/' + data.current.weather[0].icon + '@2x.png');
    tempEl.innerText = Math.round(data.current.temp);
    windEl.innerText = Math.round(data.current.wind_speed);
    humidityEl.innerText = data.current.humidity;
    
}

//COCKTAIL-INGREDIENT-API
//Takes the icon from weather API, turns that into a cocktail ingredient, then searches based on that ingredient
function ingredientAPI(data) {

    //array of all drinks that 1) Are not already added 2) dont have allergen in their ingredients
    var drinkArray = [];

    let icon = data.current.weather[0].icon;

    // === Conditionals ===
    //Turns weatherAPI input (e.g. '09d') into an ingredient to search by)
    var theIngredient;

    if (icon == '01d') {                           //clear day
        theIngredient = 'lime';
    } else if (icon == '01n') {                    //clear night
        theIngredient = 'bourbon';
    } else if (icon == '02d') {                    //few clouds day
        theIngredient = 'mint';
    } else if (icon == '02n') {                    //few clouds night
        theIngredient = 'soda_water';
    } else if (icon == '03d' || icon == '03n') {   //scattered clouds (day&night)
        theIngredient = 'cranberry_juice';
    } else if (icon == '04d' || icon == '04n') {   //broken clouds (day&night)
        theIngredient = 'dark_rum';
    } else if (icon == '09d' || icon == '09n') {   //rain shower (day&night)
        theIngredient = 'tonic_water';
    } else if (icon == '10d' || icon == '10n') {   //rain (day&night)
        theIngredient = 'sugar';
    } else if (icon == '11d' || icon == '11n') {   //thunderstorm (day&night)
        theIngredient = 'vodka';
    } else if (icon == '13d' || icon == '13n') {   //snow (day&night)
        theIngredient = 'cinnamon';
    } else if (icon == '50d' || icon == '50n') {   //mist (day&night)
        theIngredient = 'milk';
    } else {
        theIngredient = '';
    }

    console.log(theIngredient) //See the ingredient being searched for

    //Fetches data from the CocktailDB by searching by ingredient
    fetch('https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=' + theIngredient)

        .then(data => data.json())

        //data here contains every drink made with 'theIngredient'
        .then(function (data) {

            //we want four drinks out of 'data'
            for (var i = 0; i < 4; i++) {

                //we want those four drinks to be randomly selected
                var tempDrink = data.drinks[Math.floor(Math.random() * data.drinks.length)];

                //console.log(tempDrink); //See the random drink selected out of our data pool

                // === Allergen Testing ===
                //Take the temp drink's id... 
                var tempdrinkId = data.drinks[0].idDrink;
                fetch('https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=' + tempdrinkId)

                .then(resp => resp.json())
                .then(function (resp) {

                    var respTarget = resp.drinks[0]; //This is for pure convenience 

                    //console.log(respTarget.strIngredient1) //See that temp drink's ingredients

                    //...and get it's ingredients to compare to our allergen array
                    for (let w = 1; w < 15; w++) {
                        if (allergiesArray.indexOf(respTarget['strIngredient'+w]) !== -1)   {
                                i--;
                        }
                    }
                })

                // === Repeat Drink Testing ===
                //make sure tempDrink has not already been randomly selected and pushed to drinkArray
                if (drinkArray.indexOf(tempDrink) !== -1) {
                    i--;
                } else {
                    drinkArray.push(tempDrink);
                }
            }

            //console.log(drinkArray) //See the four random, non-repeating, non-allergen-containing, drinks

            //take completed drinkArray, with four rando drinks, and pass it into the displayDrinks function
            displayDrinks(drinkArray);
        })

        .catch(err => console.error(err));

};

//DISPLAY-DRINKS
//Takes our four random drinks containing theIngredient and displays them in the four cards
function displayDrinks(drinkArray) {
    for (var i = 0; i < 4; i++) {
        // DOM selectors for grabbing card elements
        var el = document.querySelector('#img-' + (i + 1));
        var mainnameEl = document.querySelectorAll('.mainname-' + (i + 1));
        var backnameEl = document.querySelectorAll('.backname-' + (i + 1));

        // displays drink pics
        el.setAttribute('src', drinkArray[i].strDrinkThumb);
        el.previousElementSibling.style.background = "url('"+drinkArray[i].strDrinkThumb+"') no-repeat center";

        // displays title names
        mainnameEl[0].innerHTML = drinkArray[i].strDrink + ' <i class="material-icons fa-solid fa-list right"></i>';
        backnameEl[0].innerHTML = drinkArray[i].strDrink + ' <i class="material-icons fa-solid fa-xmark-large right">x</i>';
     

        // gathers each drinks extended details including ingredients, measures of ingredients, and instructions to make
        if (i == 0) {
            fetch('https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=' + drinkArray[i].idDrink)
                .then(response => response.json())
                .then(function (data) {
                    displayDetails(data, 0);
                })
        } else if (i == 1) {
            fetch('https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=' + drinkArray[i].idDrink)
                .then(response => response.json())
                .then(function (data) {
                    displayDetails(data, 1);
                })
        } else if (i == 2) {
            fetch('https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=' + drinkArray[i].idDrink)
                .then(response => response.json())
                .then(function (data) {
                    displayDetails(data, 2);
                })
        } else {
            fetch('https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=' + drinkArray[i].idDrink)
                .then(response => response.json())
                .then(function (data) {
                    displayDetails(data, 3);
                })
        }

    }
}

//DISPLAY-RECIPE-DETAILS
//For each card, take that drinks details and change that card's backside text into our generated string
function displayDetails(data, i) {

    var targetData = data.drinks[0]; //This is for pure convenience 

    // console.log(targetData); //See the extended drink details, e.g. instructions or ingredients

    var allDrinkText = ""; //This will be added to the back of the card. Starts off an empty string.

    //iterate through all 15 potential ingredients + measures in the recipe
    for (let m = 1; m < 15; m++) {
        
        //first off, if strMeasure is something stupid like null or 'Add ' just skip to the else-if part. Otherwise take both values, write them to allDrinkTest and add a line break to the end with '\n'
        if (targetData['strMeasure'+m] !== null && targetData['strMeasure'+m] !== 'Add ') {
            allDrinkText = allDrinkText.concat("Add ", targetData['strMeasure'+m], " of ",targetData['strIngredient'+m], " \n ");
        //So your recipe had something stupid in it. In that case we skip the measures and just list the ingredients bullet point style with a '+'
        } else if (targetData['strIngredient'+m] !== null) {
            allDrinkText = allDrinkText.concat("+ ",targetData['strIngredient'+m], " \n ");
        }
    }

    //Takes all the measures and ingredient text and adds the instructions to the bottom
    allDrinkText = allDrinkText.concat(targetData.strInstructions);
    //Now paste it all into the back of the card's text area
    instrEl[i].innerText = allDrinkText;
}

//RELEASE-BUTTON
//By clicking that you're over 21, the city search button is released
function releaseBtn() {
    theBtn.classList.remove('default');
    modal.classList.add('clicked');
}


// ====================
//      EVENT LISTENERS
// ====================

//Search button gathers input field value and passes it into API Chain
button.addEventListener('click', btnGO);

//If user doesnt like their options, this gives them a fresh pick
reshuffle.addEventListener('click', btnGO);

//This releases the search button. Should only be clicked by someone over 21
modal.addEventListener('click', releaseBtn);

// ====================
//      ASSIST FUNCs
// ====================

//INFANT-ANNIHILATOR
//Removes all children from a node
function infantAnnihilator(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
};

//CAPITALIZE
//Capitalizes the initial character of a string
function capStr(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

//RANDOM NUMBER
//Pass an array as an argument and you'll receive a random number bounnd by the array's length
function getRandomDrink(max) {
    return Math.floor(Math.random() * max);
};


//JUAN DRINK FUNCTION
//Kept for posterity, several capabilities here we may wanna implement after acheiving MVP
// function getDrinks(data) {

//     // INGREDIENTS BY WEATHER
//     // has ingredients sorted in groups by the main weather attributes
//     var rainIngr = ['Gin', 'vodka', 'Apple Juice'];
//     var snowIngr = ['Chocolate', 'Cocoa Powder', 'Eggnog'];
//     var clearIngr = ['Fruit', 'Honey', 'Lemonade'];
//     var cloudyIngr = ['Salt', 'Sour Mix', 'Sweet and Sour'];
//     var freezeNBelow = ['Ale','Apple'];
//     var ingrString = '';
//     console.log(data.current.weather[0].main);
//     // if main equals whatever main, it adds all the clearIngr ingredients to the ingredient string
//     if(data.current.weather[0].main == 'Clear'){
//         for(var i = 0; i < clearIngr.length; i++){
//             ingrString += clearIngr[i] + ',';
//         }
//     }
//     // if temperature <= 32, it adds all the freezeNBelow ingredients to the ingredient string
//     if(data.current.temp <= 32){
//         for(var i = 0; i < freezeNBelow.length; i++){
//             ingrString += freezeNBelow[i] + ',';
//         }
//     }
//     // deletes last comma at the end of string
//     var finalString = ingrString.slice(0,-1);
//     // displays, at most, 5 drinks with the chosen ingredient
//     fetch('https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=' + finalString)
//         .then(function (response) {
//             return response.json();
//         })
//         .then(function (data) {
//             for(var i = 0; i < 5; i++){
//                 console.log(data.drinks[Math.floor(Math.random()*data.drinks.length)]);
//             }
//         })