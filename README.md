# discussion_forum
discussion forum based on stack overflow, with improved usability and accessibility.

![Home Page](/images/home_page.png)

![Post Page](/images/post_page.png)

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

#### Python set up

Python 2 should be installed for the report issue feature and create HTML/save data in DB scripts to run.

