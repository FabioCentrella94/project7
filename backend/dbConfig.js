const mysql = require("mysql");

// let dbConfig = ({
//   host     : 'connect-e.cxu3dbx5ys9k.eu-west-2.rds.amazonaws.com',
//   user     : process.env.AWS_RDS_USER,
//   password : process.env.AWS_RDS_PASSWORD,
//   port     : '3306'
// });

// connection.connect(function(err) {
//   if (err) {
//     console.error('Database connection failed: ' + err.stack);
//     return;
//   }
//   console.log('Connected to AWS MySQL.');
// });

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

