var Connection = require('tedious').Connection;
var Request = require('tedious').Request;

const config = require('./config.json');
var connection = new Connection(config)

connection.on('connect', function(err) {
    if(err){
        console.log(err)
    } else {
        console.log("Connected")
    }
});

connection.connect()

function executeSQL() {
    request = new Request("SELECT * FROM likes", function(err){
        if(err){
            console.log(err);
        }
    })
}

////////
