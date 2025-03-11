const db = require("../db/connection");

exports.fetchCommentsByArticleId = (article_id) => {
    return db.query(
        `SELECT * FROM comments
        WHERE article_id = $1
        ORDER BY
        created_At
        DESC`, [article_id]
    )
    .then(({rows}) => {
        if(rows.length === 0){
            return Promise.reject({status: 404, msg: "Resourse not found"})
        } else {
            return rows    
        }
    })
}