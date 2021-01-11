# node-pg-exercise

To run the app, please follow the instructions below:

in the command line:

1. cd to the project folder

2. install the packages needed for the project, run:
    $ npm install

3. create database, run:
    $ createdb biztime 

4. Load the initial data from data.sql, run:
    $ psql < data.sql
    (for windows user, run psql -f data.sql)

5. start the server, run
    $ node server.js
    or 
    $ nodemon server.js (if you prefer to use nodemon and have nodemon installed)    
  
6. send request to the server by using the tool like "Insomnia"
