# NC News Seeding

Link to hosted version: https://be-nc-news-amrw.onrender.com/api

## Project Summary:
This repo is the database and endpoints for the cutting-edge news site NC News. 
The database contains tables for articles, users, comments and topics.
There are various get, patch, post and delete endpoints to interact with this data.

Please follow the below instuction to access this repo.

## Access Instuctions:
To allow access to this code please follow the following instructions:
- Clone the repository from here: https://github.com/robharmer3/BE-NC-News
- To install the necessary dependencies run the script: "npm install"
- Create the necessary .env file, follow the following instructions:
    1) Create a file name ".env.development".
    2) Write the following text in .env.development; "PGDATABASE=nc_news".
    3) DO NOT include a semi colon!
    4) Save this file.
    5) Create another file name ".env.test".
    6) Write the following test in .env.test; "PGDATABASE=nc_news_test".
    7) DO NOT include a semi colon!
    8) These files should be 'greyed out' as the .gitignore file includes ".env.*". This is ensure that these newly created .env files are not pushed to GitHub.
- To seed the database run the script: "npm run seed-prod"
- To run all tests, run the script "npm test"
- To run the seed tests, run the scipt "npm test-seed"
- To run the app tests, run the scrip "npm test app"

## System Requirements:
The minimum recommended version of Node.js that is required is: v23.6.0
The minimum recommended version of Postgres that is required is: v16.8