require('dotenv').config()
const mysql = require("mysql");

let dbConfig = ({
  host     : 'project7.cxu3dbx5ys9k.eu-west-2.rds.amazonaws.com',
  user     : process.env.AWS_RDS_USER,
  password : process.env.AWS_RDS_PASSWORD,
  port     : '3306',
  database: 'Connect_E',
  multipleStatements: true
});

let connection = mysql.createConnection(dbConfig);

connection.connect(function(err) {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to AWS MySQL.');
});

module.exports = connection

