const format = require("pg-format");
const { checkIfExists } = require("../app.utils");
const db = require("../db/connection");

exports.fetchAllArticles = (sort_by = "created_at", order = "DESC", topic) => {
    let topicCheck = null
    let dbStr = `SELECT articles.*, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id `

    if(topic){
        topicCheck = checkIfExists("topics", "slug", topic)
        dbStr += `WHERE topic = '${topic}' `
    }

    dbStr += `GROUP BY articles.article_id `
    
    const allowedSorts = ["article_id", "title", "topic", "author", "created_at", "votes", "article_img_url"]
    if(!allowedSorts.includes(sort_by)){
        return Promise.reject({ status: 400, msg: "Bad Request, invalid input"})
    } else {
        dbStr += `ORDER BY %I `
    }

    if(order === "ASC" || order === "asc" || order === "desc" || order === "DESC"){
        dbStr += order+";"
    } else {
        return Promise.reject({ status: 400, msg: "Bad Request, invalid input"})
    }

    const dbFormatted = format(dbStr, sort_by)

    return Promise.all([db.query(dbFormatted), topicCheck])
    .then(([{rows}]) => {
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