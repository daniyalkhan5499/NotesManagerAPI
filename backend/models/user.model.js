const mongoose=require('mongoose');
mongoose.connect("mongodb://localhost:27017/notes");

const userSchema=mongoose.Schema({
     name:String,
     email:String,
     password:String,
     createdOn:{
        type:Date,
        default:new Date().getTime()
     }
});

module.exports=mongoose.model("user",userSchema);