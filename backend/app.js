const express = require('express')
const bodyParser = require('body-parser')
const mysql = require("mysql");

const app = express()

const db_url = 'connect-e.cxu3dbx5ys9k.eu-west-2.rds.amazonaws.com';
const db_user = 'OpenClassrooms';
const db_password = 'VueJS(NodeJS)94';
const db_port = '3306';

const connection = mysql.createConnection({
    host: db_url,
    user: db_user,
    password: db_password,
    port: db_port,
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