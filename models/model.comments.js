const db = require("../db/connection");

exports.fetchCommentsByArticleId = (article_id) => {
    return db.query(
        `SELECT * FROM comments`
    )
    .then(({rows}) => {
        console.log(rows)
        return rows
    })
}