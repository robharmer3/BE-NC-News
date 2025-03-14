const format = require("pg-format");
const { checkIfExists } = require("../app.utils");
const db = require("../db/connection");

exports.fetchAllArticles = (sort_by = "created_at", order = "DESC", topic, limit = 10, page = 1) => {
    let topicCheck = null
    let dbStr = `SELECT articles.*, CAST(COUNT(comments.article_id)AS INT) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id `

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
        dbStr += order
    } else {
        return Promise.reject({ status: 400, msg: "Bad Request, invalid input"})
    }

    if(Number(limit)){
        dbStr += ` LIMIT %s`
    } else {
        return Promise.reject({ status: 400, msg: "Bad Request, invalid input"})
    }

    if(Number(page)){
        dbStr += ` OFFSET ${limit * (page -1)}`
    } else {
        return Promise.reject({ status: 400, msg: "Bad Request, invalid input"})
    }

    const dbFormatted = format(dbStr, sort_by, limit)

    return Promise.all([db.query(dbFormatted), topicCheck])
    .then(([{rows}]) => {
        rows.total_count = rows.length
        return rows
    })   
}

exports.fetchArticleByID = (article_id) => {
    return db.query(
        `SELECT articles.*, CAST(COUNT(comments.article_id)AS INT) AS comment_count
        FROM articles
        LEFT JOIN comments
        ON articles.article_id = comments.article_id
        WHERE articles.article_id = $1
        GROUP BY articles.article_id`,
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

exports.createArticle = (author, title, body, topic, votes = 0, article_img_url) => {
    const created_at = new Date()

    if(!article_img_url){
        article_img_url = null
    }

    if(author, title, body, topic){
        const authorCheck = checkIfExists("users", "username", author)
        const topicCheck = checkIfExists("topics", "slug", topic)
        const dbQuery = db.query(`
            INSERT INTO articles
            (title, topic, author, body, created_at, votes, article_img_url)
            VALUES
            ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *`,
            [title, topic, author, body, created_at, votes, article_img_url])

        return Promise.all([dbQuery, authorCheck, topicCheck])
        .then(([{rows}]) => {
            return db.query(`
                SELECT articles.*, CAST(COUNT(comments.article_id)AS INT) AS comment_count
                FROM articles
                LEFT JOIN comments
                ON articles.article_id = comments.article_id
                WHERE articles.article_id = $1
                GROUP BY articles.article_id`,
                [rows[0].article_id])
        })
        .then(({rows}) => {
            return rows[0]
        })
    } else {
        return Promise.reject({status: 400, msg: "Bad Request, invalid input"})
    }
}

exports.removeArticleById = (article_id) => {
    const idCheck = checkIfExists("articles", "article_id", article_id)
    
    const dbQuery = db.query(`
        DELETE FROM articles
        WHERE article_id = $1
        RETURNING *`,
        [article_id])

    return Promise.all([dbQuery, idCheck])
    .then(([{rows}]) => {
        if (rows.length > 0){
            return {status: 204, msg: "Comment deleted"}
        }
    })
}