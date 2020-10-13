const express = require('express')
const router = express.Router()

const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')

const sauceCtrl = require('../controllers/posts')

router.get('/', auth, sauceCtrl.getAllPosts)
router.get('/postlikes', auth, sauceCtrl.getAllLikesPosts)
router.get('/postdislikes', auth, sauceCtrl.getAllDislikesPosts)
router.get('/commentslikes', auth, sauceCtrl.getAllLikesComments)
router.get('/commentsdislikes', auth, sauceCtrl.getAllDislikesComments)
router.get('/profile/:userId', auth, sauceCtrl.getUserDetails)
router.get('/singlepost/:postId', auth, sauceCtrl.getSinglePost)
router.get('/comments/:postId', auth, sauceCtrl.getCommentsPost)
router.post('/', auth, multer, sauceCtrl.uploadPost)
router.post('/likepost', auth, sauceCtrl.likePost)
router.post('/dislikepost', auth, sauceCtrl.dislikePost)
router.post('/comment/:postId', auth, sauceCtrl.commentPost)
router.post('/likecomment', auth, multer, sauceCtrl.likeComment)
router.post('/dislikecomment', auth, sauceCtrl.dislikeComment)
router.put('/editpost/:postId', auth, multer, sauceCtrl.editPost)
router.delete('/deletelikepost/:postId/:userId', auth, sauceCtrl.deleteLikePost)
router.delete('/deletedislikepost/:postId/:userId', auth, sauceCtrl.deleteDislikePost)
router.delete('/deletelikecomment/:commentId/:userId', auth, sauceCtrl.deleteLikeComment)
router.delete('/deletedislikecomment/:commentId/:userId', auth, sauceCtrl.deleteDislikeComment)

module.exports = router