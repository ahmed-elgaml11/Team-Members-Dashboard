// import 
const express = require('express');
const mongoos = require('mongoose');
require('dotenv').config(); 
const memberRouter = require('./routers/memberrouter')






// initialise app & middlewares
const app = express();
app.set('view engine','ejs')
app.set('views',__dirname+'/views')
app.use(express.static('public'))
app.use(express.static('uploads'))
app.use(express.urlencoded({ extended: true}));
app.use(express.json());





// connect to db
let username = process.env.MONGO_USERNAME;
let password = process.env.MONGO_PASSWORD;
let dbName = process.env.MONGO_DB_NAME;

let uri = `mongodb+srv://${username}:${password}@learn-mongo-db.uuvf8.mongodb.net/${dbName}?retryWrites=true&w=majority&appName=learn-mongo-db`;
mongoos.connect(uri)
    .then(() => {
        let port = 5555;
        app.listen((port),() => {
            console.log(`connected to database and listening at ${port}`)
        })
    })
    .catch(err => console.log(`can't connect to the database: ${err}`))







// route handlers

app.use(memberRouter)

app.use((req,res)=>{
    res.status(404).send('not found page')
})  