const express = require("express");
const app = express();
const endpoints = require("./endpoints.json");
const { getAllTopics, postTopic } = require("./controllers/controller.topics");
const { handleServerError, handleIncorrectPath, handleCustomError, handleSqlError } = require("./controllers/controller.errors");
const { getArticleById, getAllArticles, patchArticleById, postArticle } = require("./controllers/controller.articles");
const { getCommentsByArticleId, postCommentsByArticleId, deleteCommentsById, patchCommentByID } = require("./controllers/controller.comments");
const { getAllUsers, getUserByUsername } = require("./controllers/controllers.users");

app.use(express.json())

app.get("/api", (request, response) => {
    response.status(200).send({ endpoints });
});

app.get("/api/topics", getAllTopics)

app.post("/api/topics", postTopic)

app.get("/api/articles", getAllArticles)

app.get("/api/users", getAllUsers)

app.get("/api/users/:username", getUserByUsername)

app.post("/api/articles", postArticle)

app.get("/api/articles/:article_id", getArticleById)

app.patch("/api/articles/:article_id", patchArticleById)

app.get("/api/articles/:article_id/comments", getCommentsByArticleId)

app.post("/api/articles/:article_id/comments", postCommentsByArticleId)

app.patch("/api/comments/:comment_id", patchCommentByID)

app.delete("/api/comments/:comment_id", deleteCommentsById)

app.all("/api/*", handleIncorrectPath)

app.use(handleCustomError)

app.use(handleSqlError)

app.use(handleServerError);


module.exports = app;