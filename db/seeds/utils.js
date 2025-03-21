const db = require("../../db/connection");
const format = require("pg-format");

function convertTimestampToDate ({ created_at, ...otherProperties }) {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

function createTopics() {
  return db.query(
    `CREATE TABLE topics
    (slug VARCHAR PRIMARY KEY,
    description VARCHAR,
    img_url VARCHAR(1000))`
  )
}

function createUsers() {
  return db.query(
    `CREATE TABLE users
    (username VARCHAR PRIMARY KEY,
    name VARCHAR,
    avatar_url VARCHAR(1000))`
  )
}

function createArticles() {
  return db.query(
    `CREATE TABLE articles
    (article_id SERIAL PRIMARY KEY,
    title VARCHAR,
    topic VARCHAR REFERENCES topics(slug) ON DELETE CASCADE NOT NULL,
    author VARCHAR REFERENCES users(username) ON DELETE CASCADE NOT NULL,
    body TEXT,
    created_at TIMESTAMP,
    votes INT DEFAULT 0,
    article_img_url VARCHAR(1000))`
  )
}

function createComments() {
  return db.query(
    `CREATE TABLE comments
    (comment_id SERIAL PRIMARY KEY,
    article_id INT REFERENCES articles(article_id) ON DELETE CASCADE NOT NULL,
    body TEXT,
    votes INT DEFAULT 0,
    author VARCHAR REFERENCES users(username) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP)`
  )
}

function insertTopics(topics) {
  const formattedTopics = topics.map((topic) => {
    return [ topic.slug, topic.description, topic.img_url ]
  })

  return db.query(format(
    `INSERT INTO topics
    (slug, description, img_url)
    VALUES
    %L
    RETURNING *`,
    formattedTopics)
  )
}

function insertUsers(users) {
  const formattedUsers = users.map((user) => {
    return [ user.username, user.name, user.avatar_url ]
  })

  return db.query(format(
    `INSERT INTO users
    (username, name, avatar_url)
    VALUES
    %L
    RETURNING *`,
    formattedUsers
  ))
}

function insertArticles(articles) {
  const tobeInserted = articles.map((article) => {
    return convertTimestampToDate(article)
    })
  
  const formattedArticles = tobeInserted.map((article) => {
    return [
      article.title, 
      article.topic, 
      article.author, 
      article.body, 
      article.created_at, 
      article.votes || 0, 
      article.article_img_url
    ]
  }) 

  return db.query(format(
    `INSERT INTO articles
    (title, topic, author, body, created_at, votes, article_img_url)
    VALUES
    %L
    RETURNING *`,
    formattedArticles
  ))
}

function articlesLookUp(insertedArticles){
  if(insertedArticles.length === 0){
    return {}
  }

  const titleLookUp = {}
  insertedArticles.forEach(article => {
    titleLookUp[article.title] = article.article_id
  });

  return titleLookUp
}

function insertComments(comments, insertedArticles) {
  const titleLookUp = articlesLookUp(insertedArticles)

  const formattedComments = comments.map((comment) => {
    comment.article_id = titleLookUp[comment.article_title]
    return [
          comment.article_id,
          comment.body,
          comment.votes,
          comment.author,
          convertTimestampToDate(comment).created_at
        ]})

  return db.query(format(
    `INSERT INTO comments
    (article_id, body, votes, author, created_at)
    VALUES
    %L
    RETURNING *;`,
    formattedComments
  ))
}

module.exports = { convertTimestampToDate, createTopics, createUsers, createArticles, createComments, insertTopics, insertUsers, insertArticles, articlesLookUp, insertComments }