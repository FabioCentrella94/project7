const mysql = require("mysql");

let dbConfig = {
    host     : 'localhost',
    database : 'Connect_E',
    user     : 'root',
    password : 'Java\Spring)RDS)94',
    multipleStatements: true
  };

let connection = mysql.createConnection(dbConfig);

connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected To Local MySQL!");
  })

module.exports = connection

