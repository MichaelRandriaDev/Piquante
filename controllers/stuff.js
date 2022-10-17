const Sauce = require('../models/sauce');
const fs = require('fs'); // File System

exports.createThing = (req, res, next) => {
    const thingObject = JSON.parse(req.body.sauce);
    const sauce = new Sauce({
      ...thingObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      likes: 0,
      dislikes: 0,
      usersLiked: [' '],
      usersDisliked: [' ']
    });

    sauce.save()
    .then(() => { res.status(201).json({ message: 'Objet enregistré !'})})
    .catch(error => { res.status(400).json({ error: error })})
}

exports.modifyThing = (req, res, next) => {
    const thingObject = req.file ? {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

    delete thingObject._userId;
    Sauce.findOne({_id: req.params.id})
    .then((thing) => {
      if (thing.userId != req.auth.userId) {
        res.status(403).json({ message : 'Non-autorisé' });
      } else {
        Sauce.updateOne({ _id: req.params.id}, { ...thingObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet modifié!' }))
        .catch(error => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    })
};

exports.deleteThing = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then(thing => {
      if (thing.userId != req.auth.userId) {
        res.status(403).json({ message: 'Non-autorisé' });
      } else {
        const filename = thing.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({_id: req.params.id})
          .then(() => { res.status(200).json({ message: 'Objet supprimé' })})
          .catch(error => res.status(401).json({ error }));
        })
      }
    })
    .catch(error => {
      res.status(500).json({ error });
    })
};

exports.getOneThing = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(thing => res.status(200).json(thing))
      .catch(error => res.status(404).json({ error }));
};

exports.getAllThings = (req, res, next) => {
  console.log("ok !");
    Sauce.find()
    .then((sauces) => { res.status(200).json(sauces) })
    .catch(error => res.status(400).json({ error }));
};

exports.likeSauce = (req, res, next) => {
  if (req.body.like == 1) {
      Sauce.updateOne(
          {_id: req.params.id}, 
          {$push: {usersLiked: req.body.userId},
          $inc: {likes: +1}}
      )
      .then(() => res.status(200).json({message: 'Sauce like'}))
      .catch(error => res.status(400).json({error})); 
  }

  if (req.body.like == 0) {
      Sauce.findOne({_id: req.params.id})
      .then((sauce) => {
          if (sauce.usersLiked.includes(req.body.userId)){
              Sauce.updateOne(
                  {_id: req.params.id},
                  {$pull: {usersLiked: req.body.userId},
                  $inc: {likes: -1}}
              )
              .then(() => res.status(200).json({message: 'Like enlevé'}))
              .catch(error => res.status(400).json({error}));
          }
          if (sauce.usersDisliked.includes(req.body.userId)){
              Sauce.updateOne(
                  {_id: req.params.id}, 
                  {$pull: {usersDisliked: req.body.userId},
                  $inc: {dislikes: -1}}
              )
              .then(() => res.status(200).json({message: 'Dislike enlevé'}))
              .catch(error => res.status(400).json({error}));
          }
      })
      .catch(error => res.status(400).json({error}));          
  }

  if (req.body.like == -1) {
      Sauce.updateOne(
          {_id: req.params.id}, 
          {$push: {usersDisliked: req.body.userId},
          $inc: {dislikes: +1}}
      )
      .then(() => res.status(200).json({message: 'Sauce dislike'}))
      .catch(error => res.status(400).json({error}));  
  }
console.log(req.body);
};