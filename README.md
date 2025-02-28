# NC News Seeding

To allow access to this code please follow the following instructions:

- Instructions for setting up the .env file are:
    1) Create a file name ".env.development".
    2) Write the following text in .env.development; "PGDATABASE=nc_news".
    3) DO NOT include a semi colon!
    4) Save this file.
    5) Create another file name ".env.test".
    6) Write the following test in .env.test; "PGDATABASE=nc_news_test".
    7) DO NOT include a semi colon!
    8) These files should be 'greyed out' as the .gitignore file includes ".env.*". This is ensure that these newly created .env files are not pushed to GitHub.
