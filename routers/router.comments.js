const express = require("express")
const {patchCommentByID, deleteCommentsById} = require("../controllers/controller.comments")
const commentsRouter = express.Router()

commentsRouter
.route("/:comment_id")
.patch(patchCommentByID)
.delete(deleteCommentsById)

module.exports = commentsRouter