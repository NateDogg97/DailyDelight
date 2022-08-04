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

      fetch('https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=ice')

	    .then(data => data.json())

        .then(function(data){
            
            for(var i = 0; i < 5; i++){
                console.log(data.drinks[getRandomDrink(data.drinks.length)]);
                console.log(data.drinks[i].strDrink);
                return 
            }                      
        })

        .catch(err => console.error(err));

    
};