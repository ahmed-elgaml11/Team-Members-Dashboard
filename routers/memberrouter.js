const express = require('express')
const router = express.Router()
const membercontroller = require('../controllers/membercontrollers')
const Member = require('../models/membermodels')
const multer = require('multer')
const path = require('node:path')
const mongoos = require('mongoose');
const {ObjectId} = mongoos.Types
const { check, validationResult } = require('express-validator');








const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb (null, path.join(__dirname, '..', 'uploads'))
    },

    filename: function (req, file, cb){
        const uniquesuffix = Date.now()+'-'+Math.round(Math.random()*1e9)
        cb(null, file.fieldname+'-'+uniquesuffix + path.extname(file.originalname))
    }
})
const upload = multer({ storage: storage });





// route handlers

router.get('/', membercontroller.all_members)

router.get('/add', membercontroller.make_form)

router.post('/add', upload.single('image'),[
    check('Name').isLength({min: 7, max: 60 }).withMessage('the name must be between 7:60 characters '),
    check('Age').isInt({min: 18, max: 40}).withMessage('age must be between 18 and 40'),
    check('Email').isEmail().withMessage('Must be a valid email'),
    check('Phone').matches(/^01[0,1,2,5][0-9]{8}$/).withMessage('Must be a valid phone number.')

],membercontroller.add_member)



router.get('/details/:id', membercontroller.details)



router.get('/edit/:id', membercontroller.edit_form) 


router.post('/edit/:id', upload.single('image'), [
    check('Name').isLength({min: 7,max: 60 }).withMessage('the name must be between 7:60 characters '),
    check('Age').isInt({min: 18, max: 30}).withMessage('age must be between 18 and 30'),
    check('Email').isEmail().withMessage('Must be a valid email'),
    check('Phone').matches(/^01[0,1,2,5][0-9]{8}$/).withMessage('Must be a valid phone number.')

],membercontroller.update)

router.post('/delete/:id',membercontroller.delete_member)



module.exports =router