const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    name:{type:String,required:true},
    price:{type:Number,required:true},
    description:{type:String},
    category:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"CategoryModel"
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"UserModel"
    }
},{timestamps:true})

module.exports=mongoose.model("ProductModel",productSchema)
