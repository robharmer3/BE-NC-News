const express = require("express")
const { getArticleById, getAllArticles, patchArticleById, postArticle, deleteArticleById } = require("../controllers/controller.articles");
const { getCommentsByArticleId, postCommentsByArticleId} = require("../controllers/controller.comments")
const articlesRouter = express.Router()

articlesRouter
.route("/")
.get(getAllArticles)
.post(postArticle)

articlesRouter
.route("/:article_id")
.get(getArticleById)
.patch(patchArticleById)
.delete(deleteArticleById)

articlesRouter
.route("/:article_id/comments")
.get(getCommentsByArticleId)
.post(postCommentsByArticleId)

module.exports = articlesRouter