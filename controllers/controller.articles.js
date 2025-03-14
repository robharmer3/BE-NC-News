const { fetchArticleByID, fetchAllArticles, updateArticleById, createArticle, removeArticleById } = require("../models/model.articles")

exports.getAllArticles = (request, response, next) => {
    const {sort_by, order, topic, limit, page} = request.query
    fetchAllArticles(sort_by, order, topic, limit, page)
    .then((articles) => {
        response.status(200).send({ articles: articles, total_count: articles.total_count })
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

exports.postArticle = (request, response, next) => {
    const {author, title, body, topic, votes, article_img_url} = request.body
    createArticle(author, title, body, topic, votes, article_img_url)
    .then((article) => {
        response.status(201).send({article})
    })
    .catch((error) => {
        next(error)
    })
}

exports.deleteArticleById = (request, response, next) => {
    const { article_id } = request.params
        removeArticleById(article_id)
        .then((res) => {
            response.status(res.status).send({msg: res.msg})
        })
        .catch((error) => {
            next(error)
        })
}