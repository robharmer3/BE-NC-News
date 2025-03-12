const { fetchArticleByID, fetchAllArticles, updateArticleById } = require("../models/model.articles")

exports.getAllArticles = (request, response, next) => {
    const {sort_by, order, topic} = request.query
    fetchAllArticles(sort_by, order, topic)
    .then((articles) => {
        response.status(200).send({ articles })
    }).catch((error) => {
        next(error)
    })
}

exports.getArticleById = (request, response, next) => {
    const { article_id } = request.params
    fetchArticleByID(article_id)
    .then((article) => {
        response.status(200).send({ article })
    })
    .catch((error) => {
        next(error)
    })
}

exports.patchArticleById = (request, response, next) => {
    const { inc_votes } = request.body
    const { article_id } = request.params
    updateArticleById(article_id, inc_votes)
    .then((article) => {
        response.status(200).send({article})
    })
    .catch((error) => {
        next(error)
    })
}