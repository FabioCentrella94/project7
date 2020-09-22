const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
let db = require('../dbConfig');

exports.signup = (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(hash => {
    let sql = 'INSERT INTO Users (Username, Email, Password) VALUES ("'+req.body.username+'", "'+req.body.email+'", "'+hash+'")'
       db.query(sql, function (err, result, fields) {
      if (err) {
        if (err.sqlMessage.includes('Username'))
          return res.json({
            status: '409',
            message: "Username already used!",
            data: null
          })
        if (err.sqlMessage.includes('Email')) 
          return res.json({
            status: '409',
            message: "Username already used!",
            data: null
          })
        else 
          return res.json({
            status: '500',
            message: null,
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
    if (result.length < 1) return res.json({
        status: '404',
        message: 'User Not Found',
        data: null
      })
      let sqlUpdate = 'UPDATE Users SET LoginTime = now() WHERE Username="'+req.body.username+'";'
      db.query(sqlUpdate, function (err, result, fields) {
        if (err) return res.status(500).json({
            status: '500',
            message: null,
            data: err
          })
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
            'FKDAFJKA775JKJFDKAnfamnkjfka-fadfajk',
            { expiresIn: '24h' }
          )
          res.json({
            status: '200',
            message: 'null',
            data: {
              userId: result[0].UserID,
              token: token,
              username: result[0].Username,
              loginTime: result[0].LoginTime
            }
          })
        })
    })
}