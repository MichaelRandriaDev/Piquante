const bcrypt = require('bcrypt'); // Hash de mdp utilisateur
const jwt = require('jsonwebtoken'); // Token d'authentification
require('dotenv').config();

const User = require('../models/user');

exports.signup = (req, res, next) => {
    const passwordValidator = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;

    if (passwordValidator.test(req.body.password)){
        bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
            .then(() => res.status(201).json({ message: 'Utilisateur créé !'}))
            .catch(error => res.status(400).json({ error })); //
        })
        .catch(error => res.status(500).json({ error }));
    }
    else {
        res.status(400).json({message: "Le mot de passe doit faire une taille de 8 caractères minimum et contenir 1 majuscule + 1 minuscule + 1 chiffre + 1 symbole"});
    } 
};

exports.login = (req, res, next) => {
    User.findOne({email: req.body.email})
        .then(user => {
            if (!user) {
                return res.status(401).json({error: 'Utilisateur non trouvé !'});
            }
            //compare le mdp entré au hash
            bcrypt.compare(req.body.password, user.password)
                //on recoit ici un boolean
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({error: 'Mot de passe incorrect !'});
                    } else {
                        res.status(200).json({
                            userId: user._id,
                            token: jwt.sign(
                                {userId: user._id},
                                // clé secrete
                                process.env.SECRET_KEY,
                                {expiresIn: "24h"}
                            )
                        });
                    }
                })
                .catch(error => res.status(500).json({error}));

        })
        .catch(error => res.status(500).json({error}
        ));
};