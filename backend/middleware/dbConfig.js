// PRODUCTION ENVIRONMENT
const mysql = require("mysql2");
const { Signer } = require("@aws-sdk/rds-signer");
const awsCaBundle = require("aws-ssl-profiles");

let pingDb = false;
let pool;

async function connectToDb() {
  if (typeof pool !== "undefined") {
    return pool;
  }

  const signer = new Signer({
    hostname: "project7.cxu3dbx5ys9k.eu-west-2.rds.amazonaws.com",
    port: 3306,
    username: "project7PublicUser",
    region: "eu-west-2",
  });

  pool = mysql.createPool({
    connectionLimit: 1,
    queueLimit: 10,
    host: "project7.cxu3dbx5ys9k.eu-west-2.rds.amazonaws.com",
    user: "project7PublicUser",
    password: await signer.getAuthToken(),
    database: "Connect_E",
    ssl: awsCaBundle,
    multipleStatements: true,
  });
  pingDb = true;
  return pool;
}

connectToDb()
  .then((pool) => {
    if (pingDb) {
      function keepAlive() {
        pool.getConnection(function (err, connection) {
          if (err) {
            console.error("mysql keepAlive err", err);
            return;
          }
          console.log("ping db");
          connection.ping();
          connection.release();
        });
        pingDb = false;
      }
      setInterval(keepAlive, 27324);
    }
  })
  .catch((err) => {
    console.log(err);
  });

module.exports.connectToDb = connectToDb;

// DEVELOPMENT ENVIRONMENT
/*
require("dotenv").config();
const mysql = require("mysql2");

let dbConfig = {
  host: "project7.cxu3dbx5ys9k.eu-west-2.rds.amazonaws.com",
  user: process.env.AWS_RDS_USER,
  password: process.env.AWS_RDS_PASSWORD,
  port: "3306",
  database: "Connect_E",
  multipleStatements: true,
};

let connection = mysql.createConnection(dbConfig);

connection.connect(function (err) {
  if (err) {
    console.error("Database connection failed: " + err.stack);
    return;
  }
  console.log("Connected to AWS MySQL.");
});

module.exports = connection;
*/
