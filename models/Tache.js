const mongoose = require('mongoose');


const tacheSchema = new mongoose.Schema({

    title:{
        type:String,
        required:true,
        trim:true
    },


    description:{
        type:String
    },


    status:{
        type:String,
        enum:[
            "A faire",
            "En cours",
            "Terminée"
        ],
        default:"A faire"
    },


    priority:{
        type:String,
        enum:[
            "basse",
            "moyenne",
            "élevée"
        ],
        default:"moyenne"
    },


    Date_debut:{
        type:Date
    },


    Date_limite:{
        type:Date
    },


    Date_fin:{
        type:Date
    },


    // Celui qui crée la tâche
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },


    // Personne responsable de la tâche
    assignedTo:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }



},{timestamps:true});


module.exports = mongoose.model("Tache",tacheSchema);