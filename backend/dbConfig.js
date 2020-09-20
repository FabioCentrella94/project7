const mysql = require("mysql");

let dbConfig = {
    host     : 'connect-e.cxu3dbx5ys9k.eu-west-2.rds.amazonaws.com',
    user     : 'OpenClassrooms',
    password : 'VueJS(NodeJS)94',
    port: '3306',
    multipleStatements: true
  };

let connection = mysql.createConnection(dbConfig);

connection.connect(function(err) {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to AWS MySQL.');
});

module.exports = connection


