const express = require("express");
const app = express();
const endpoints = require("./endpoints.json");
const { getAllTopics } = require("./controllers/controller.topics");
const { handleServerError, handleIncorrectPath } = require("./controllers/controller.error");

app.get("/api", (request, response) => {
    response.status(200).send({ endpoints });
});

app.get("/api/topics", getAllTopics)

app.all("/api/*", handleIncorrectPath)

app.use(handleServerError);


module.exports = app;