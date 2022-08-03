
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

    fetch(currentURL)

        .then(function (response) {
            return response.json();
    })

        .then(function (data) {
            console.log(data);

    });
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
}

const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '7d2a540bc0mshf6af0c1a2ca6a06p12ec6cjsn89fc7b5edd84',
		'X-RapidAPI-Host': 'the-cocktail-db.p.rapidapi.com'
	}
};

function recommendItem() {
    if (i/* WeatherApi.current.weather.icon*/ === '01d'){

      fetch('https://the-cocktail-db.p.rapidapi.com/filter.php?i=ice', options)
                                                        // Filter is here //
        // An opportunity for added complexity lies in the way we filter the response //
	    .then(response => response.json())
	    .then(response => console.log(response))

        // This chooses a random drink from the list of drinks returned from the cocktail API
        .then(function(data){
            var choice = getRandomDrink(data.drinks.length);
            console.log(data[choice]);
            
        // The goal here is to return the drink name and image from the API so we can use it somewhere else
            return [data[choice].strDrink, data[choice].strDrinkThumb];
        })

        .catch(err => console.error(err));

    }
}
