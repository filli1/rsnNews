//lave funktioner der kan hente temp, vejrkode, sunrise, sunset, og 7 dage frem
const { executeSQL } = require('../database/db_connect');

//This function gets the weather for the current day
exports.getForecast = (req, res) => {
    //Gets the current date
    let today = new Date();
    today = today.toISOString().slice(0, 10);

    //executes the SQL query
    executeSQL(`Select * FROM weather WHERE datekey >= '${today}'`)
        .then(result => {
            //creates an empty object to store the response from the database in an understandable format
            let weather = {}
            //The purpose of this loop is to format the sunrise/sunset time to the correct timezone
            for (const element in result) {
                let sunriseThisDay = new Date(result[element].sunrise)
                sunriseThisDay.setHours(sunriseThisDay.getHours() + 1)
                sunriseThisDay = sunriseThisDay.toLocaleTimeString('da-DK', { timeZone: 'Europe/Copenhagen' })
                let sunsetThisDay = new Date(result[element].sunset)
                sunsetThisDay.setHours(sunsetThisDay.getHours() + 1)
                sunsetThisDay = sunsetThisDay.toLocaleTimeString('da-DK', { timeZone: 'Europe/Copenhagen' })

                //Stores the current date, temperature, weather code, sunrise and sunset in the weather object
                weather[element] = {
                    datekey: result[element].dateKey,
                    temp: result[element].temperature,
                    weatherCode: result[element].weatherCode,
                    sunrise: sunriseThisDay,
                    sunset: sunsetThisDay
                }
            }
            //returns the weather object
            return res.status(200).send(weather)
        })
        .catch(error => {
            return res.status(500).send(error)
        })

    

    
}

exports.getCurrentWeather = (req, res) => {
    //Gets the current date
    let today = new Date();
    today = today.toISOString().slice(0, 10);

    //executes the SQL query
    executeSQL(`SELECT * FROM weather WHERE dateKey = '${today}'`)
        .then(result => {
            let sunriseThisDay = new Date(result[1].sunrise)
            sunriseThisDay.setHours(sunriseThisDay.getHours() + 1)
            result[1].sunrise = sunriseThisDay.toLocaleTimeString('da-DK', { timeZone: 'Europe/Copenhagen' })

            let sunsetThisDay = new Date(result[1].sunset)
            sunsetThisDay.setHours(sunsetThisDay.getHours() + 1)
            result[1].sunset = sunsetThisDay.toLocaleTimeString('da-DK', { timeZone: 'Europe/Copenhagen' })

            //returns the temperature
            return res.status(200).send(result[1])
        })
        .catch(error => {
            console.log(error)
            return res.status(500).send(error)
        })
}