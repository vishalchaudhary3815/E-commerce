const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        uppercase:true
    },
    email:{
        type:String,
        required:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:Number,
        enum:[0,1] ,    //0 for admin and 1 for user
        required:true,
    },
    mobile:{
        type:Number,
        required:true
    }
},{
    timestamps:true
})

module.exports = new mongoose.model('userData',userSchema)