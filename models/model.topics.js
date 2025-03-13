const db = require("../db/connection")

exports.fetchAllTopics = () => {
    return db.query(
        `SELECT * FROM topics`
    ).then(({ rows }) => {
        return rows
    })
}

exports.createTopic = (slug, description) => {
    if (slug && description){
        return db.query(`
            INSERT INTO topics
            (slug, description)
            VALUES
            ($1, $2)
            RETURNING *`,
            [slug, description])
        .then(({rows}) => {
            return rows[0]
        })
    } else {
        return Promise.reject({status: 400, msg: "Bad Request, invalid input"})
    }
}