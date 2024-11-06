// PRODUCTION ENVIRONMENT
/*
const AWS = require("aws-sdk");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { fetchSecret } = require("../middleware/fetchSecret");
const { connectToDb } = require("../middleware/dbConfig");

exports.signup = (req, res, next) => {
  bcrypt.hash(req.body.password, 12).then((hash) => {
    let sql =
      'INSERT INTO Users (Username, Email, Password) VALUES ("' +
      req.body.username +
      '", "' +
      req.body.email +
      '", "' +
      hash +
      '")';
    connectToDb()
      .then((database) => {
        database.query(sql, function (err, result, fields) {
          if (err) {
            if (err.sqlMessage.includes("Username"))
              return res.json({
                status: "409",
                message: "Username already used!",
                data: err,
              });
            if (err.sqlMessage.includes("Email"))
              return res.json({
                status: "409",
                message: "Email already used!",
                data: err,
              });
            else
              return res.json({
                status: err.status,
                message: err.sqlMessage,
                data: err,
              });
          }
          res.json({
            status: "201",
            message: "User saved successfully!",
            data: null,
          });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

exports.login = (req, res, next) => {
  let sqlFind =
    'SELECT * FROM Users WHERE Username="' + req.body.username + '";';
  connectToDb()
    .then((database) => {
      database.query(sqlFind, function (err, result, fields) {
        if (err)
          return res.json({
            status: err.status,
            message: err.sqlMessage,
            data: err,
          });
        if (result.length < 1)
          return res.json({
            status: "404",
            message: "User Not Found",
            data: null,
          });
        bcrypt
          .compare(req.body.password, result[0].Password)
          .then((valid) => {
            if (!valid) {
              return res.json({
                status: "401",
                message: "Incorrect Password!",
                data: null,
              });
            }
            fetchSecret()
              .then((secret) => {
                const token = jwt.sign({ userId: result[0].UserID }, secret, {
                  expiresIn: "1h",
                });
                res.json({
                  status: "200",
                  message: "null",
                  data: {
                    userId: result[0].UserID,
                    token: token,
                  },
                });
              })
              .catch((err) => {
                console.log(err);
              });
          })
          .catch((err) => {
            res.json({
              status: "500",
              message: null,
              data: err,
            });
          });
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getUserDetails = (req, res, next) => {
  let sql = 'SELECT * FROM Users WHERE UserID = "' + req.params.userId + '";';
  connectToDb()
    .then((database) => {
      database.query(sql, function (err, result, fields) {
        if (err)
          return res.json({
            status: err.status,
            message: err.sqlMessage,
            data: err,
          });
        res.json({
          status: "200",
          message: null,
          data: result,
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.deleteProfile = (req, res, next) => {
  let sqlSelect =
    'SELECT * FROM Posts WHERE UserID = "' + req.params.userId + '";';
  connectToDb()
    .then((database) => {
      database.query(sqlSelect, function (err, result, fields) {
        if (err)
          return res.json({
            status: err.status,
            message: err.sqlMessage,
            data: err,
          });
        const s3 = new AWS.S3();
        for (i = 0; i < result.length; i++) {
          const params = {
            Bucket: "project7-images",
            Key: result[i].ImageURL.replace(
              "https://project7-images.s3.eu-west-2.amazonaws.com/",
              ""
            ),
          };
          s3.deleteObject(params, function (err, data) {
            if (err)
              return res.json({
                status: err.Code,
                message: err.Message,
                data: err,
              });
          });
        }
      });
    })
    .catch((err) => {
      res.json({
        status: "500",
        message: err,
        data: null,
      });
    });
  let sql = 'DELETE FROM Users WHERE UserID = "' + req.params.userId + '";';
  connectToDb()
    .then((database) => {
      database.query(sql, function (err, result, fields) {
        if (err)
          return res.json({
            status: err.status,
            message: err.sqlMessage,
            data: err,
          });
        res.json({
          status: "200",
          message: "Profile Deleted",
          data: null,
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
*/

// DEVELOPMENT ENVIRONMENT
const AWS = require('aws-sdk')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
let db = require('../middleware/dbConfig');

exports.signup = (req, res, next) => {
  bcrypt.hash(req.body.password, 12).then(hash => {
    let sql = 'INSERT INTO Users (Username, Email, Password) VALUES ("'+req.body.username+'", "'+req.body.email+'", "'+hash+'")'
       db.query(sql, function (err, result, fields) {
      if (err) {
        if (err.sqlMessage.includes('Username'))
          return res.json({
            status: '409',
            message: "Username already used!",
            data: err
          })
        if (err.sqlMessage.includes('Email')) 
          return res.json({
            status: '409',
            message: "Email already used!",
            data: err
          })
        else 
          return res.json({
            status: err.status,
            message: err.sqlMessage,
            data: err
          })
        }
      res.json({
        status: '201',
        message: 'User saved successfully!',
        data: null
      })
    })
  }
)}

exports.login = (req, res, next) => {
  let sqlFind = 'SELECT * FROM Users WHERE Username="'+req.body.username+'";'
  db.query(sqlFind, function (err, result, fields) {
    if (err) return res.json({
      status: err.status,
      message: err.sqlMessage,
      data: err
    })
    if (result.length < 1) return res.json({
        status: '404',
        message: 'User Not Found',
        data: null
      })
      bcrypt.compare(req.body.password, result[0].Password)
        .then(valid => {
          if (!valid) {
            return res.json({
              status: '401',
              message: 'Incorrect Password!',
              data: null
            })
          }
          const token = jwt.sign(
            { userId: result[0].UserID },
            "dajkfjakjkfadfaduirueqir847jfancmnahjkfanvh12hj3hjfafkjfa",
            { expiresIn: '1h' }
          )
          res.json({
            status: '200',
            message: 'null',
            data: {
              userId: result[0].UserID,
              token: token
            }
          })
        }).catch(err => {
          res.json({
            status: '500',
            message: null,
            data: err
          })
        })
    })
}

exports.getUserDetails = (req, res, next) => {
  let sql = 'SELECT * FROM Users WHERE UserID = "'+req.params.userId+'";'
  db.query(sql, function (err, result, fields) {
    if (err) return res.json({
      status: err.status,
      message: err.sqlMessage,
      data: err
    })
    res.json({
      status: '200',
      message: null,
      data: result
    })
  })
}

exports.deleteProfile = (req, res, next) => {
  let sqlSelect = 'SELECT * FROM Posts WHERE UserID = "'+req.params.userId+'";'
  db.query(sqlSelect, function (err, result, fields) {
    if (err) return res.json({
      status: err.status,
      message: err.sqlMessage,
      data: err
    })
    const s3 = new AWS.S3()
    for (i = 0; i < result.length; i++) {
      const params = {
        Bucket: 'project7-images',
        Key: result[i].ImageURL.replace(
          'https://project7-images.s3.eu-west-2.amazonaws.com/',
          ''
        )
      }
      s3.deleteObject(params, function (err, data) {
        if (err) return res.json({
          status: err.Code,
          message: err.Message,
          data: err
        })
      })
    }
  })
  let sql = 'DELETE FROM Users WHERE UserID = "'+req.params.userId+'";'
  db.query(sql, function (err, result, fields) {
    if (err) return res.json({
      status: err.status,
      message: err.sqlMessage,
      data: err
    })
    res.json({
      status: '200',
      message: 'Profile Deleted',
      data: null
    })
  })
}
