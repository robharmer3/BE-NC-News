const express = require("express");
const app = express();
const endpoints = require("./endpoints.json");
const { getAllTopics } = require("./controllers/controller.topics");
const { handleServerError, handleIncorrectPath, handleCustomError, handleSqlError } = require("./controllers/controller.errors");
const { getArticleById, getAllArticles, patchArticleById } = require("./controllers/controller.articles");
const { getCommentsByArticleId, postCommentsByArticleId } = require("./controllers/controller.comments");

app.use(express.json())

app.get("/api", (request, response) => {
    response.status(200).send({ endpoints });
});

app.get("/api/topics", getAllTopics)

app.get("/api/articles", getAllArticles)

app.get("/api/articles/:article_id", getArticleById)

app.patch("/api/articles/:article_id", patchArticleById)

app.get("/api/articles/:article_id/comments", getCommentsByArticleId)

app.post("/api/articles/:article_id/comments", postCommentsByArticleId)

app.all("/api/*", handleIncorrectPath)

app.use(handleCustomError)

app.use(handleSqlError)

app.use(handleServerError);


module.exports = app;