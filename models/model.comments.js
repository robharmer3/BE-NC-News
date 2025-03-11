const { checkIfExists } = require("../app.utils");
const db = require("../db/connection");

exports.fetchCommentsByArticleId = (article_id) => {
    const idCheck = checkIfExists("articles", "article_id", article_id)
    .then(({rows}) => {return rows})
    
    const dbQuery = db.query(
        `SELECT * FROM comments
        WHERE article_id = $1
        ORDER BY
        created_At
        DESC`, [article_id]
    )

    return Promise.all([dbQuery, idCheck])
    .then(([comments]) => {
        return comments.rows  
    })
}