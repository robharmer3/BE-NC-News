const express = require("express")
const { getAllTopics, postTopic } = require("../controllers/controller.topics");
const topicsRouter = express.Router()

topicsRouter
.route("/")
.get(getAllTopics)
.post(postTopic)

module.exports = topicsRouter