# JavaScript Backend Notes

In production grade code we don't allow access to database from anywhere we only allow backend's IP address such as server IP which is on AWS Instance etc. 

We may allow it temporarily for some testing atmost that's it

# Two approaches to connect DB:
1. write the database connection code in index file itself so once it loads db gets connected
2. make a separate folder for db and write the code there and then import it in js which leads to cleaner and modular code.

# DB Connection via Mongoose:

Points to Note: Professional Approach
1. Whenever we try to talk to DB we may face problems so try to wrap it in try catch or promises
2. Database is in another continent means it may take time to talk to DB so use async await always.

After running npm run dev if there is any issue connecting to DB such as with import statements etc check all the import statements first and make sure to include extensions of files as well such as .js

We use app.use when doing some configuraitons or doing middleware settings        