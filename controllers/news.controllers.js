//en funktion der kan hente alle artikler, 
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;

// Retrieves the config file
const config = require('../database/config.json');

// Connects to the database 
const connection = new Connection(config);

//Checks if the connection is successful
connection.on('connect', function(err) {
    if(err){
        //logs the error if any
        console.log(err)
        return
    } 
    //The getNews function is called upon when the connection has been succesful, to avoid being called before the connection is established.
    getNews();

});


//The connection is established
connection.connect()

    // runs a simple query to select all news articles
    function getNews(req, res){
    const requestNews = new Request("SELECT TOP 10 * FROM news ORDER BY publishedAt DESC", function(err, rowCount) {
        if (err) {
            console.log(err);
        } else {
            console.log(rowCount + ' rows');
        }
        // close the connection
        connection.close(); //Skal jeg connecte og close for hver query, hvordan? Har ikke gjort noget på de andre endnu
    });
    // Adds the results to an empty array, rows.
    const rows = [];
    requestNews.on('row', function(columns) {
        const row = {};
        columns.forEach(function(column) {
            row[column.metadata.colName] = column.value;
            if (rows.length >= 10) {
                rows.shift(); // remove the first element from the array if there are more than 10 rows
                
            }
        });
        rows.push(row);
    });
    //executes the request
    connection.execSql(requestNews);
    }
module.exports = {getNews};
    


//hente og tælle likes fra like tabel, så den tæller hvor mange gange en artikel er i tabellen (jeg er overhovedet ikke sikker på denne)
function getLikes(req, res){
const requestLikes = new Request("SELECT article_id, COUNT(*) as likes_count FROM likes GROUP BY article_id'", function(err, rowCount, rows) {
    if (err) {
        console.error(err);
        return;
      }
      const likesCount = rows.map(row => ({
        articleId: row.article_id.value,
        likesCount: row.likes_count.value
      }));
  
  res.json(likesCount);
});

connection.execSql(requestLikes);
}
module.exports = {getLikes};

//fjerne likes, user id og newsid
const requestUnlike = new Request(`DELETE FROM likes WHERE articleId = @articleId AND userId = @userId;`, function(err, rowCount) {
    if (err) {
        console.error(err);
        return;
    }
    console.log(`${rowCount} row(s) deleted from likes table.`);
});

//Values for the query 
requestUnlike.addParameter('articleId', TYPES.Int, articleId);
requestUnlike.addParameter('userId', TYPES.Int, userId);

connection.execSql(request);

