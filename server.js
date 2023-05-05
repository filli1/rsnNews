/*
* This file runs the server.
* Type node server.js in the terminal to start it on the port selected in line 10
*/

var express = require('express'); 
var app = express();
const path = require('path'); 
var cors = require('cors'); 
const port = 3001

//Configure CORS - This has not been implemented

app.use(cors({
    preflightContinue: false,
    credentials: true, 
    exposedHeaders: ['country', 'Authorization'],
    allowedHeaders: ['country', 'Authorization'],
    methods: ['GET'],
    optionsSuccessStatus: 204,
    origin: ['https://api.open-meteo.com/v1/forecast','https://newsapi.org/v2/top-headlines']
}))

app.use(express.json());

//Server resources from public folder
app.use('/static', express.static('public'))

//root serves Index file
app.get('/', function(req, res, next) {
    //console.log(res)
    res.sendFile(path.join(__dirname, '/index.html'));
});

var server = app.listen(port, function(error){
    if (error) throw error;
    console.log("Express server listening on port, ", port)
});
const users = require('./routes/users.route')
app.use('/users', users)

const news = require('./routes/news.route')
app.use('/news', news)

const weather = require('./routes/weather.route')
app.use('/weather', weather)
//TO CLOSE DOWN A SERVER PRESS CTRL + C