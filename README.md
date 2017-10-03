# discussion_forum
discussion forum based on stack overflow, with improved usability and accessibility.

![Home Page](/images/home_page.png)

## current progress status

1. Static HTML Pages created from the dataset.
2. Dataset dumped in MYSQL database.
3. Home page fetching 10 links from database.
4. Link clicks on the home page working.

## to-do

1. styling of pages.
2. adition of javascript code in the static HTML pages to support features like comment, upvote, downvote etc.
3. implementation of web sockets.
4. recommendation engine module.
5. user event tracking code.
6. integration of recommendation enginw with the work flow.
7. NLP tasks

## project set up

### Node JS project set up.

1. clone the github project folder.
2. run the command

```
npm install
```

### database set up.

1. run the script in scripts/db_scripts folder in MYSQL workbench.
2. set the username and password according to your Db in config.js file.

OR

you could just import the database from the file ```forum_db_Posts.sql```, which is inside the db_dump/Dump20171002 folder.

### HTML pages set up.

**Static HTML pages have already been created in the views folder. You can skip the following steps.**
 
*Running this code will overwrite those pages. Make sure you delete the static pages, except the ```home.ejs``` file before running the folowing scripts*

1. unzip the apple.meta.stackexchange.com.zip file in data folder.
2. run the scripts in scripts folder to populate the DB and create HTML pages.

run the project by executing the command

```
node index.js
```


