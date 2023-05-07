const { executeSQL } = require('../database/db_connect');



//Adds a user to the database
exports.createUser = (req, res) => {
  let userInfo = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    nationality: req.body.nationality
  };
//First, checks to make sure that the user doesn't already exist. 
  executeSQL(`SELECT COUNT(*) as count FROM users WHERE email = '${userInfo.email}'`)
    .then(result => {
      const count = result['1'].count;
      if (count === 0) {
        // email does not exist in the database, proceeds with creating the user
        createUser();
      } else {
        // email already exists in the database, return error
        return res.status(400).send("Email already exists in the database");
      }
    })
    .catch(error => {
      console.log(error);
      return res.status(500).send("Error");
    });

  //Function called above which creates the user
  function createUser() {
    executeSQL(`INSERT INTO users (firstName, lastName, email, password, nationality) 
                OUTPUT INSERTED.userID
                VALUES ('${userInfo.firstName}', '${userInfo.lastName}', '${userInfo.email}', '${userInfo.password}', '${userInfo.nationality}')`)
      .then(result => {
        return res.status(200).send(result);
      })
      .catch(error => {
        return res.status(500).send("Error");
      });
  }
}


//Deletes a user from the database, based on email and password.
exports.deleteUser = (req, res) => {
const { email, password } = req.body;
executeSQL(`DELETE FROM users WHERE email='${email}' AND password='${password}'`)
.then(result => {
  return res.status(200).send("User deleted")
})
.catch(error => {
  console.log(error)
  if (error === "User not found") {
    return res.status(404).send("User not found");
  } else {
    return res.status(500).send(error);
  }
})
}


//Updates a user in the database.
exports.updateUser = (req, res) => {
  const userID = req.params.userID;
  let userInfo = {
    firstName : req.body.firstName,
    lastName : req.body.lastName,
    email : req.body.email,
    password : req.body.password,
    nationality : req.body.nationality
  }
executeSQL(`UPDATE users SET firstName = '${userInfo.firstName}', lastName = '${userInfo.lastName}', email = '${userInfo.email}', password = '${userInfo.password}', nationality = '${userInfo.nationality}' WHERE userID = ${userID}`)
.then(result => {
  return res.status(200).send("User updated")
})
.catch(error => {
  console.log(error)
  if (error === "User not found") {
    return res.status(404).send("User not found");
  } else {
    return res.status(500).send(error);
  }
})
}

//Gets a user from the database from userID and returns user info as JSON
exports.getUser = (req, res) => {
  const userID = req.params.userID;
  executeSQL(`SELECT * FROM users WHERE userID = ${userID}`)
  .then(result => {
    const userarray = Object.keys(result);
    if (userarray.length === 0) {
      return res.status(404).send("User not found")
    }
    return res.status(200).json(result);
  })
  .catch(error =>{
    console.log(error);
    return res.status(500).send(error)
  })
}

//Gets all users from the database 
exports.getAllUsers = (req, res) => {
  executeSQL('SELECT * FROM users')
  .then(response => {
    return res.status(200).json(response);
  })
  .catch(error =>{
    console.log(error);
    return res.status(500).send(error)
  })
}

// Adds liked article to likes table. Table has unique_like_pair constraint to avoid duplicates.
exports.addLiked = (req, res) => {
  const {userID, articleID} = req.body;
  executeSQL(`INSERT INTO likes (userID, articleID) VALUES (${userID}, ${articleID})`)
    .then(response => {
      return res.status(200).json(response);
    })
    .catch(error => {
      if (error.message.includes("Cannot insert duplicate key")) {
        // Duplicate row detected, return error to client
        return res.status(400).send("User already liked this article");
      } else {
        console.log(error);
        return res.status(500).send(error);
      }
    });
}


//Removes liked article from likes table 
exports.unlike = (req, res) => {
  const {userID, articleID} = req.body
  executeSQL(`DELETE FROM likes WHERE userID = ${userID} AND articleID = ${articleID}`)
  .then(response => {
    return res.status(200).send(("Like removed"))
  })
  .catch(error =>{
    console.log(error)
    return res.status(500).send(error)
  })
}


//Adds favourite article
exports.addFavourite = (req, res) => {
  const {userID, articleID} = req.body;
  executeSQL(`INSERT INTO favouriteArticles (userID, articleID) VALUES (${userID}, ${articleID})`)
    .then(response => {
      return res.status(200).json(response);
    })
    .catch(error => {
     console.log(error);
        return res.status(500).send(error);
      
    });
}
//Removes favourite 
exports.unfave = (req, res) => {
  const {userID, articleID} = req.body
  executeSQL(`DELETE FROM favouriteArticles WHERE userID = ${userID} AND articleID = ${articleID}`)
  .then(response => {
    return res.status(200).send(("Favourite removed"))
  })
  .catch(error =>{
    console.log(error)
    return res.status(500).send(error)
  })
}

//Gets all favourites for specified user
exports.getFaves = (req, res) => {
  const {userID} = req.body
  executeSQL(`SELECT articleID FROM favouriteArticles WHERE userID = ${userID}`)
  .then(response => {
    const articleIDs = [];
    for (const key in response) {
      articleIDs.push(response[key].articleID);
    }
    return res.status(200).send(articleIDs);
  })
  .catch(error =>{
    console.log(error)
    return res.status(500).send(error)
  })
}

//Adds read article
exports.addRead = (req, res) => {
  const {userID, articleID} = req.body;
  executeSQL(`INSERT INTO readArticles (userID, articleID) VALUES (${userID}, ${articleID})`)
    .then(response => {
      return res.status(200).json(response);
    })
    .catch(error => {
        console.log(error);
        return res.status(500).send(error);
      }
    );
}

//Gets all read articles for specified user
exports.getRead = (req, res) => {
  const {userID} = req.body
  executeSQL(`SELECT articleID FROM readArticles WHERE userID = ${userID}`)
  .then(response => {
    const articleIDs = [];
    for (const key in response) {
      articleIDs.push(response[key].articleID);
    }
    return res.status(200).send(articleIDs);
  })
  .catch(error =>{
    console.log(error)
    return res.status(500).send(error)
  })
}