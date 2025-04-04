const { response } = require("../app")
const { fetchCommentsByArticleId, createCommentsByArticleId, removeCommentsById, updateCommentById } = require("../models/model.comments")

exports.getCommentsByArticleId = (request, response, next) => {
    const {article_id} = request.params
    const {limit, page} = request.query
    fetchCommentsByArticleId(article_id, limit, page)
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

exports.deleteCommentsById = (request, response, next) => {
    const { comment_id } = request.params
    removeCommentsById(comment_id)
    .then((res) => {
        response.status(res.status).send({msg: res.msg})
    })
    .catch((error) => {
        next(error)
    })
}

exports.patchCommentByID = (request, response, next) => {
    const {comment_id} = request.params
    const {inc_votes} = request.body
    updateCommentById(comment_id, inc_votes)
    .then((comment) => {
        response.status(200).send({comment})
    })
    .catch((error) => [
        next(error)
    ])
}