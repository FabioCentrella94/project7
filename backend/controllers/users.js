const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
let db = require('../dbConfig');

exports.signup = (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(hash => {
    let sql = 'INSERT INTO Users (Username, Email, Password) VALUES ("'+req.body.username+'", "'+req.body.email+'", "'+hash+'")'
    db.query(sql, function (err, result, fields) {
      if (err) {
        if (err.sqlMessage.includes('Username')) 
          return res.status(409).json({
            error: new Error('Username already used!')
          })
        if (err.sqlMessage.includes('Email')) 
          return res.status(409).json({
            error: 'Email already used!'
          })
        else 
          return res.status(500).json({
            error: err
          })
        }
      res.status(201).json({
        message: 'User saved successfully!'
      })
    })
  }
)}

exports.login = (req, res, next) => {
  let sqlFind = 'SELECT * FROM Users WHERE Username="'+req.body.username+'";'
  db.query(sqlFind, function (err, result, fields) {
    if (result.length < 1) return res.status(404).json({
        error: 'User Not Found'
      })
      let sqlUpdate = 'UPDATE Users SET LoginTime = now() WHERE Username="'+req.body.username+'";'
      db.query(sqlUpdate, function (err, result, fields) {
        if (err) return res.status(500).json({
            error: err
          })
      })
      bcrypt.compare(req.body.password, result[0].Password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({
              error: 'Incorrect Password!'
            })
          }
          const token = jwt.sign(
            { userId: result[0].UserID },
            'FKDAFJKA775JKJFDKAnfamnkjfka-fadfajk',
            { expiresIn: '24h' }
          )
          res.status(200).json({
            userId: result[0].UserID,
            token: token,
            username: result[0].Username,
            loginTime: result[0].LoginTime
          })
        })
    })
}