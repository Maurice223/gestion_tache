const jwt = require("jsonwebtoken");
const User = require("../models/User");


exports.protect = async (req,res,next)=>{


    let token;


    if(
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ){

        try{


            // récupérer le token

            token = req.headers.authorization.split(" ")[1];



            // vérifier le token

            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET
            );



            // récupérer l'utilisateur

            req.user = await User.findById(
                decoded.id
            ).select("-password");



            next();



        }catch(error){


            return res.status(401).json({

                message:"Token invalide ou expiré"

            });


        }


    }



    if(!token){

        return res.status(401).json({

            message:"Accès refusé, token manquant"

        });

    }


};