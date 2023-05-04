const { executeSQL } = require('../database/db_connect');

exports.createUser = (req, res) => {
  const { firstName, lastName, email, password, nationality } = req.body;
  
  // Execute the SQL query
  executeSQL(`INSERT INTO users (firstName, lastName, email, password, nationality) 
              VALUES ('${firstName}', '${lastName}', '${email}', '${password}', '${nationality}')`)
    .then(result => {
      return res.status(200).send(result);
    })
    .catch(error => {
      return res.status(500).send("error");
    });
}
