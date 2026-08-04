const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


// Générer un token JWT
const generateToken = (id) => {

    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        {
            expiresIn: '1d'
        }
    );

};



// =========================
// REGISTER
// =========================

exports.register = async (req, res) => {

    const { name, surname, email, password, role } = req.body;


    try {

        // Vérifier si l'utilisateur existe déjà
        const userExists = await User.findOne({ email });


        if (userExists) {

            return res.status(400).json({
                message: "Utilisateur déjà existant"
            });

        }



        // Hachage du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);



        // Création utilisateur
        const user = await User.create({

            name,
            surname,
            email,
            password: hashedPassword,
            role

        });



        res.status(201).json({

            message: "Utilisateur créé avec succès",

            _id: user._id,
            name: user.name,
            surname: user.surname,
            email: user.email,
            role: user.role,

            token: generateToken(user._id)

        });



    } catch (error) {


        console.log(error);


        res.status(500).json({

            message: error.message

        });


    }

};




// =========================
// LOGIN
// =========================

exports.login = async (req, res) => {


    const { email, password } = req.body;


    try {


        // Chercher l'utilisateur
        const user = await User.findOne({ email });



        if (!user) {

            return res.status(401).json({

                message: "Email ou mot de passe incorrect"

            });

        }



        // Comparer le mot de passe
        const passwordCorrect = await bcrypt.compare(
            password,
            user.password
        );



        if (!passwordCorrect) {

            return res.status(401).json({

                message: "Email ou mot de passe incorrect"

            });

        }




        // Retourner les informations + token

        res.json({

            message: "Connexion réussie",

            _id: user._id,
            name: user.name,
            surname: user.surname,
            email: user.email,
            role: user.role,

            token: generateToken(user._id)

        });



    } catch(error) {


        console.log(error);


        res.status(500).json({

            message:error.message

        });


    }


};