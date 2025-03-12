const { fetchAllUsers, fetchUserByUsername } = require("../models/model.users")

exports.getAllUsers = (request, response, next) => {
    fetchAllUsers()
    .then((users) => {
        response.status(200).send({users})
    })
    .catch((error) => {
        next(error)
    })
}

exports.getUserByUsername = (request, response, next) => {
    const { username } = request.params
    fetchUserByUsername(username)
    .then((user) => {
        response.status(200).send({user})
    })
    .catch((error) => {
        next(error)
    })
}