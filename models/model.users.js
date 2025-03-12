const { checkIfExists } = require("../app.utils")
const db = require("../db/connection")

exports.fetchAllUsers = () => {
    return db.query(
        `SELECT * FROM users`
    )
    .then(({rows}) => {
        return rows
    })
}

exports.fetchUserByUsername = (username) => {
    const usernameCheck = checkIfExists("users", "username", username)

    const dbQuery = db.query(`
        SELECT * FROM users
        WHERE username = $1`,
        [username])

    return Promise.all([dbQuery, usernameCheck])
    .then(([{rows}]) => {
        return rows[0]
    })
}