const express = require('express')
const bodyParser = require('body-parser')

const postsRoutes = require('./routes/posts')
const usersRoutes = require('./routes/users')

const app = express()

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
    )
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, PATCH, OPTIONS'
    )
    next()
})

app.use(bodyParser.json())

app.use('/api/post', postsRoutes)
app.use('/api/auth', usersRoutes)

module.exports = app