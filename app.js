const express = require("express");
const app = express();
const endpoints = require("./endpoints.json");
const { handleServerError, handleIncorrectPath, handleCustomError, handleSqlError } = require("./controllers/controller.errors");
const { topicsRouter, usersRouter, articlesRouter, commentsRouter, apiRouter } = require("./routers");

app.use(express.json())

app.use("/api/topics", topicsRouter)
app.use("/api/users", usersRouter)
app.use("/api/articles", articlesRouter)
app.use("/api/comments", commentsRouter)
app.use("/api", apiRouter)

apiRouter
.route("/")
.get((request, response) => { 
    response.status(200).send({ endpoints });
})

apiRouter
.route("/*")
.all(handleIncorrectPath)

app.use(handleCustomError)
app.use(handleSqlError)
app.use(handleServerError);


module.exports = app;