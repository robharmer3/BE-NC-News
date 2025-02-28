const db = require("../connection")

//Query 1 - Get all users
function allUsers(){
    return db.query(`
        SELECT * FROM users`)
        .then(({ rows }) => {
            console.log(rows)
        })
        .then( db.end() )
}
// allUsers()

//Query 2 - Get all of the articles where the topic is coding
function allCodingArticles() {
    return db.query(`
        SELECT * FROM articles
        WHERE topic = 'coding'`)
        .then(({ rows }) => {
            console.log(rows)
        })
        .then( db.end() )
}
// allCodingArticles()

//Query 3 - Get all of the comments where the votes are less than zero
function allCommentsVotesLessZero() {
    return db.query(`
        SELECT * FROM comments
        WHERE votes < 0`)
        .then(({ rows }) => {
            console.log(rows.length)
        })
        .then( db.end() )
}
// allCommentsVotesLessZero()

//Query 4 - Get all of the topics
function allTopics() {
    return db.query(`
        SELECT * FROM topics`)
        .then(({ rows }) => {
            console.log(rows)
        })
        .then( db.end() )
}
// allTopics()

//Query 5 - Get all of the articles by user grumpy19
function grumpy19Articles() {
    return db.query(`
        SELECT * FROM articles
        WHERE author = 'grumpy19'`)
        .then(({ rows }) => {
            console.log(rows)
        })
        .then( db.end() )
}
// grumpy19Articles()

//Query 6 - Get all of the comments that have more than 10 votes.
function commentsWithMoreThan10Votes() {
    return db.query(`
        SELECT * FROM comments
        WHERE VOTES > 10`)
        .then(({ rows }) => {
            console.log(rows)
        })
        .then( db.end() )
}
// commentsWithMoreThan10Votes()

function allArticlesVotes(){
    return db.query(`
        SELECT votes FROM articles`)
        .then(({ rows }) => {
            console.log(rows)
        })
        .then( db.end() )
}
// allArticlesVotes()