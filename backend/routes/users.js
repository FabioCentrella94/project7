const express = require('express')
const router = express.Router()

const auth = require('../middleware/auth')

const usersCtrl = require('../controllers/users')

router.post('/signup', usersCtrl.signup)
router.post('/login', usersCtrl.login)
router.get('/profile/:userId', auth, usersCtrl.getUserDetails)
router.delete('/deleteprofile/:userId', auth, usersCtrl.deleteProfile)

module.exports = router