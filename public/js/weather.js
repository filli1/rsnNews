//The URL to retrieve the weather from
let forecastUrl = '/weather'
let weatherUrl = '/weather/currentweather'

//This function interpretes the weathercode from the API call
function weatherCode(ww){
    //Interpreted using: https://open-meteo.com/en/docs#:~:text=Weather%20variable%20documentation-,WMO,-Weather%20interpretation%20codes
    if(ww==0 || ww==1){
        //Returns both a description of the weather and the path to the symbol img
        return ['Klart vejr','static/img/sunny.png']
    } else if (ww==2 || ww==3){
        return ['Skyet','static/img/cloud.png']
    } else if (ww==45 || ww==48) {
        return ['Tåget','static/img/fog.png']
    } else if ((ww>=51 && ww<=55) || (ww>=61 && ww<=65) || (ww>=80 && ww<=82)) {
        return ['Regn','static/img/rain.png']
    } else if (ww==56 || ww==57 || (ww>=66 && ww<=77) || ww==85 || ww==86) {
        return ['Sne','static/img/snow.png']
    } else {
        return ['Torden','static/img/storm.png']
    }
}

//This function gets the weather from the API endpoint
const weather = async () => {
    try {
        let response = await fetch(weatherUrl, 
            {
                method: 'GET'
            }
        );
            //Error handling
        if (response.status != 200) {
            throw new Error('Request not succesful, expected 200, got: '+response.status)
        } //Returns the response
        return response.json();
    }  //Error handling
    catch (error) {
        console.log('Failed making the request. '+error)
    }
}

const weatherForecast = async () => {
    try {
        let response = await fetch(forecastUrl, 
            {
                method: 'GET'
            }
        );
        // Error handling
        if (response.status != 200) {
            throw new Error('Request not succesful, expected 200, got: ' + response.status);
        }
        // Returns the response
        return response.json();
    } catch (error) {
        console.log('Failed making the request. ' + error);
    }
};

//This function returns the name of the weekday (string) in the given locale
function getDayName(dateStr, locale) {
    // create a date object from the ISO date string
    const date = new Date(dateStr);
    // extract the day of the week from the date object
    const dayOfWeek = date.getUTCDay();
    // create an array of weekday names based on the provided locale
    const weekdays = new Array(7);
    weekdays[0] = new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(new Date('1970-01-04')); // Søndag
    weekdays[1] = new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(new Date('1970-01-05')); // Mandag
    weekdays[2] = new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(new Date('1970-01-06')); // Tirsdag
    weekdays[3] = new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(new Date('1970-01-07')); // Onsdag
    weekdays[4] = new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(new Date('1970-01-01')); // Torsdag
    weekdays[5] = new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(new Date('1970-01-02')); // Fredag
    weekdays[6] = new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(new Date('1970-01-03')); // Lørdag
    // return the weekday name based on the day of the week
    return weekdays[dayOfWeek];
  }
  


//Empty variable of the weather
let weatherResult;


const getWeather = async () => {
    // Populates the weatherResult
    weatherResult = (await weather());
    
    // Creates an object for the weather at the time of the function call
    let weatherNow = {
        temperature: Math.round(weatherResult.temperature),
        weatherCondition: weatherCode(weatherResult.weatherCode),
        sunrise: weatherResult.sunrise, // <- Sunrise and sunset is retrieved using the daily forecast
        sunset: weatherResult.sunset
    };

    // Get forecast data
    let forecastData = await weatherForecast();

    // Creates an empty array containing the forecast
    let forecast = [];
    
    
    // Iterate through forecast data
    for (let day in forecastData) {
        // Call the push method on the forecast array
        forecast.push({
            weekday: getDayName(forecastData[day].datekey, "da-DK").substring(0, 3).toUpperCase(),
            weatherCondition: weatherCode(forecastData[day].weatherCode),
            temperature: forecastData[day].temp
            
        });
  
    }

    // Creates an object for returning both the current weather and the forecast
    let weatherReturn = {
        now: weatherNow,
        forecast: forecast
    };

    // Returns the weather
    return weatherReturn;
    
}


//This function is inserting the weather into the widgets
const insertWeather = async () => {
    //Gets the weather
    let weather = await getWeather();

    //Current weather
    let weatherSymbolNow = document.getElementById("weatherSymbol")
    weatherSymbolNow.setAttribute('src',weather.now.weatherCondition[1])

    let temperatureNow = document.getElementById("temperature")
    temperatureNow.innerHTML = weather.now.temperature+"°"

    let sunrise = document.getElementById("sunriseTime")
    sunrise.innerHTML = weather.now.sunrise

    let sunset = document.getElementById("sunsetTime")
    sunset.innerHTML = weather.now.sunset 
    //Forecast
    const table = document.getElementById('forecastTableBody')
    //empties the table
    table.innerHTML = ''
    let rowElement;
    let cell;
    //The table is to have 3 rows
    for(let row=0; row<3; row++){
        //Creates the row element
        rowElement = document.createElement("tr")
        //Each row is to have 7 cells (columns)
        for(let col=0; col<7; col++){
            //If in the top row create a header cell, if not create standard td cell
            cell = document.createElement((row===0?'th':'td'))
            if(row===0){
                //If in top row we will populate the cells with the weekday
                let cellText = document.createTextNode(weather.forecast[col].weekday)
                cell.appendChild(cellText)
            } else if (row===1) {
                //If in the middle row populate the cells with the symbol of the weather, and alt text of the condition
                let symbol = document.createElement('img')
                symbol.setAttribute('src', weather.forecast[col].weatherCondition[1])
                symbol.setAttribute('alt', weather.forecast[col].weatherCondition[0])
                cell.appendChild(symbol)
            } else {
                //If in the last row populate the cells with the days maximum temperature
                let cellText = document.createTextNode(weather.forecast[col].temperature+'°')
                cell.appendChild(cellText)

            }
            //Append the cell to the row
            rowElement.appendChild(cell)
        }
        //Append the row to the table
        table.appendChild(rowElement)
    }
}