const { executeSQL } = require('../database/db_connect');

exports.getAllCategories = (req, res) => {
    executeSQL(`SELECT * FROM categories`)
        .then(result => {
            let categories = [];

            for (const key in result) {
                let thisCategory = {
                    categoryID: result[key].categoryID,
                    category: result[key].category
                }
                categories.push(thisCategory);
            }
            return res.status(200).send(categories);
        })
        .catch(error => {
            return res.status(500).send("Error");
        });
}

exports.addFavoriteCategory = (req, res) => {
    const { userID, categoryID } = req.body;
    executeSQL(`INSERT INTO favouriteCategories (userID, categoryID) VALUES (${userID}, ${categoryID})`)
    .then(result => {
        return res.status(200).send("Category added");
    })
    .catch(error => {
        if(error.message.includes("Violation of UNIQUE KEY constraint")) {
            return res.status(400).send("Category already added");
        } else {
            return res.status(500).send("Error");
        }
    })
}

exports.removeFavoriteCategory = (req, res) => {
    const { userID, categoryID } = req.body;
    executeSQL(`DELETE FROM favouriteCategories WHERE userID = ${userID} AND categoryID = ${categoryID}`)
    .then(result => {
        return res.status(200).send("Category removed");
    })
    .catch(error => {
        if(error.includes("User or Article not found (404)")) {
            return res.status(404).send(`User ${userID} has not marked category with ID = ${categoryID} as favourite. 404 NOT FOUND`);
        } else {
            return res.status(500).send(error);
        }
        
    })
}

exports.getUserFavouriteCategories = (req, res) => {
    const userID = req.params.userID;
    executeSQL(`SELECT * FROM favouriteCategories WHERE userID = ${userID}`)
    .then(result => {
        let categories = [];
        for(const key in result) {
            categories.push(result[key].categoryID);
        }
        return res.status(200).send(categories);
    })
    .catch(error => {
        return res.status(500).send(error);
    })
}