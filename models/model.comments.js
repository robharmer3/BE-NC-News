const format = require("pg-format");
const { checkIfExists } = require("../app.utils");
const db = require("../db/connection");

exports.fetchCommentsByArticleId = (article_id) => {
    const idCheck = checkIfExists("articles", "article_id", article_id)
  
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

exports.createCommentsByArticleId = (username, body, article_id) => {
    const articleIdCheck = checkIfExists("articles", "article_id", article_id)

    const usernameCheck = checkIfExists("users", "username", username)
    
    const dbQuery = db.query(`
        INSERT INTO comments
        (author, body, article_id)
        VALUES
        ($1, $2, $3)
        RETURNING *;`,
        [username, body, article_id]
    )

    return Promise.all([dbQuery, articleIdCheck, usernameCheck])
    .then(([comment]) => {
        return comment.rows[0]
    })
}