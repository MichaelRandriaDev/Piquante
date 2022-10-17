const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const sauceRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');

const app = express(); // Création de l'app

mongoose.connect(process.env.MONGODB, // Connection à la base de données
{ useNewUrlParser: true,
  useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));
  
  app.use(express.json()); // Toutes les requêtes seront traîtées en JSON
  
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Accès API depuis n'importe quelle origine
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); // Ajout des headers aux requêtes envoyées vers l'API
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // Différentes méthodes d'envoi de requête
    next();
  });
  
  app.use('/api/sauces', sauceRoutes); // Utilise le fichier sauces.js (l.5) pour router les requêtes faites vers localhost:4200/sauces
  app.use('/api/auth', userRoutes);
  app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app; // Rend accessible depuis d'autres fichiers via un require