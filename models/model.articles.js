const db = require("../db/connection");

exports.fetchAllArticles = () => {
    return db.query(
        `SELECT articles.*,
        COUNT(comments.article_id) AS comment_count
        FROM 
        articles
        LEFT JOIN 
        comments
        ON 
        articles.article_id = comments.article_id
        GROUP BY 
        articles.article_id
        ORDER BY
        articles.created_at
        DESC;`
    )
    .then(({rows}) => {
        return rows
    })
}


exports.fetchArticleByID = (article_id) => {
    return db.query(
        `SELECT * FROM articles
        WHERE article_id = $1`,
        [article_id]
    )
    .then(({ rows }) => {
        if(rows.length === 0){
            return Promise.reject({status: 404, msg: "Resourse not found"})
        }
        return rows[0]
    })
}