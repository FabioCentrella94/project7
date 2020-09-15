const express = require('express')
const bodyParser = require('body-parser')
const mysql = require("mysql");

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

module.exports = app