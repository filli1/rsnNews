var Connection = require('tedious').Connection;
var Request = require('tedious').Request;

//Retrieves the config file
const config = require('./config.json');

//Connects to the database
var connection = new Connection(config)

//Checks if the connection is successful
connection.on('connect', function(err) {
    if(err){
        //logs the error if any
        console.log(err)
    } else {
        //logs the success message
        console.log("Connected")
        //executes the SQL query with the async function executeSQL()
        executeSQL()  
            .then(response => { // <- this is the response from the promise
                console.log(response)
            }) 
            .catch(error => { // <- If an error occurs this catches it
                console.log(error)
            })
    }
});

//The connection is established
connection.connect()

//Executes the SQL query with an async function
function executeSQL() {
    //returns a promise for data
    return new Promise((resolve, reject) => {
        //makes the SQL request to the database
        request = new Request("SELECT * FROM news", function(err){
            if(err){
                //logs error if any
                console.log(err);
            }
        })

        //creates an empty object to store the response from the database in an understandable format
        var counter = 1 
        response = {}

        //creates an entry in the response object for each row in the database
        request.on('row',function(columns){
            response[counter] = {}
            //for each column in the row, it adds the column name and value to the response object
            columns.forEach(function(column){
                response[counter][column.metadata.colName] = column.value
            })
            //increments the counter by 1
            counter += 1;
        })

        request.on('requestCompleted', function() {
            //closes the connection
            connection.close()
            //resolves the promise
            resolve(response)
        })
        
        //executes the SQL request
        connection.execSql(request);
    })

}
