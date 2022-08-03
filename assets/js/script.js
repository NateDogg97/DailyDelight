
var button = document.getElementById('searchBtn');
var userInput = document.getElementById('search-input');

var locationName;

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

    //Probably don't need this and just have the function automatically get called above...
    giveLongLats();
};

function currentAPI(Lat, Lon) {

    var currentURL = 'https://api.openweathermap.org/data/2.5/onecall?lat='+Lat+'&lon='+Lon+'&units=imperial&exclude=minutely,hourly,daily,alerts&appid=3b3319e2a4bdc403d7f45843c07de674';

    fetch(currentURL)

        .then(function (response) {
            return response.json();
    })

        .then(function (data) {
            getDrinks(data);

    });
};

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

button.addEventListener('click', btnGO);

