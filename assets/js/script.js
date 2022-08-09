
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

// ====================
//   INITIALIZATIONS
// ==================== 

var locationName;

// ====================
//      FUNCTIONS
// ====================

//BTN-GO
//Search Button Calls this function which begins the API Chain
function btnGO() {

    locationName = String(userInput.value);
    console.log(locationName);

    geocodingAPI(locationName); //UNCOMMENT AFTER DEV COMPLETE

    //let icon = '';  //REMOVE THIS LINE AND NEXT AFTER DEV
    //ingredientAPI(icon); //For dev, bypass openweatherAPI chain entirely and just use CocktailDB
};

function geocodingAPI(locationName) {
    var LONGLATurl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + locationName + '&limit=1&appid=3b3319e2a4bdc403d7f45843c07de674';

    //Write our fetch request function as an expression
    const geoData = fetch(LONGLATurl)

        .then(function (response) {
            return response.json();
        })

        //We now have the LATITUDE and LOGITUDE of our city
        .then((data) => {
            console.log(data); //See the data from the Geocoding API
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

    var currentURL = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + Lat + '&lon=' + Lon + '&exclude=minutely,hourly,daily,alerts&appid=3b3319e2a4bdc403d7f45843c07de674';

    //Makes the fetch current weather function an expression that is manipulatable
    const cityWeather = fetch(currentURL)

        .then(function (response) {
            return response.json();
        })

        //We now have the current weather data as the variable 'data'
        .then(function (data) {
            console.log(data); //See data from the OneCall API
            let theIcon = data.current.weather.icon; //From that data we can get a snapshot in the form of the weather icon
            return theIcon
        });

    //Now we pass the weather icon to the ingredientAPI
    const passtoCocktailDB = () => {
        cityWeather.then((theIcon) => {
            ingredientAPI(theIcon);
        });
    };

    passtoCocktailDB();

};

//COCKTAIL-INGREDIENT-API
//Takes the icon from weather API, turns that into a cocktail ingredient, then searches based on that ingredient
function ingredientAPI(icon) {

    var drinkArray = [];

    var theIngredient;

    if (icon === '01d') {
        theIngredient = 'lime';
    } else if (icon === '01n') {
        theIngredient = 'bourbon';
    } else if (icon === '02d') {
        theIngredient = 'mint';
    } else if (icon === '02n') {
        theIngredient = 'soda_water';
    } else if (icon === '03d' || '03n') {
        theIngredient = 'cranberry_juice';
    } else if (icon === '04d' || '04n') {
        theIngredient = 'dark_rum';
    } else if (icon === '09d' || '09n') {
        theIngredient = 'tonic_water';
    } else if (icon === '10d' || '10n') {
        theIngredient = 'sugar';
    } else if (icon === '11d' || '11n') {
        theIngredient = 'vodka';
    } else if (icon === '13d' || '13n') {
        theIngredient = 'cinnamon';
    } else if (icon === '50d' || '50n') {
        theIngredient = 'milk';
    } else {
        theIngredient = '';
    }

    //Fetches data from the CocktailDB by searching by ingredient
    fetch('https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=' + theIngredient)

        .then(data => data.json())

        .then(function (data) {

            for (var i = 0; i < 5; i++) {
                var tempDrink = data.drinks[Math.floor(Math.random() * data.drinks.length)];
                console.log(tempDrink);

                if (drinkArray.indexOf(tempDrink) !== -1) {
                    i--;
                } else {
                    drinkArray.push(tempDrink);
                }
            }

            displayDrinks(drinkArray);
        })

        .catch(err => console.error(err));


};

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
     

        // getting instructions
        if (i == 0) {
            fetch('https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=' + drinkArray[i].idDrink)
                .then(response => response.json())
                .then(function (data) {
                    console.log(data);
                    displayInstr(data, 0);
                })
        } else if (i == 1) {
            fetch('https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=' + drinkArray[i].idDrink)
                .then(response => response.json())
                .then(function (data) {
                    console.log(data);
                    displayInstr(data, 1);
                })
        } else if (i == 2) {
            fetch('https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=' + drinkArray[i].idDrink)
                .then(response => response.json())
                .then(function (data) {
                    console.log(data);
                    displayInstr(data, 2);
                })
        } else {
            fetch('https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=' + drinkArray[i].idDrink)
                .then(response => response.json())
                .then(function (data) {
                    console.log(data);
                    displayInstr(data, 3);
                })
        }

    }
}

function displayInstr(data, i) {
    instrEl[i].innerText = data.drinks[0].strInstructions;
}

//CONDITIONALS
//These variables make ingredientAPI work
var clearSky = 'lime_juice'
var clearSkyNight = 'bourbon'


//COCKTAIL-ID-API
//Takes the ID from the ingredient API and gives back all the drink details
// function cocktailAPI(ID) {
// }


// ====================
//      EVENT LISTENERS
// ====================

//Search button gathers input field value and passes it into API Chain
button.addEventListener('click', btnGO);
reshuffle.addEventListener('click', btnGO);

// ====================
//      ASSIST FUNCs
// ====================

//INFANT ANNIHILATOR
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