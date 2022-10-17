const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; // Extraction du token de la requête entrante
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY); // Vérification du token
        const userId = decodedToken.userId; // Extraction de l'userID puis ajout à l'objet Request
        req.auth = {
            userId: userId
        };
        console.log(userId);
        if (req.body.userId && req.body.userId !== userId) {
            throw 'Invalid user ID';
          } else {
            next();
          }
    } catch(error) {
        res.status(401).json({ error });
    }
}