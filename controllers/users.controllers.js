
//en der kan hente og fjerne favoritartikler MANGLER
var Connection = require('tedious').Connection
var Request = require('tedious').Request

//Retrieves the config file 
const config = require('../database/config.json')

//Connects to the database
const connection = new Connection(config)

//Checks if the connection is successful
connection.on('connect', function(err){
    if(err){
        //logs the error if any
        console.log(err)
        return
    }
    else {
        console.log("succesfully connected")
    }
    connection.close();
})
connection.connect()

function getAllUsers(req, res) {
    const allUsers = []
    const requestAllUsers = new Request("SELECT userid FROM users", function(err, rowCount){
    if (err) {
        console.log(err)
    }
    else {
        console.log(allUsers)
        res.json(allUsers);
    }
    });
    requestAllUsers.on("row", function(columns){
        allUsers.push(columns[0].value);
    });
    connection.execSql(requestAllUsers);
}
module.exports = getAllUsers

function getUserbyID(req, res, userId) {
    const requestUser = new Request('SELECT FROM users WHERE userid = @userId', function(err, rows){
        if (err){
            console.log(err)
        } else {
            res.json(rows)
        }
      
    })
    requestUser.addParameter('userId', TYPES.Int, userId);
    connection.execSql(requestUser)
}
module.exports = {getUserbyID}

function addReadArticle(req, res) {
    const { articleId, userId } = req.body;
  
    const requestAddReadArticle = new Request(`INSERT INTO readarticles (userID, articleID) VALUES (@userId, @articleId);`, function(err, rowCount) {
      if (err) {
        console.error(err);
        return;
      }
      console.log(`${rowCount} row(s) inserted into readarticles table.`);
      res.sendStatus(200);
    });
    requestAddReadArticle.addParameter('userId', TYPES.Int, userId);
    requestAddReadArticle.addParameter('articleId', TYPES.Int, articleId);
    connection.execSql(requestAddReadArticle);
  }
  
  module.exports = {addReadArticle};

  function getReadArticles(req, res) {
    const request = new Request('SELECT * FROM readarticles', (err, rowCount, rows) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(`${rowCount} rows returned.`)
      res.json(rows);
    });
  
    connection.execSql(request);
  }
  
  module.exports = {getReadArticles};
  
  //Tilføje en bruger 
  function addUser(req, res) {
    const {nationality, firstname, lastname, email, password} = req.body;
  
    const requestAddUser = new Request(
      `INSERT INTO users (nationality, firstname, lastname, email, password) VALUES (@nationality, @firstname, @lastname, @email, 
      @password); SELECT SCOPE_IDENTITY() AS userId;`,
      function(err, rowCount) {
        if (err) {
          console.error(err);
          return;
        }
        console.log(`${rowCount} rows inserted`);
      }
    );
    requestAddUser.addParameter('nationality', TYPES.VarChar, nationality);
    requestAddUser.addParameter('firstname', TYPES.VarChar, firstname);
    requestAddUser.addParameter('lastname', TYPES.VarChar, lastname);
    requestAddUser.addParameter('email', TYPES.VarChar, email);
    requestAddUser.addParameter('password', TYPES.VarChar, password);
  
    requestAddUser.on('returnValue', function(parameterName, value, metadata) {
      console.log(`New user added with userId ${value}.`);
    });
    connection.execSql(requestAddUser);
  }
  module.exports = {addUser};

//Opdatere en bruger
function updateUser(req, res) {
    const { userId, firstName, lastName, nationality, email, password } = req.body;
    const requestUpdate = new Request(`UPDATE users SET firstName = @firstName, lastName = @lastName, nationality = @nationality, email = @email, password = @password WHERE userId = @userId;`, function (err, rowCount) {
      if (err) {
        console.error(err);
        return;
      }
      console.log(`${rowCount} row(s) updated in users table.`);
    });
    requestUpdate.addParameter('userId', TYPES.Int, userId);
    requestUpdate.addParameter('firstName', TYPES.VarChar, firstName);
    requestUpdate.addParameter('lastName', TYPES.VarChar, lastName);
    requestUpdate.addParameter('nationality', TYPES.VarChar, nationality);
    requestUpdate.addParameter('email', TYPES.VarChar, email);
    requestUpdate.addParameter('password', TYPES.VarChar, password);
  
    connection.execSql(requestUpdate);
  }
  
  module.exports = { updateUser };
  
  //Slette en bruger
  function deleteUser(req, res) {
    const { userId, password } = req.body;
    const requestDeleteUser = new Request('DELETE FROM users WHERE userid = @userId AND password = @password', function (err, rowCount) {
        if (err) {
          console.log(err);
          return;
        }
        console.log("user deleted");
      }
    );
    requestDeleteUser.addParameter('userId', TYPES.Int, userId);
    requestDeleteUser.addParameter('password', TYPES.NVarChar, password);
  
    connection.execSql(requestDeleteUser);
  }
  module.exports = {deleteUser};
  