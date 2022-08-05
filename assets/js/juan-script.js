
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

    var LONGLATurl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + locationName + '&limit=1&appid=3b3319e2a4bdc403d7f45843c07de674';
    
    const geoData = fetch(LONGLATurl)

    .then(function (response) {
        return response.json();
    })

    //We now have the LATITUDE and LOGITUDE of our city
    .then((data) => {
        console.log(data); //See the data from the Geocoding API
        return [data[0].lat, data[0].lon];
    });

    //Takes those Coords and passes them into the two APIs for display on the site
    const giveLongLats = () => {
        geoData.then((a) => {
            // Call a function to update cityBox and make a history button 
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

    const blah = fetch(currentURL)

        .then(function (response) {
            return response.json();
    })

        .then(function (data) {
            console.log(data);
            // let theIcon = data.current.weather.icon;
            let theIcon = '01d';
            return theIcon
    });

    const doNatesFunc = () => {
        blah.then((theIcon) => {
            // Call a function to update cityBox and make a history button 
            recommendItem(theIcon);
            });
    };

    doNatesFunc();

};

// ====================
//      EVENT LISTENERS
// ====================

//Search button gathers input field value and passes it into API Chain
button.addEventListener('click', btnGO);

// Example of a variable we can use to filter the fetch Url //
// The advantage of using a variable like this is the we can code functions that
// alter the value of this variable to fit the user's prefernces //
var clearSky = 'ice%2Clime_juice'
var clearSkyNight = 'bourbon'

function getRandomDrink(max) {
    return Math.floor(Math.random() * max);
};

const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '7d2a540bc0mshf6af0c1a2ca6a06p12ec6cjsn89fc7b5edd84',
		'X-RapidAPI-Host': 'the-cocktail-db.p.rapidapi.com'
	}
};

function recommendItem(icon) {
    var drinkArray = [];
    if (icon === '01d'){

      fetch('https://www.thecocktaildb.com/api/json/v1/1/filter.php?i='+clearSkyNight)
                                                        // Filter is here //
        // An opportunity for added complexity lies in the way we filter the response //
	    .then(data => data.json())
	    // .then(response => console.log(response))

        // This chooses a random drink from the list of drinks returned from the cocktail API
        .then(function(data){
            
            for(var i = 0; i < 5; i++){
                var tempDrink = data.drinks[Math.floor(Math.random()*data.drinks.length)];
                console.log(tempDrink);
                drinkArray.push(tempDrink);
            }
            var choice = getRandomDrink(data.drinks.length);
            
        // The goal here is to return the drink name and image from the API so we can use it somewhere else
            displayDrinks(drinkArray);
        })

        .catch(err => console.error(err));

    }
};

function displayDrinks(drinkArray) {
    var instructionArray = [];
    var t = '';
    for(var i = 0; i < 4; i++){
        var imgEl = document.querySelector('#img-' + (i+1));
        var nameEl = document.querySelectorAll('.name-' + (i+1));
        // displays the image
        imgEl.setAttribute('src', drinkArray[i].strDrinkThumb);
        // displays title names
        for(var x = 0; x < 2; x++){
            nameEl[x].textContent = drinkArray[i].strDrink;
        }


        // getting instructions
        var instrEl = document.querySelectorAll('.instr');
        const instruction = fetch('https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=' + drinkArray[i].idDrink)
            .then(response => response.json())
            .then(function (data) {
               return data.drinks[0].strInstructions;
            }) 
        const instr = async() => {
            const a = await instruction;
            return a;
        };
        
    }
}



function getDrinks(data) {
    console.log(data);
    // INGREDIENTS BY TEMP
    // var temp = data.current.temp;
    // var ingredients = '';
    // if(temp > 80) {
    //     ingredients += 'ice';
    // }
    // fetch('https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=' + ingredients)
    //     .then(function (response) {
    //         return response.json();
    //     })
    //     .then(function (data) {
    //         for(var i = 0; i < 5; i++){
    //             console.log(data.drinks[Math.floor(Math.random()*data.drinks.length)]);
    //         }
    //     })

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
}