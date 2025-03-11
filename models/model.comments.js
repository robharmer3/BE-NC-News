const format = require("pg-format");
const { checkIfExists } = require("../app.utils");
const db = require("../db/connection");
const { convertTimestampToDate } = require("../db/seeds/utils");

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
    if(!username || !body){
        return Promise.reject({status: 400, msg: "Bad Request, invalid input"
        })
    }

    const articleIdCheck = checkIfExists("articles", "article_id", article_id)

    const usernameCheck = checkIfExists("users", "username", username)

    const dbQuery = db.query(`
        INSERT INTO comments
        (author, body, article_id, created_at)
        VALUES
        ($1, $2, $3, $4)
        RETURNING *;`,
        [username, body, article_id, new Date()]
    )

    return Promise.all([dbQuery, articleIdCheck, usernameCheck])
    .then(([comment]) => {
        return comment.rows[0]
    })
}