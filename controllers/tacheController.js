const Tache = require("../models/Tache");
const User = require("../models/User");


// ======================================
// CREER UNE TACHE
// Admin et Lead uniquement
// ======================================

exports.createTache = async (req, res) => {

    try {

        const user = req.user;


        // Vérification rôle

        if (
            user.role !== "admin" &&
            user.role !== "lead"
        ) {

            return res.status(403).json({
                message: "Vous n'avez pas le droit de créer une tâche"
            });

        }



        const {
            title,
            description,
            status,
            priority,
            Date_debut,
            Date_limite,
            assignedTo
        } = req.body;



        // Vérifier l'utilisateur assigné

        const assignedUser = await User.findById(assignedTo);



        if (!assignedUser) {

            return res.status(404).json({
                message:"Utilisateur assigné introuvable"
            });

        }



        // Un lead peut seulement assigner aux users

        if (
            user.role === "lead" &&
            assignedUser.role !== "user"
        ) {

            return res.status(403).json({

                message:
                "Un lead peut seulement assigner une tâche à un utilisateur"

            });

        }



        const tache = await Tache.create({

            title,
            description,
            status,
            priority,

            Date_debut,
            Date_limite,

            createdBy:user._id,

            assignedTo:assignedUser._id

        });



        res.status(201).json({

            message:"Tâche créée avec succès",

            tache

        });



    } catch(error) {


        console.log(error);


        res.status(500).json({

            message:error.message

        });


    }

};






// ======================================
// VOIR LES TACHES
// ======================================

exports.getTaches = async(req,res)=>{


    try {


        const user = req.user;


        let taches;



        // ADMIN
        // voit toutes les tâches

        if(user.role === "admin"){


            taches = await Tache.find()

            .populate(
                "createdBy",
                "name email role"
            )

            .populate(
                "assignedTo",
                "name email role"
            );


        }




        // LEAD
        // voit les tâches qu'il crée
        // et celles assignées à son équipe

        else if(user.role === "lead"){


            const membres = await User.find({

                role:"user"

            }).select("_id");



            const membresIds = membres.map(
                membre=>membre._id
            );



            taches = await Tache.find({

                $or:[

                    {
                        createdBy:user._id
                    },

                    {
                        assignedTo:{
                            $in:membresIds
                        }
                    }

                ]

            })

            .populate(
                "createdBy",
                "name email role"
            )

            .populate(
                "assignedTo",
                "name email role"
            );


        }





        // USER
        // voit seulement ses tâches

        else {


            taches = await Tache.find({

                assignedTo:user._id

            })

            .populate(
                "createdBy",
                "name email role"
            );

        }



        res.json(taches);



    } catch(error){


        res.status(500).json({

            message:error.message

        });


    }


};






// ======================================
// MODIFIER UNE TACHE
// Admin et créateur seulement
// ======================================

exports.updateTache = async(req,res)=>{


    try{


        const tache = await Tache.findById(
            req.params.id
        );


        if(!tache){

            return res.status(404).json({

                message:"Tâche introuvable"

            });

        }



        const user=req.user;



        if(

            user.role !== "admin" &&

            tache.createdBy.toString()
            !== user._id.toString()

        ){

            return res.status(403).json({

                message:"Modification non autorisée"

            });

        }




        Object.assign(
            tache,
            req.body
        );


        await tache.save();



        res.json({

            message:"Tâche modifiée",

            tache

        });



    }catch(error){


        res.status(500).json({

            message:error.message

        });


    }


};






// ======================================
// SUPPRIMER UNE TACHE
// Admin uniquement
// ======================================

exports.deleteTache = async(req,res)=>{


    try{


        const user=req.user;



        if(user.role !== "admin"){


            return res.status(403).json({

                message:
                "Seul l'administrateur peut supprimer"

            });

        }



        const tache =
        await Tache.findById(req.params.id);



        if(!tache){

            return res.status(404).json({

                message:"Tâche introuvable"

            });

        }



        await tache.deleteOne();



        res.json({

            message:"Tâche supprimée"

        });



    }catch(error){


        res.status(500).json({

            message:error.message

        });


    }


};