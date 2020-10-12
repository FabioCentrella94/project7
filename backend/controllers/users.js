const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
let db = require('../dbConfig');

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
            'FKDAFJKA775JKJFDKAnfamnkjfka-fadfajkjfkadf89kfdka/fafak*kfdajkfjakjkfadfaduirueqir847jfancmnahjkfanvh12hj3hjfafkjfa',
            { expiresIn: '1h' }
          )
          res.json({
            status: '200',
            message: 'null',
            data: {
              userId: result[0].UserID,
              email: result[0].Email,
              token: token,
              username: result[0].Username,
              loginTime: result[0].LoginTime
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