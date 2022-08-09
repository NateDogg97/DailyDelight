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

    var theIngredient;

           if (icon === '01d'){
        theIngredient = 'lime';
    } else if (icon === '01n'){
        theIngredient = 'bourbon';
    } else if (icon === '02d'){
        theIngredient = 'mint';
    } else if (icon === '02n'){
        theIngredient = 'soda_water';
    } else if (icon === '03d' || '03n'){
        theIngredient = 'cranberry_juice';
    } else if (icon === '04d' || '04n'){
        theIngredient = 'dark_rum';
    } else if (icon === '09d' || '09n'){
        theIngredient = 'tonic_water';
    } else if (icon === '10d' || '10n'){
        theIngredient = 'sugar';
    } else if (icon === '11d' || '11n'){
        theIngredient = 'vodka';
    } else if (icon === '13d' || '13n'){
        theIngredient = 'cinnamon';
    } else if (icon === '50d' || '50n'){
        theIngredient = 'milk';
    } else {
        theIngredient = '';
    }

      fetch('https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=' + theIngredient)

	    .then(data => data.json())

        .then(function(data){
            
            for(var i = 0; i < 5; i++){
                var tempDrink = data.drinks[Math.floor(Math.random()*data.drinks.length)];
                console.log(tempDrink);

                if (drinkArray.indexOf(tempDrink) !== -1){
                    i--;
                } else {
                    drinkArray.push(tempDrink);
                }               
            }

            displayDrinks(drinkArray);                     
        })

        .catch(err => console.error(err));

        
};

//===================
//   Juan's Code   //
//===================

var firstImgEl = document.querySelector('#img-1');
var secondImgEl = document.querySelector('#img-2');
var thirdImgEl = document.querySelector('#img-3');
var fourthImgEl = document.querySelector('#img-4');
function displayDrinks(drinkArray) {
    for(var i = 0; i < 4; i++){
        var el = document.querySelector('#img-' + (i+1));
        el.setAttribute('src', drinkArray[i].strDrinkThumb);
    }
}
