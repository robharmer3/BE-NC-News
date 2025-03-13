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
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        comment_count: 2 
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
          comment_count : expect.any(Number)
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
  test("200: Responds with the updated article of the given article ID", () => {
    return request(app)
    .patch("/api/articles/6")
    .send({
      inc_votes: 1
    })
    .expect(200)
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
  test("200: Responds with the updated article of the given article ID", () => {
    return request(app)
    .patch("/api/articles/1")
    .send({
      inc_votes: -100
    })
    .expect(200)
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
  test("400: Responds with bad request, when not given valid votes", () => {
    return request(app)
    .patch("/api/articles/3")
    .send({
      apple: "Hello"
    })
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Bad Request, invalid input")
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

describe("GET /api/users", () => {
  test("200: Responds with all users", () => {
    return request(app)
    .get("/api/users")
    .expect(200)
    .then(({ body }) => {
      expect(body.users.length).toBe(4)
      body.users.forEach((user) => {
        expect(user).toMatchObject({
          username: expect.any(String),
          name: expect.any(String),
          avatar_url: expect.any(String)
        })
      })
    })
  })
  test("404: Responds with an 404 error message if endpoint is invalid", () => {
    return request(app)
    .get("/api/user")
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("Page not found")
    })
  })
})

describe("GET /api/articles (sorted queries)", () => {
  test("200: Responds with all articles, sorted by article ID descending",() => {
    return request(app)
    .get("/api/articles?sort_by=article_id&&limit=13")
    .expect(200)
    .then(({body}) => {
      expect(body.articles.length).toBe(13)
      expect(body.articles).toBeSorted({key: "article_id", descending: true})
      })
    }
  )
  test("200: Responds with all articles, sorted by title descending",() => {
    return request(app)
    .get("/api/articles?sort_by=title&&limit=13")
    .expect(200)
    .then(({body}) => {
      expect(body.articles.length).toBe(13)
      expect(body.articles).toBeSorted({key: "title", descending: true})
      })
    }
  )
  test("200: Responds with all articles, sorted by topic descending",() => {
    return request(app)
    .get("/api/articles?sort_by=topic&&limit=13")
    .expect(200)
    .then(({body}) => {
      expect(body.articles.length).toBe(13)
      expect(body.articles).toBeSorted({key: "topic", descending: true})
      })
    }
  )
  test("200: Responds with all articles, sorted by author descending",() => {
    return request(app)
    .get("/api/articles?sort_by=author&&limit=13")
    .expect(200)
    .then(({body}) => {
      expect(body.articles.length).toBe(13)
      expect(body.articles).toBeSorted({key: "author", descending: true})
      })
    }
  )
  test("200: Responds with all articles, sorted by created_at descending (DEFAULT)",() => {
    return request(app)
    .get("/api/articles?limit=13")
    .expect(200)
    .then(({body}) => {
      expect(body.articles.length).toBe(13)
      expect(body.articles).toBeSorted({key: "created_at", descending: true})
      })
    }
  )
  test("200: Responds with all articles, sorted by votes descending",() => {
    return request(app)
    .get("/api/articles?sort_by=votes&&limit=13")
    .expect(200)
    .then(({body}) => {
      expect(body.articles.length).toBe(13)
      expect(body.articles).toBeSorted({key: "votes", descending: true})
      })
    }
  )
  test("200: Responds with all articles, sorted by article_img_url descending",() => {
    return request(app)
    .get("/api/articles?sort_by=article_img_url&&limit=13")
    .expect(200)
    .then(({body}) => {
      expect(body.articles.length).toBe(13)
      expect(body.articles).toBeSorted({key: "article_img_url", descending: true})
      })
    }
  )
  test("200: Responds with all articles, sorted by article ID ascending",() => {
    return request(app)
    .get("/api/articles?sort_by=article_id&&order=asc&&limit=13")
    .expect(200)
    .then(({body}) => {
      expect(body.articles.length).toBe(13)
      expect(body.articles).toBeSorted({key: "article_id", descending: false})
      })
    }
  )
  test("200: Responds with all articles, sorted by title ascending",() => {
    return request(app)
    .get("/api/articles?sort_by=title&&order=asc&&limit=13")
    .expect(200)
    .then(({body}) => {
      expect(body.articles.length).toBe(13)
      expect(body.articles).toBeSorted({key: "title", descending: false})
      })
    }
  )
  test("200: Responds with all articles, sorted by topic ascending",() => {
    return request(app)
    .get("/api/articles?sort_by=topic&&order=asc&&limit=13")
    .expect(200)
    .then(({body}) => {
      expect(body.articles.length).toBe(13)
      expect(body.articles).toBeSorted({key: "topic", descending: false})
      })
    }
  )
  test("200: Responds with all articles, sorted by author ascending",() => {
    return request(app)
    .get("/api/articles?sort_by=author&&order=asc&&limit=13")
    .expect(200)
    .then(({body}) => {
      expect(body.articles.length).toBe(13)
      expect(body.articles).toBeSorted({key: "author", descending: false})
      })
    }
  )
  test("200: Responds with all articles, sorted by created_at ascending",() => {
    return request(app)
    .get("/api/articles?order=asc&&limit=13")
    .expect(200)
    .then(({body}) => {
      expect(body.articles.length).toBe(13)
      expect(body.articles).toBeSorted({key: "created_at", descending: false})
      })
    }
  )
  test("200: Responds with all articles, sorted by votes ascending",() => {
    return request(app)
    .get("/api/articles?sort_by=votes&&order=asc&&limit=13")
    .expect(200)
    .then(({body}) => {
      expect(body.articles.length).toBe(13)
      expect(body.articles).toBeSorted({key: "votes", descending: false})
      })
    }
  )
  test("200: Responds with all articles, sorted by article_img_url ascending",() => {
    return request(app)
    .get("/api/articles?sort_by=article_img_url&&order=asc&&limit=13")
    .expect(200)
    .then(({body}) => {
      expect(body.articles.length).toBe(13)
      expect(body.articles).toBeSorted({key: "article_img_url", descending: false})
      })
    }
  )
  test("400: Responds with bad request when sorted by is invalid",() => {
    return request(app)
    .get("/api/articles?sort_by=apple")
    .expect(400)
    .then(({body}) => {
      expect(body.msg).toBe("Bad Request, invalid input")
      })
    }
  )
  test("400: Responds with bad request when order by is invalid",() => {
    return request(app)
    .get("/api/articles?order=apple")
    .expect(400)
    .then(({body}) => {
      expect(body.msg).toBe("Bad Request, invalid input")
      })
    }
  )
})

describe("GET /api/articles (topic queries)", () => {
  test("200: Responds with all articles with given topic",() => {
    return request(app)
    .get("/api/articles?topic=mitch&&limit=13")
    .expect(200)
    .then(({body}) => {
      expect(body.articles.length).toBe(12)
      body.articles.forEach(article => {
        expect(article.topic).toBe("mitch")
        })
      });
    }
  )
  test("200: Responds with all articles when no topic is given",() => {
    return request(app)
    .get("/api/articles?limit=13")
    .expect(200)
    .then(({body}) => {
      expect(body.articles.length).toBe(13)
      })
    }
  )
  test("200: Responds with empty array when topic exist but there are no articles",() => {
    return request(app)
    .get("/api/articles?topic=paper&&limit=13")
    .expect(200)
    .then(({body}) => {
      expect(body.articles.length).toBe(0)
      })
    }
  )
  test("404: Responds with resource not found when topic is valid but not found",() => {
    return request(app)
    .get("/api/articles?topic=magic")
    .expect(404)
    .then(({body}) => {
      expect(body.msg).toBe("Resource not found")
      })
    }
  )
})

describe("GET /api/articles/:article_id (comment_count)", () => {
  test("200: Responds with the total of all comments with the given article ID", () => {
    return request(app)
    .get("/api/articles/1")
    .expect(200)
    .then(({body}) => {
      expect(body.article.comment_count).toBe(11)
    })
  })
})

describe("GET /api/users/:username", () => {
  test("200: Responds with an user object of the given username", () => {
    return request(app)
    .get("/api/users/butter_bridge")
    .expect(200)
    .then(({body}) => {
      expect(body.user).toMatchObject({
        username: "butter_bridge",
        name: "jonny",
        avatar_url: "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg"
      })
    })
  })
  test("404: Responds with resouce not found object of the given username that doesnt exist", () => {
    return request(app)
    .get("/api/users/darth_vader")
    .expect(404)
    .then(({body}) => {
      expect(body.msg).toBe("Resource not found")
    })
  })
})

describe("PATCH /api/comments/:comment_id", () => {
  test("200: Responds with updated comment", () => {
    return request(app)
    .patch("/api/comments/3")
    .send({
      inc_votes: 1
    })
    .expect(200)
    .then(({ body }) => {
      expect(body.comment).toMatchObject({
        comment_id: 3,
        article_id: 1,
        body: "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.",
        votes: 101,
        author: "icellusedkars",
        created_at: expect.any(String),
      })
    })
  })
  test("200: Responds with updated comment", () => {
    return request(app)
    .patch("/api/comments/3")
    .send({
      inc_votes: -1
    })
    .expect(200)
    .then(({ body }) => {
      expect(body.comment).toMatchObject({
        comment_id: 3,
        article_id: 1,
        body: "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.",
        votes: 99,
        author: "icellusedkars",
        created_at: expect.any(String),
      })
    })
  })
  test("404: Responds rescource not found when give a valid id that doesnt exist", () => {
    return request(app)
    .patch("/api/comments/50")
    .send({
      inc_votes: 1
    })
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("Resource not found")
    })
  })
  test("400: Responds bad request when give a invalid id", () => {
    return request(app)
    .patch("/api/comments/apple")
    .send({
      inc_votes: 1
    })
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Bad Request, invalid input")
    })
  })
  test("400: Responds bad request when give a misformed body", () => {
    return request(app)
    .patch("/api/comments/3")
    .send({
      cars: "Tesla"
    })
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Bad Request, invalid input")
    })
  })
  test("400: Responds bad request when votes is invalid", () => {
    return request(app)
    .patch("/api/comments/3")
    .send({
      inc_votes: "Tesla"
    })
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Bad Request, invalid input")
    })
  })
})

describe("POST /api/articles", () => {
  test("201: Responds with the newly posted article", () => {
    return request(app)
    .post("/api/articles")
    .send({
      author: "butter_bridge",
      title: "You are wrong if you don't love cats!",
      body: "Hello Cat World",
      topic: "cats"
    })
    .expect(201)
    .then(({body}) => {
      expect(body.article).toMatchObject({
        article_id: 14,
        title: "You are wrong if you don't love cats!",
        topic: "cats",
        author: "butter_bridge",
        body: "Hello Cat World",
        created_at: expect.any(String),
        votes: 0,
        article_img_url: null,
        comment_count: 0
      })
    })
  })
  test("400: Responds with bad request when given a malformed post", () => {
    return request(app)
    .post("/api/articles")
    .send({
      car: "Ford Mustand",
      age: 1014
    })
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Bad Request, invalid input")
    })
  })
  test("404: Responds with not found when given an invaid author", () => {
    return request(app)
    .post("/api/articles")
    .send({
      author: "Darth_Vader",
      title: "I am your father",
      body: "Hello world",
      topic: "cats"
    })
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("Resource not found")
    })
  })
  test("404: Responds with not found request when given an invaid topic", () => {
    return request(app)
    .post("/api/articles")
    .send({
      author: "butter_bridge",
      title: "I am your father",
      body: "Hello world",
      topic: "apples"
    })
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("Resource not found")
    })
  })
})

describe("GET /api/articles (pagination)", () => {
  test("200: Responds with all articles, limited by the given limit query",() => {
    return request(app)
    .get("/api/articles?limit=5")
    .expect(200)
    .then(({body}) => {
      expect(body.articles.length).toBe(5)
      });
    }
  )
  test("200: Responds with all articles, limited by page query",() => {
    return request(app)
    .get("/api/articles?sort_by=article_id&&order=asc&&page=2")
    .expect(200)
    .then(({body}) => {
      expect(body.articles.length).toBe(3)
      expect(body.articles[0].article_id).toBe(11)
      });
    }
  )
  test("200: Responds total_count property",() => {
    return request(app)
    .get("/api/articles?sort_by=article_id&&order=asc&&limit=2")
    .expect(200)
    .then(({body}) => {
      expect(body.articles.length).toBe(2)
      expect(body.total_count).toBe(2)
      });
    }
  )
  test("200: Responds empty array when given a page more than total number of articles",() => {
    return request(app)
    .get("/api/articles?sort_by=article_id&&order=asc&&page=5")
    .expect(200)
    .then(({body}) => {
      expect(body.articles).toEqual([])
      });
    }
  )
  test("400: Responds with bad request when given an invalid limit",() => {
    return request(app)
    .get("/api/articles?limit=apple")
    .expect(400)
    .then(({body}) => {
      expect(body.msg).toBe("Bad Request, invalid input")
      });
    }
  )
  test("400: Responds with bad request when given an invalid page",() => {
    return request(app)
    .get("/api/articles?page=apple")
    .expect(400)
    .then(({body}) => {
      expect(body.msg).toBe("Bad Request, invalid input")
      });
    }
  )
})