const {
  convertTimestampToDate,
  articlesLookUp
} = require("../db/seeds/utils");

describe("convertTimestampToDate", () => {
  test("returns a new object", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result).not.toBe(input);
    expect(result).toBeObject();
  });
  test("converts a created_at property to a date", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result.created_at).toBeDate();
    expect(result.created_at).toEqual(new Date(timestamp));
  });
  test("does not mutate the input", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    convertTimestampToDate(input);
    const control = { created_at: timestamp };
    expect(input).toEqual(control);
  });
  test("ignores includes any other key-value-pairs in returned object", () => {
    const input = { created_at: 0, key1: true, key2: 1 };
    const result = convertTimestampToDate(input);
    expect(result.key1).toBe(true);
    expect(result.key2).toBe(1);
  });
  test("returns unchanged object if no created_at property", () => {
    const input = { key: "value" };
    const result = convertTimestampToDate(input);
    const expected = { key: "value" };
    expect(result).toEqual(expected);
  });
});

describe("articleLookUp", () => {
  test("When given an empty array, return an empty object", () => {
    const input = []
    const output = articlesLookUp(input)
    expect(output).toEqual({})
  })
  test("When give a single article, return an object with a single key:value pair", () => {
    const input = [{
      article_id: 13,
      title: 'Another article about Mitch',
      topic: 'mitch',
      author: 'butter_bridge',
      body: 'There will never be enough articles about Mitch!',
      created_at: "2020-10-11T11:24:00.000Z",
      votes: null,
      article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
    }]
    const output = articlesLookUp(input)
    expect(output).toEqual({ "Another article about Mitch" : 13 })
  })
  test("When give a multiple article, return an object with multiple key:value pair", () => {
    const input =  [
      {
        article_id: 1,
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: '2020-07-09T20:11:00.000Z',
        votes: 100,
        article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
      },
      {
        article_id: 2,
        title: 'Sony Vaio; or, The Laptop',
        topic: 'mitch',
        author: 'icellusedkars',
        body: 'Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.',
        created_at: '2020-10-16T05:03:00.000Z',
        votes: null,
        article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
      },
      {
        article_id: 3,
        title: 'Eight pug gifs that remind me of mitch',
        topic: 'mitch',
        author: 'icellusedkars',
        body: 'some gifs',
        created_at: '2020-11-03T09:12:00.000Z',
        votes: null,
        article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
      }
    ]
    const output = articlesLookUp(input)
    expect(output).toEqual({ 
      'Living in the shadow of a great man' : 1,
      'Sony Vaio; or, The Laptop' : 2,
      'Eight pug gifs that remind me of mitch' : 3
     })
  })
  describe("articlesLookUp - Purity Tests", () => {
    test("Input array is not mutated", () => {
      const input = [{
        article_id: 13,
        title: 'Another article about Mitch',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'There will never be enough articles about Mitch!',
        created_at: "2020-10-11T11:24:00.000Z",
        votes: null,
        article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
      }]
      articlesLookUp(input)
      expect(input).toEqual([{
        article_id: 13,
        title: 'Another article about Mitch',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'There will never be enough articles about Mitch!',
        created_at: "2020-10-11T11:24:00.000Z",
        votes: null,
        article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
      }])
    })
    test("Return object has a new reference in memory", () =>{
      const input = [{
        article_id: 13,
        title: 'Another article about Mitch',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'There will never be enough articles about Mitch!',
        created_at: "2020-10-11T11:24:00.000Z",
        votes: null,
        article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
      }]
      const output = articlesLookUp(input)
      expect(output).not.toBe(input)
    })
  })
})