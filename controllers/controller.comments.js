const { fetchCommentsByArticleId } = require("../models/model.comments")

exports.getCommentsByArticleId = (request, response) => {
    const {article_id} = request.params
    fetchCommentsByArticleId(article_id)
    .then((comments) => {
        console.log(comments)
        response.status(200).send({comments})
    })
}