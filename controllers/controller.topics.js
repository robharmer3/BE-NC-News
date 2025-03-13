const { fetchAllTopics, createTopic } = require("../models/model.topics")

exports.getAllTopics = (request, response) => {
    fetchAllTopics()
    .then((topics) => {
        response.status(200).send({ topics })
    })
}

exports.postTopic = (request, response, next) => {
    const {slug, description} = request.body
    createTopic(slug, description)
    .then((topic) => {
        response.status(201).send({topic})
    })
    .catch((error) => {
        next(error)
    })
    
}