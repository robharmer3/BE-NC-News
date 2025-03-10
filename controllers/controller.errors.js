exports.handleCustomError = (error, request, response, next) => {
    if(error.status){
        response.status(error.status).send({msg: error.msg})
    } else {
    next(error)
    }
}

exports.handleSqlError = (error, request, response, next) => {
    if(error.code === '22P02'){
        response.status(400).send({msg: "Bad Request, invalid input"})
    }
}

exports.handleIncorrectPath = (request, response) => {
    response.status(404).send({ msg : "Page not found, check your spelling?"})
}

exports.handleServerError = (error, request, response, next) => {
    response.status(500).send({ msg : "Something went wrong!"})
}