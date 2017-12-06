# Required Installation

Install Node js version -> 7.10.0

Install elasticsearch

Install MYSQL

Install Redis

Install Python environment from the file requirements.txt using the command

>pip install -r requirements.txt

Install surprise library (https://github.com/NicolasHug/Surprise)

# Extract

In the views folder, extract posts.zip to views/posts folder.
Unzip the folder robotics.stackexchange.com in data folder to data/robotics.stackexchange.com folder.

#Set up

Run command on the terminal
> npm install

Run command on the terminal
> sudo service elasticsearch start

Check status if running
>sudo service elasticsearch status

Check if redis is working and runnning


# Create Data Stores

## MYSQL

Configure the variables in the file config.js according to your setup.

Run the scripts in folder /data/dbdata/Dump20171205.


## Elasticsearch



Run the script **scripts/index_content.py** to index data with elasticsearch.

## Redis 

1. Run the script **create_store.py** from within the scripts folder.
2. Run the script **create_activity.py** from within the scripts folder.
3. Run the script **redis_tester.py** from within the scripts folder.

4. Run the script **redis_helper.py** from within the scripts folder to see if things are working fine.



## Collaborative Filtering

1. Run the script **create_rating.py** from within the scripts folder.

2. Run the script **sample.py** to get the RMSE score of the algorithm. 

3. Run the script **precision.py** from within the scripts folder to see if things are working fine.

4. Run the script **evaluate_on_trainset.py** to get the RMSE score of the algorithm. 


## Run

Execute the following command:

>node index.js



# Code Files look through

/ *.js -> node JS files

index.js -> starting file
routes.js -> containing all routes
dbHelper.js -> MYSQL helper functions
misc.js -> redis JS helper functions


/scripts/*.py -> python scripts

create_store.py -> create datastructures to be stored in redis
create_activity.py -> create datastructures to be stored in redis
redis_tester.py -> create datastructures to be stored in redis

create_page.py-> reads the dataset and creates the html pages for the website in the views/posts folder
save_in_db.py -> reads the dataset and saves the data in DB. file names and few variables have to be changed first according to different tables names.


create_rating.py -> creates user-item matrix for collaborative filtering

precision.py -> runs the surprise package to get the precision value
evaluate_on_trainset.py -> runs the surprise package to get the precision value
sample.py -> runs the surprise package to calculate predictions for each user

/public /*.js -> client side JS files.

/views/posts -> all the website pages






