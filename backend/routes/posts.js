const express = require('express')
const router = express.Router()

const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')

const sauceCtrl = require('../controllers/posts')

router.get('/', auth, sauceCtrl.getAllSauce)
router.get('/likes', auth, sauceCtrl.getAllLikes)
router.get('/dislikes', auth, sauceCtrl.getAllDislikes)
router.post('/', auth, multer, sauceCtrl.createSauce)
router.get('/:id', auth, sauceCtrl.getOneSauce)
router.put('/:id', auth, multer, sauceCtrl.updateSauce)

router.post('/like', auth, sauceCtrl.likeSauce)
router.post('/dislike', auth, sauceCtrl.dislikeSauce)
router.delete('/deletelike/:postId/:userId', auth, sauceCtrl.deleteLike)
router.delete('/deletedislike/:postId/:userId', auth, sauceCtrl.deleteDislike)




module.exports = router