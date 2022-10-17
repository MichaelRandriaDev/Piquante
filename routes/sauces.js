const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const stuffCtrl = require('../controllers/stuff'); // Je récupère mon controller "stuff"

router.post('/', auth, multer, stuffCtrl.createThing); // en cas de POST sur l'url ./, je lance la fonction "createThing" de mon controller
router.post('/:id/like', stuffCtrl.likeSauce);
router.put('/:id', auth, multer, stuffCtrl.modifyThing);
router.delete('/:id', auth, stuffCtrl.deleteThing);
router.get('/:id', auth, stuffCtrl.getOneThing);
router.get('/', auth, stuffCtrl.getAllThings);

module.exports = router;