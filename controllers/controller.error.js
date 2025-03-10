exports.handleIncorrectPath = (request, response) => {
    response.status(404).send({ msg : "Page not found, check your spelling?"})
}

exports.handleServerError = (error, request, response, next) => {
    response.status(500).send({ msg : "Something went wrong!"})
}