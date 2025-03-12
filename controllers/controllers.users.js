const { fetchAllUsers } = require("../models/model.users")

exports.getAllUsers = (request, response, next) => {
    fetchAllUsers()
    .then((users) => {
        response.status(200).send({users})
    })
    .catch((error) => {
        next(error)
    })
}