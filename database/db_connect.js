var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
//Retrieves the config file
const config = require('./config.json');

//Executes the SQL query with an async function
function executeSQL(query) {
    //returns a promise for data
    return new Promise((resolve, reject) => {
        var connection = new Connection(config)

        //makes the SQL request to the database
        connection.on('connect', function(err) {
            if(err){
                console.log(err);
                reject(err);
            } else {
                request = new Request(query, function(err, rowCount){
                    if(err){
                        //logs error if any
                        console.log(err);
                    } else {
                        if (query.trim().toUpperCase().startsWith("SELECT")) {
                            resolve(response);
                        } else if (query.trim().toUpperCase().startsWith("INSERT INTO USERS")){
                            resolve({message: "User added to database"});
                        } else if (
                            query.trim().toUpperCase().startsWith("UPDATE") &&
                            rowCount === 0 || query.trim().toUpperCase().startsWith("DELETE") && rowCount === 0
                          ) {
                            reject("User not found");
                          }
                        else {
                            resolve({ affectedRows: rowCount });
                        }
                    }
                })

                //creates an empty object to store the response from the database in an understandable format
                var counter = 1 
                response = {}
                let outputInserted = false;

                request.on('row',function(columns){
                    if (query.trim().toUpperCase().startsWith("SELECT")) {
                        response[counter] = {}
                        //for each column in the row, it adds the column name and value to the response object
                        columns.forEach(function(column){
                            response[counter][column.metadata.colName] = column.value
                        })
                        //increments the counter by 1
                        counter += 1;
                    } else if (query.trim().toUpperCase().startsWith("INSERT INTO USERS") && !outputInserted) {
                        outputInserted = true;
                        response['userID'] = columns[0].value;
                    }
                })

                request.on('requestCompleted', function() {
                    //closes the connection
                    connection.close();
                    //resolves the promise
                    resolve(response);
                })

                //executes the SQL request
                connection.execSql(request);

            }
        });
        // Establishes the connection
        connection.connect();
    });

}

//Exports a function to execute the an SQL query
module.exports = {
    executeSQL: executeSQL
}