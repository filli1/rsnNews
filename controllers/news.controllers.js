const { executeSQL } = require('../database/db_connect');

//Get all articles
exports.getAllArticles = (req, res) => {
    executeSQL(`SELECT * FROM news ORDER BY publishedAt DESC`)
        .then(result => {
            return res.status(200).send(result);
        })
        .catch(error => {
            return res.status(500).send("Error");
        });
};

//Get the newest 7 articles
exports.getFrontpageArticles = (req, res) => {
    executeSQL(`SELECT TOP 7 * FROM news ORDER BY publishedAt DESC`)
        .then(result => {
            return res.status(200).send(result);
        })
        .catch(error => {
            return res.status(500).send("Error");
        });
};

//Gets the number of likes for a specific article
exports.getLikes = (req, res) => {
    const articleID = req.params.articleID;
    executeSQL(`SELECT COUNT(*) FROM likes WHERE articleID = ${articleID}`)
        .then(result => {
            const sentResult = { "likes": result[1].noColName };
            return res.status(200).send(sentResult.likes);  
        })
        .catch(error => {
            return res.status(500).send("Error");
        });
};

//Searchs on articles
exports.searchArticles = (req, res) => {
    const searchString = req.params.searchString;
    const from = req.params.from;
    const to = req.params.to;
    let query = `SELECT * FROM news WHERE title LIKE '%${searchString}%' OR description LIKE '%${searchString}%'`
    from ? query += ` AND publishedAt >= '${from}'` : null;
    to ? query += ` AND publishedAt <= '${to}'` : null;
    executeSQL(query)
        .then(result => {
            return res.status(200).send(result);
        })
        .catch(error => {
            return res.status(500).send("Error");
        })
};

exports.getArticleByID = (req, res) => {
    const { articleIDs } = req.body; 
    const articleIDsString = articleIDs.join(',');
    executeSQL(`SELECT * FROM news WHERE articleID IN (${articleIDsString})`)
        .then(result => {
            return res.status(200).send(result);
        })
        .catch(error => {
            console.log(error);
            return res.status(500).send(error);
        });
};

