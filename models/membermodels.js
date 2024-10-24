const mongoos = require('mongoose');
const Schema = mongoos.Schema

const memberschema = new Schema({
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

})
const Member = mongoos.model('Member',memberschema)
module.exports = Member;