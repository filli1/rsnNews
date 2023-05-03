var Connection = require('tedious').Connection
var Request = require('tedious').Request

const { TYPES } = require('tedious')
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
        //deleteUser(reqDelete); Virker
        //addUser(testuser); Virker
        //updateUser(testupdate) Virker halvt
        //getUserbyID(2); Virker ikke helt, giver bare userID i stedet for info om useren (så getuserbyid(2) returnerer 2 hvilket er fjollet)
        //getAllUsers(); Virker
    }
})
connection.connect()

//Tilføje en bruger 
function addUser(req) {
    const {nationality, firstName, lastName, email, password} = req.body;
    const requestAddUser = new Request(
      `INSERT INTO users (nationality, firstName, lastName, email, password) VALUES (@nationality, @firstName, @lastName, @email, 
      @password); SELECT SCOPE_IDENTITY() AS userID;`,
      function(err, rowCount) {
        if (err) {
          console.error(err);
          return;
        }
        console.log(`${rowCount} rows inserted`);
        connection.close();
      }
    );
    requestAddUser.addParameter('nationality', TYPES.VarChar, nationality);
    requestAddUser.addParameter('firstName', TYPES.VarChar, firstName);
    requestAddUser.addParameter('lastName', TYPES.VarChar, lastName);
    requestAddUser.addParameter('email', TYPES.VarChar, email);
    requestAddUser.addParameter('password', TYPES.VarChar, password);
  
    //Uses the UserID that the database assigns
    requestAddUser.on('returnValue', function(value) {
      console.log(`New user added with userID ${value}.`);
    });
    connection.execSql(requestAddUser);
  }
  module.exports = {addUser};
  const testuser = {
    body: {
        firstName: 'samira',
        lastName: 'mahyo',
        email: 'samiramahyo@gmail.com',
        password: 'test123',
        nationality: 'danish'
    }
  }




//Opdatere en bruger - Hvilket parameter bør denne tjekke op imod? Virker ligenu kun hvis alle parametre opdateres, ellers ændres dem der ikke skrives til null. 
function updateUser(req) {
    const { userID, firstName, lastName, nationality, email, password } = req.body;
    const requestUpdate = new Request(`UPDATE users SET firstName = @firstName, lastName = @lastName, nationality = @nationality, email = @email, password = @password WHERE userID = @userID;`, function (err, rowCount) {
      if (err) {
        console.error(err);
        return;
      }
      console.log(`${rowCount} row(s) updated in users table.`);
      connection.close();
    });
    requestUpdate.addParameter('userID', TYPES.Int, userID);
    requestUpdate.addParameter('firstName', TYPES.VarChar, firstName);
    requestUpdate.addParameter('lastName', TYPES.VarChar, lastName);
    requestUpdate.addParameter('nationality', TYPES.VarChar, nationality);
    requestUpdate.addParameter('email', TYPES.VarChar, email);
    requestUpdate.addParameter('password', TYPES.VarChar, password);
  
    connection.execSql(requestUpdate);
  }
  const testupdate = {
    body: {
        userID: '3',
        firstName: 'kaj',
        lastName: 'mortensen'
    }
  }
  
  module.exports = { updateUser };
  
  //Slette en bruger
  function deleteUser(req) {
    const {email, password} = req.body;
    const requestDeleteUser = new Request('DELETE FROM users WHERE email = @email AND password = @password', function (err) {
        if (err) {
          console.log(err);
          return;
        }
        console.log("user deleted");
        connection.close();
      }
    );
    requestDeleteUser.addParameter('email', TYPES.VarChar, email);
    requestDeleteUser.addParameter('password', TYPES.VarChar, password);
  
    connection.execSql(requestDeleteUser);
  }
  module.exports = {deleteUser};

  const reqDelete = {
    body: {
        email: 'samiramahyo@gmail.com',
        password: 'test123'
    }
  }
  
  

function getAllUsers() {
    const allUsers = []
    const requestAllUsers = new Request("SELECT userid FROM users", function(err, rowCount){
    if (err) {
        console.log(err)
    }
    else {
        console.log(allUsers)
    
    }
    connection.close()
    
    });
    requestAllUsers.on("row", function(columns){
        allUsers.push(columns[0].value);
    });
    connection.execSql(requestAllUsers);
    
}
module.exports = getAllUsers

function getUserbyID(userID) {
    const requestUser = new Request('SELECT * FROM users WHERE userID = @userID', function(err, rows){
      if (err){
        console.log(err)
      } else {
        console.log(rows)
        connection.close();
      }
    });
    requestUser.addParameter('userID', TYPES.Int, userID);
    connection.execSql(requestUser);
  }
module.exports = {getUserbyID}


//Ved ikke om denne virker endnu
function addReadArticle(req, res) {
    const {articleID, userID} = req.body;
  
    const requestAddReadArticle = new Request(`INSERT INTO readArticles (userID, articleID) VALUES (@userID, @articleID);`, function(err, rowCount) {
      if (err) {
        console.log(err);
        return;
      }
      console.log(`${rowCount} row(s) inserted into readarticles table.`);
      res.sendStatus(200);
      connection.close()
    });
    requestAddReadArticle.addParameter('userID', TYPES.Int, userID);
    requestAddReadArticle.addParameter('articleID', TYPES.Int, articleID);
    connection.execSql(requestAddReadArticle);
  }
  
  const testReq = {
    body: {
      articleID: 363,
      userID: 1
    }
  };
  

  module.exports = {addReadArticle};

  //Ved ikke om denne virker endnu
  function getReadArticles(res) {
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
 
  
  //Ved ikke om denne virker endnu
  function addFavouriteArticle(req, res){
    const {articleID, userID} = req.body;

    const requestAddFavourite = new Request('INSERT INTO favouritearticles (userID, articleID) VALUES (@userID, @articleID);', function (err, rowCount){
        if (err){
            console.log(err)
            return;
        }
        console.log("row added to favouritearticles table")
        res.sendStatus(200);
    });
    requestAddFavourite.addParameter('userID', TYPES.Int, userID);
    requestAddFavourite.addParameter('articleID', TYPES.Int, articleID);
    connection.execSql(requestAddFavourite);
  }
  module.exports = {addFavouriteArticle}
