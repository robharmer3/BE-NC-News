const { fetchAllTopics } = require("../models/model.topics")

exports.getAllTopics = (request, response) => {
    fetchAllTopics()
    .then((topics) => {
        response.status(200).send({ topics })
    })
}