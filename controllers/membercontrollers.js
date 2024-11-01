const Member = require('../models/membermodels')
const { check, validationResult } = require('express-validator');
const mongoos = require('mongoose');
const {ObjectId} = mongoos.Types
const fs = require('fs');
const path = require('path')




all_members = (req, res) => {
    Member.find()
    .then((members) => {
        res.render('overview',{members})
    })
    .catch((err) => {
        res.status(500).json({err: err})
    })
}

make_form = (req, res) => {
    res.render('form')
}

add_member = (req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }

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
        res.status(500).json({err: `there is a problem for saving this data: => ${err}`})
    })
}

details = (req, res) => {
    const id = req.params.id;
    if(ObjectId.isValid(id)){
        Member.findById(id)
        .then((member) => {
            if(!member){
                res.status(500),json({err: "this member is not exist"});
            }
            else{
                res.status(200).render('details',{member})
            }
    
        })
        .catch((err) => {
            res.status(500).json({err: err})

        })
    }
    else{
        res.status(400).json({err: "not valid id"})
    }
}

edit_form = (req, res) => {
    const id = req.params.id;
    if(ObjectId.isValid(id)){
        Member.findById(id)
        .then((member) => {
            if(!member){
                res.status(500).json({err: "this member is not exist"});
            }
            else{
                res.status(200).render('edit',{member})
            }
        })
    }

    else{
        res.status(400).json({err: "not valid id"})
    }
}


update = (req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }

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
            res.status(500).json({err: "this member is not exist"});

        }
        else{
            res.status(200).redirect('/')
        }      
    })
    .catch(err => res.status(500).json({err: err}))
}

delete_member = (req, res) => {
    let id = req.params.id;
    Member.findById(id)
    .then((member) => {
        const pathtodelete = path.join(__dirname,'..','uploads',member.image)
        Member.findByIdAndDelete(id)
        .then(() => {
            fs.unlink(pathtodelete,(err)=> {
                if(err){
                    return  console.error('Error deleting file:', err);
                }
            })
            res.status(200).redirect('/'); 
        })
        .catch(err=>res.status(500).json({error:`error deleting this member:${err}`}))
    })
    .catch(err=>res.status(400).json({error:`not founf this member:${err}`}))
}


module.exports={
    all_members,
    make_form,
    add_member,
    details,
    edit_form,
    update,
    delete_member
}