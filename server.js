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
    origin: ['http://localhost:3001','http://127.0.0.1:3001']
}))

app.use(express.json());

//Server resources from public folder
app.use('/static', express.static('public'))

//root serves Index file
app.get('/', function(req, res, next) {
    //console.log(res)
    res.sendFile(path.join(__dirname, '/index.html'));
});

const users = require('./routes/users.route')
app.use('/users', users)

const news = require('./routes/news.route')
app.use('/news', news)

const weather = require('./routes/weather.route')
app.use('/weather', weather)

var server = app.listen(port, /* '192.168.68.61', */ function(error){
    if (error) throw error;
    console.log("Express server listening on port, ", port)
});

module.exports = server
//TO CLOSE DOWN A SERVER PRESS CTRL + C