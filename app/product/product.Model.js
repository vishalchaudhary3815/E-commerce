const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        uppercase:true
    },
    size:{
        type:String,
        required:true,
        uppercase:true
    },
    statusId:{
        type:Number,
        enum:[0,1] ,    //0 for active and 1 for inactive
        required:true,
    },
    description:{
        type:String,
        required:true
    },
    coverPicture:{
        type:String,
        require:true
    },
    images:[
       {
        val:{
            type:String
        }
       }
    ],
    createdby:{
        type:mongoose.Types.ObjectId,
        ref:"userdatas"
    },
},{
    timestamps:true
})

module.exports = mongoose.model('ProductData',productSchema)