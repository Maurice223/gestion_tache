const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");


const userSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true
    },


    surname:{
        type:String
    },


    email:{
        type:String,
        required:true,
        unique:true
    },


    password:{
        type:String,
        required:true
    },


    role:{
        type:String,
        enum:["admin","lead", "user"],
        default:"user"
    }


});



// Vérification du mot de passe
userSchema.methods.matchPassword = async function(password){

    return await bcrypt.compare(
        password,
        this.password
    );

};


module.exports = mongoose.model("User",userSchema);