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

exports.removeCommentsById = (comment_id) => {
    const idCheck = checkIfExists("comments", "comment_id", comment_id)
    
    const dbQuery = db.query(`
        DELETE FROM comments
        WHERE comment_id = $1
        RETURNING *`,
    [comment_id])

    return Promise.all([dbQuery, idCheck])
    .then(([{rows}]) => {
        if (rows.length > 0){
            return {status: 204, msg: "Comment deleted"}
        }
    })
}

exports.updateCommentById = (comment_id, votes) => {
    if(!votes){
        return Promise.reject({status: 400, msg: "Bad Request, invalid input"})
    }

    const commentCheck = checkIfExists("comments", "comment_id", comment_id)
    
    const dbQuery =  db.query(`
        UPDATE comments
        SET votes = votes + $1
        WHERE comment_id = $2
        RETURNING *`,
        [votes, comment_id])

    return Promise.all([dbQuery, commentCheck])
    .then(([comment]) => {
        return comment.rows[0]
    })
}