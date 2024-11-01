const mongoos = require('mongoose');
const Schema = mongoos.Schema
const memberSchema = new Schema({
    Name:{
        type: String,
        required: true
    },
    Age:{
        type: Number,
        required: true
    },
    University:{
        type: String,
        required: true
    },
    Email:{
        type: String,
        required: true,
        unique: true
    },
    Phone:{
        type: String,
        required: true
    },
    Technical_Committee:{
        type: Boolean,
        required: true,
        default: false
    },
    NonTechnical_Committee:{
        type: Boolean,
        required: true,
        default: false
    },
    image:{
        type: String,
    }
},{ timestamps: true })  
const Member = mongoos.model('Member',memberSchema)
module.exports = Member;