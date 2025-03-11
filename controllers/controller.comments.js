const { fetchCommentsByArticleId, createCommentsByArticleId } = require("../models/model.comments")

exports.getCommentsByArticleId = (request, response, next) => {
    const {article_id} = request.params
    fetchCommentsByArticleId(article_id)
    .then((comments) => {
        response.status(200).send({comments})
    })
    .catch((error) => {
        next(error)
    })
}

exports.postCommentsByArticleId = (request, response, next) => {
    const { username, body } = request.body
    const { article_id } = request.params
    createCommentsByArticleId(username, body, article_id)
    .then((comment) => {
        response.status(201).send({comment})
    })
    .catch((error) => {
        next(error)
    })
}