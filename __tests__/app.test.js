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