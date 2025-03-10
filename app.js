const express = require("express");
const app = express();
const endpoints = require("./endpoints.json");
const { getAllTopics } = require("./controllers/controller.topics");
const { handleServerError, handleIncorrectPath, handleCustomError, handleSqlError } = require("./controllers/controller.errors");
const { getArticleById, getAllArticles } = require("./controllers/controller.articles");

app.get("/api", (request, response) => {
    response.status(200).send({ endpoints });
});

app.get("/api/topics", getAllTopics)

app.get("/api/articles", getAllArticles)

app.get("/api/articles/:article_id", getArticleById)

app.all("/api/*", handleIncorrectPath)

app.use(handleCustomError)

app.use(handleSqlError)

app.use(handleServerError);


module.exports = app;