const { fetchAllUsers } = require("../models/model.users")

exports.getAllUsers = (request, response) => {
    fetchAllUsers()
    .then((users) => {
        response.status(200).send({users})
    })
}