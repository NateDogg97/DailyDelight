// ====================
//      IMPORTS
// ====================

//import * as X from "Y";

// ====================
//  ACCESS HTML BY DOM
// ====================

var button = document.getElementById('searchBtn');
var userInput = document.getElementById('locSearch');

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

    // geocodingAPI(locationName); //UNCOMMENT AFTER DEV COMPLETE

    let icon = '01d';  //REMOVE THIS LINE AND NEXT AFTER DEV
    ingredientAPI(icon); //For dev, bypass openweatherAPI chain entirely and just use CocktailDB
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

    var currentURL = 'https://api.openweathermap.org/data/2.5/onecall?lat='+Lat+'&lon='+Lon+'&exclude=minutely,hourly,daily,alerts&appid=3b3319e2a4bdc403d7f45843c07de674';

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

    var theIngredient;

    //CONDITIONALS
    if (icon === '01d'){
        theIngredient = 'mint';
    };

    //Fetches data from the CocktailDB by searching by ingredient
    fetch('https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=' + theIngredient)

	    .then(data => data.json())  

        //Data is all drinks containing 'theIngredient'
        .then(function(data){
          
            //Gives four random drinks out of all those drinks in data
            for(var i = 0; i < 4; i++){

                //This is a random drink object from our big pile o' relevent drinks
                randoDrink = getRandomDrink(data);

                //This is where a function that changes the cards HTML to the drink data goes
                change_front_of_Cards(i, randoDrink);
                
                //Get the ID from the object to pass into the next function
                var drinkStuff = Object.values(randoDrink);
                var drinkID = drinkStuff[2];

                //Now to pass off the cocktail-ID, get that data, and paste it into the hidden pull-up card
                ccktIDAPI(i, drinkID);
            }

            //return [data[choice].strDrink, data[choice].strDrinkThumb];
        })

        //Incase promises are unkept
        .catch(err => console.error(err));

};

//CHANGE-CARD-FRONT
//For-loop index is used to grab the correct card and change its HTML to the info
function change_front_of_Cards(i, data) {

    console.log(data);

    // var theCard = document.getElementbyID('debugCard'+i);
    //then stuff that:
    //Changes the pic
    //Changes the card title
    //yada blah yada blah
};

//COCKTAIL-ID-API
//Takes the ID from the ingredient API and gives back all the drink details www.thecocktaildb.com/api/json/v1/1/lookup.php?i=11007
function ccktIDAPI(i, drinkID) {

    //Fetches data from the CocktailDB by searching by ingredient
    fetch('https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=' + drinkID)

	    .then(data => data.json())  

        //Data is all drinks containing 'theIngredient'
        .then(function(data){

            console.log(data);
            
                // var theCard = document.getElementbyID('debugCard'+i);
                //then stuff that:
                //if (!strVideo) {
                //     'Sorry, no video available'
                // } else {
                //     Post the video 
                // }
                //Changes the card title
                //Drink mixing instructions
        })

        //Incase promises are unkept
        .catch(err => console.error(err));

};


// ====================
//      EVENT LISTENERS
// ====================

//Search button gathers input field value and passes it into API Chain
button.addEventListener('click', btnGO);

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

//RANDOM DRINK
//Pass in an array with a list of drinks and you'll get a random one back as an object
function getRandomDrink(data) {
    return data.drinks[Math.floor(Math.random() * data.drinks.length)];
}


//JUAN DRINK FUNCTION
//Kept for posterity, several capabilities here we may wanna implement after acheiving MVP
function getDrinks(data) {

    // INGREDIENTS BY WEATHER
    // has ingredients sorted in groups by the main weather attributes
    var rainIngr = ['Gin', 'vodka', 'Apple Juice'];
    var snowIngr = ['Chocolate', 'Cocoa Powder', 'Eggnog'];
    var clearIngr = ['Fruit', 'Honey', 'Lemonade'];
    var cloudyIngr = ['Salt', 'Sour Mix', 'Sweet and Sour'];
    var freezeNBelow = ['Ale','Apple'];
    var ingrString = '';
    console.log(data.current.weather[0].main);
    // if main equals whatever main, it adds all the clearIngr ingredients to the ingredient string
    if(data.current.weather[0].main == 'Clear'){
        for(var i = 0; i < clearIngr.length; i++){
            ingrString += clearIngr[i] + ',';
        }
    }
    // if temperature <= 32, it adds all the freezeNBelow ingredients to the ingredient string
    if(data.current.temp <= 32){
        for(var i = 0; i < freezeNBelow.length; i++){
            ingrString += freezeNBelow[i] + ',';
        }
    }
    // deletes last comma at the end of string
    var finalString = ingrString.slice(0,-1);
    // displays, at most, 5 drinks with the chosen ingredient
    fetch('https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=' + finalString)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            for(var i = 0; i < 5; i++){
                console.log(data.drinks[Math.floor(Math.random()*data.drinks.length)]);
            }
        })
};