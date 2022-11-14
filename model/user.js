const mongoose = require('mongoose')

const user = new mongoose.Schema({
    username:{
        type:String,
        require:true,
    },
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    token:{
        type:String
    }
})
module.exports = mongoose.model('users',user)