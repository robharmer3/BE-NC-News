const endpointsJson = require("../endpoints.json");
const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
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
  test("200: Responds with an array of topic objects", () => {
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
      expect(body.msg).toBe("Page not found, check your spelling?")
    })
  })
})

describe("GET /api/articles/:article_id", () => {
  test("200: Responds with individual article of given ID", () => {
    return request(app)
    .get("/api/articles/3")
    .expect(200)
    .then(({ body }) => {
      console.log(body)
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