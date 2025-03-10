\c nc_news_test;

SELECT * FROM comments;

SELECT * FROM articles;

SELECT 
    articles.article_id,
    articles.title,
    articles.topic,
    articles.author,
    articles.created_at,
    articles.votes,
    articles.article_img_url,
    COUNT(comments.article_id) AS comment_count
FROM 
articles
LEFT OUTER JOIN 
comments
ON 
articles.article_id = comments.article_id
GROUP BY 
articles.article_id
ORDER BY
articles.created_at
DESC;