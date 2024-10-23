// import 
const express = require('express');
const exress = require('express');
const mongoos = require('mongoose');
require('dotenv').config(); 







// initialise app , middlewares
const app = express();




// connect to db
let username = process.env.MONGO_USERNAME;
let password = process.env.MONGO_PASSWORD;
let dbName = process.env.MONGO_DB_NAME;

let uri = `mongodb+srv://${username}:${password}@learn-mongo-db.uuvf8.mongodb.net/${dbName}?retryWrites=true&w=majority&appName=learn-mongo-db`;
mongoos.connect(uri)
    .then(() => {
        let port = 5555;
        app.listen((port),() => {
            console.log('connected to database and listening at ${port}')
        })
    })
    .catch(err => console.log(`cant connect: ${err}`))







// route handlers