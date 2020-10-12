const express = require('express')
const router = express.Router()

const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')

const sauceCtrl = require('../controllers/posts')

router.get('/', auth, sauceCtrl.getAllPosts)
router.get('/postlikes', auth, sauceCtrl.getAllLikesPosts)
router.get('/postdislikes', auth, sauceCtrl.getAllDislikesPosts)
router.get('/commentlikes', auth, sauceCtrl.getAllLikesComments)
router.get('/commentdislikes', auth, sauceCtrl.getAllDislikesComments)
router.get('/profile/:userId', auth, sauceCtrl.getUserDetails)
router.get('/singlepost/:postId', auth, sauceCtrl.getSinglePost)
router.get('/comments/:postId', auth, sauceCtrl.getCommentsPost)
router.post('/', auth, multer, sauceCtrl.uploadPost)
router.post('/like', auth, sauceCtrl.likePost)
router.post('/dislike', auth, sauceCtrl.dislikePost)
router.post('/comment/:postId', auth, sauceCtrl.commentPost)
router.put('/editpost/:postId', auth, multer, sauceCtrl.editPost)
router.delete('/deletelikepost/:postId/:userId', auth, sauceCtrl.deleteLikePost)
router.delete('/deletedislikepost/:postId/:userId', auth, sauceCtrl.deleteDislikePost)

module.exports = router