/*
* This file runs the server.
* Type npm start in the terminal to start it on the port selected in line 10
*/

var express = require('express'); 
var app = express();
const path = require('path'); 
var cors = require('cors'); 
const port = 3001

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

const categories = require('./routes/categories.route')
app.use('/categories', categories)

var server = app.listen(port, function(error){
    if (error) throw error;
    console.log("Express server listening on port, ", port)
});

module.exports = server
//TO CLOSE DOWN A SERVER PRESS CTRL + C
