const express = require('express')
const bodyParser = require('body-parser')

<<<<<<< HEAD
const app = express()

const host = 'connect-e.cxu3dbx5ys9k.eu-west-2.rds.amazonaws.com';
const user = 'OpenClassrooms';
const password = 'VueJS(NodeJS)94';
const port = '3306';

var connection = mysql.createConnection({
  host     : host,
  user     : user,
  password : password,
  port     : port
});

connection.connect(function(err) {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to AWS MySQL.');
});

connection.end();
=======
const postsRoutes = require('./routes/posts')
const usersRoutes = require('./routes/users')

const app = express()
>>>>>>> e8cc3fc9295f8adb701f209b11b32b6bda15d99f

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