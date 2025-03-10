const db = require("../connection")
const { createTopics, createUsers, createArticles, createComments, insertTopics, insertUsers, insertArticles, insertComments } = require("../seeds/utils")

const seed = ({ topicData, userData, articleData, commentData }) => {
  return db.query(`DROP TABLE IF EXISTS comments`)
  .then(() => {
    return db.query(`DROP TABLE IF EXISTS articles`)
  })
  .then(() => {
    return db.query(`DROP TABLE IF EXISTS users`)
  })
  .then(() => {
    return db.query(`DROP TABLE IF EXISTS topics`)
  })
  .then(() => {
    return createTopics()
  })
  .then(() => {
    return createUsers()
  })
  .then(() => {
    return createArticles()
  })
  .then(() => {
    return createComments()
  })
  .then(() => {
    return insertTopics(topicData)
  })
  .then(() => {
    return insertUsers(userData)
  })
  .then(() => {
    return insertArticles(articleData)
  })
  .then((insertedArticles) => {
    return insertComments(commentData, insertedArticles.rows)
  });
};
module.exports = seed;
