const { checkIfExists } = require("../app.utils");
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

exports.updateArticleById = (article_id, votes) => {
    if(!votes){
        return Promise.reject({status: 400, msg: "Bad Request, invalid input"})
    }

    const articleCheck = checkIfExists("articles", "article_id", article_id)

    const dbQuery = db.query(
        `UPDATE articles
        SET votes = votes + $1
        WHERE article_id = $2
        RETURNING *`,
        [votes, article_id]
    )

    return Promise.all([dbQuery, articleCheck])
    .then(([ comment ]) => {
        return comment.rows[0]
    })
}