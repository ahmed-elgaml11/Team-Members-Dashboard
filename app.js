// import 
const express = require('express');
const mongoos = require('mongoose');
require('dotenv').config(); 
const Member = require('./models/membermodels')
const multer = require('multer')
const path = require('node:path')
const {ObjectId} = mongoos.Types






// initialise app , middlewares
const app = express();
app.set('view engine','ejs')
app.set('views',__dirname+'/views')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true}));
app.use(express.json());
const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb (null,path.join(__dirname,'uploads'))
    },

    filename: function (req, file, cb){
        const uniquesuffix = Date.now()+'-'+Math.round(Math.random()*1e9)
        cb(null, file.fieldname+'-'+uniquesuffix + path.extname(file.originalname))
    }
})
const upload = multer({ storage: storage });




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
    .catch(err => console.log(`cant connect: ${err}`))







// route handlers

app.get('/', (req, res) => {
    Member.find()
    .then((members) => {
        res.render('overview',{members})
    })
    .catch(err => res.status(500).json({err: err}))

})

app.get('/add', (req, res) => {
    res.render('form')
})

app.post('/add', upload.single('image'), (req, res) => {
    let data ={
        Name: req.body.Name,
        Age: req.body.Age,
        University: req.body.University,
        Email: req.body.Email,
        Phone: req.body.Phone,
        Technical_Committee: req.body.Technical_Committee ? true : false,
        NonTechnical_Committee: req.body.NonTechnical_Committee ? true : false,
        image: req.file ? req.file.filename : null
    }
    let member = new Member(data)
    member.save()
    .then((result) => {
            res.redirect('/')
    })
    .catch((err) => {
        res.status(500).json({err: `there is a problem for saving this data:${err}`})
    })
})



app.get('/details/:id', (req, res) => {
    const id = req.params.id;
    if(ObjectId.isValid(id)){
        Member.findById(id)
        .then((member) => {
            if(!member){
                res,status(500),json({err: "this member is not exist"});

            }
            else{
                res.status(200).render('details',{member})
            }
    
        })
        .catch((err) => {
            res,status(500).json({err: err})

        })
    }
    else{
        res.status(400).json({err: "not valid id"})
    }
})
app.get('/edit/:id', (req, res) => {
    const id = req.params.id;
    if(ObjectId.isValid(id)){
        Member.findById(id)
        .then((member) => {
            if(!member){
                res,status(500).json({err: "this member is not exist"});

            }
            else{
                res.status(200).render('edit',{member})
            }
        })
    }

    else{
        res.status(400).json({err: "not valid id"})
    }

})

app.post('/edit/:id', upload.single('image'), (req, res) => {
    let data = {
        Name: req.body.Name,
        Age: req.body.Age,
        University: req.body.University,
        Email: req.body.Email,
        Phone: req.body.Phone,
        Technical_Committee: req.body.Technical_Committee ? true : false ,
        NonTechnical_Committee: req.body.NonTechnical_Committee ? true : false ,
        image: req.file ?  req.file.filename : null
    }
    let id = req.params.id;
    Member.findByIdAndUpdate(id,data)
    .then((member) => {
        if(!member){
            res,status(500).json({err: "this member is not exist"});

        }
        else{
            res.status(200).redirect('/')
        }      
    })
    .catch(err => res.status(500).json({err: err}))

})

app.post('/delete/:id', (req, res) => {
    let id = req.params.id;
    Member.findByIdAndDelete(id)
    .then((member) => {
        if(!member){
            res.status(404).json({err:" the member not found"})
        }
        else{
            res.status(200).redirect('/')
        }
    })
    .catch(err=>res.status(500).json({error:`error deleting this member:${err}`}))
})