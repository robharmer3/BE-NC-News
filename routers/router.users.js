const express = require("express")
const { getAllUsers, getUserByUsername } = require("../controllers/controllers.users");
const usersRouter = express.Router()

usersRouter
.route("/")
.get(getAllUsers)

usersRouter
.route("/:username")
.get(getUserByUsername)


module.exports = usersRouter