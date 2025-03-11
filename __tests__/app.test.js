const endpointsJson = require("../endpoints.json");
const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index.js");
const db = require("../db/connection")

beforeEach(() => {
  return seed(data)
})

afterAll(() => {
  return db.end()
})

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: Responds with an array of all topic objects", () => {
    return request(app)
    .get("/api/topics")
    .expect(200)
    .then(({ body }) => {
      expect(Array.isArray(body.topics)).toBe(true)
    })
  })
  test("200: Each topics object should have slug and description properties", () => {
    return request(app)
    .get("/api/topics")
    .expect(200)
    .then(({ body }) => {
      body.topics.forEach((topic) => {
        expect(topic).toMatchObject({
          slug : expect.any(String),
          description : expect.any(String)
        })
      })
    })
  })
  test("404: Responds with an 404 error message if endpoint is invalid", () => {
    return request(app)
    .get("/api/topic")
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("Page not found")
    })
  })
})

describe("GET /api/articles/:article_id", () => {
  test("200: Responds with individual article of given ID", () => {
    return request(app)
    .get("/api/articles/3")
    .expect(200)
    .then(({ body }) => {
      expect(body.article).toMatchObject({
        article_id: 3,
        title: "Eight pug gifs that remind me of mitch",
        topic: "mitch",
        author: "icellusedkars",
        body: "some gifs",
        created_at: "2020-11-03T09:12:00.000Z",
        votes: 0,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"  
      })
    })
  })
  test("404: Responds with an error when given a valid ID but not article exists", () => {
    return request(app)
    .get("/api/articles/50")
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("Resourse not found")
      })
    })
  test("400: Responds with an bad request error when given a invalid ID", () => {
    return request(app)
    .get("/api/articles/darthvader")
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Bad Request, invalid input")
    })
  })
})

describe("GET /api/articles", () => {
  test("200: Responds with an array of all article objects", () => {
    return request(app)
    .get("/api/articles")
    .expect(200)
    .then(({ body }) => {
      body.articles.forEach((article) => {
        expect(article).toMatchObject({
          article_id : expect.any(Number),
          title : expect.any(String),
          topic : expect.any(String),
          author : expect.any(String),
          created_at : expect.any(String),
          votes : expect.any(Number),
          article_img_url : expect.any(String),
          comment_count : expect.any(String)
        })
      })
    })
  })
  test("200: Article Object should be sorted by date in descending order, as the default", () => {
    return request(app)
    .get("/api/articles")
    .expect(200)
    .then(({ body }) => {
      expect(body.articles).toBeSorted({ key: "created_at", descending: true})
    })
  })
  test("404: Responds with an page not found error when given a invalid path", () => {
    return request(app)
    .get("/api/article")
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("Page not found")
    })
  })
})

describe("GET /api/articles/:article_id/comments", () => {
  test("200: Responds with a array of comments of the given article ID", () => {
    return request(app)
    .get("/api/articles/3/comments")
    .expect(200)
    .then(({ body }) => {
      expect(body.comments.length).toBe(2)
      expect(body.comments[0]).toMatchObject({
        comment_id: 11,
        votes: 0,
        created_at: expect.any(String),
        author: "icellusedkars",
        body:"Ambidextrous marsupial",
        article_id : 3
      })
      expect(body.comments[1]).toMatchObject({
          comment_id: 10,
          votes: 0,
          created_at: expect.any(String),
          author: "icellusedkars",
          body:"git push origin master",
          article_id : 3
      })
    })
  })
  test("200: Comments should be most recent first (descending)", () => {
    return request(app)
    .get("/api/articles/3/comments")
    .expect(200)
    .then(({ body }) => {
      expect(body.comments).toBeSorted({key: "created_at", descending: true})
    })
  })
  test("200: Responds with an empty array when given a valid ID by no comments are found", () => {
    return request(app)
    .get("/api/articles/2/comments")
    .expect(200)
    .then(({ body }) => {
      expect(body.comments.length).toBe(0)
    })
  })
  test("404: Responds with an error when given a valid ID but no article exists", () => {
    return request(app)
    .get("/api/articles/50/comments")
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("Resource not found")
    })
  })
  test("400: Responds with an bad request error when given a invalid ID", () => {
    return request(app)
    .get("/api/articles/darthvader/comments")
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Bad Request, invalid input")
    })
  })
})

describe("POST /api/articles/:article_id/comments", () => {
  test("201: Responds with the posted comment", () => {
    return request(app)
    .post("/api/articles/2/comments")
    .send({
      username: "butter_bridge",
      body: "Hello World!"
    })
    .expect(201)
    .then(({ body }) => {
      expect(body.comment).toMatchObject({
        comment_id : 19,
        article_id: 2,
        body: "Hello World!",
        votes: 0,
        author: "butter_bridge",
        created_at: expect.any(String)
      })
    })
  })
  test("404: Response with page not found when given a valid article ID, but not article exists", () => {
    return request(app)
    .post("/api/articles/50/comments")
    .send({
      username: "butter_bridge",
      body: "Hello World!"
    })
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("Resource not found")
    })
  })
  test("400: Responds bad request when given an invalid article ID", () => {
    return request(app)
    .post("/api/articles/darthvader/comments")
    .send({
        username: "butter_bridge",
        body: "Hello World!"
    })
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Bad Request, invalid input")
    })
  })
  test("404: Responds with page not found when given a invalid username", () => {
    return request(app)
    .post("/api/articles/2/comments")
    .send({
      username: "Darth Vader",
      body: "Hello World!"
    })
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("Resource not found")
    })
  })
  test("400: Responds with bad request when given a invalid post", () => {
    return request(app)
    .post("/api/articles/2/comments")
    .send({
      car: "Ford Mustand",
      age: 1014
    })
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Bad Request, invalid input")
    })
  })
})

describe("PATCH /api/articles/:article_id", () => {
  test("201: Responds with the updated article of the given article ID", () => {
    return request(app)
    .patch("/api/articles/6")
    .send({
      inc_votes: 1
    })
    .expect(201)
    .then(({body}) => {
      expect(body.article).toMatchObject({
        article_id: 6,
        title: "A",
        topic: "mitch",
        author: "icellusedkars",
        body: "Delicious tin of cat food",
        created_at: expect.any(String),
        votes: 1,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"  
      })
    })
  })
  test("201: Responds with the updated article of the given article ID", () => {
    return request(app)
    .patch("/api/articles/1")
    .send({
      inc_votes: -100
    })
    .expect(201)
    .then(({body}) => {
      expect(body.article).toMatchObject({
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: expect.any(String),
        votes: 0,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      })
    })
  })
  test("400: Responds with a bad request, when given an invalid ID", () => {
    return request(app)
    .patch("/api/articles/darthvader")
    .send({
      inc_votes: 1
    })
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Bad Request, invalid input")
    })
  })
  test("404: Responds with page not found, when given an valid ID but article ID is not found", () => {
    return request(app)
    .patch("/api/articles/50")
    .send({
      inc_votes: 1
    })
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("Resource not found")
    })
  })
})

describe("DELETE /api/comments/:comment_id", () => {
  test("204: Responds with confirmation. Comment of given comment ID is deleted", () => {
    return request(app)
    .delete("/api/comments/3")
    .expect(204)
    .then(({ body }) => {
      expect(body).toEqual({})
    })
  })
  test("404: Responds with page not found, when given a valid ID but no comment ID is found", () => {
    return request(app)
    .delete("/api/comments/50")
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("Resource not found")
    })
  })
  test("400: Responds with bad request, when given a invalid ID", () => {
    return request(app)
    .delete("/api/comments/apple")
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Bad Request, invalid input")
    })
  })
})