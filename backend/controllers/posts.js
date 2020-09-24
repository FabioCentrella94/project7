const AWS = require('aws-sdk')
let db = require('../dbConfig');

exports.createSauce = (req, res, next) => {
  const fileName = 'https://sopekocko.s3.eu-west-2.amazonaws.com/' + req.file.key;
  let sql = 'INSERT INTO Posts (UserID, Title, ImageURL) VALUES ("'+req.body.userId+'", "'+req.body.title+'", "'+fileName+'")'
  db.query(sql, function (err, result, fields) {
    if (err) return res.json({
      status: '500',
      message: null,
      data: err
    })
    res.json({
      status: '201',
      message: 'Post saved successfully!',
      data: null
    })
  })
}

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id
  })
    .then(sauce => {
      res.status(200).json(sauce)
    })
    .catch(error => {
      res.status(404).json({
        error: error
      })
    })
}

exports.updateSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }).then(sauce => {
    if (req.file) {
      const s3 = new AWS.S3()
      const params = {
        Bucket: 'sopekocko',
        Key: sauce.imageUrl.replace(
          'https://sopekocko.s3.eu-west-2.amazonaws.com/',
          ''
        )
      }
      s3.deleteObject(params, function (err, data) {
        if (err) console.log(err, err.stack)
        else console.log()
      })
      
      const url = 'https://sopekocko.s3.eu-west-2.amazonaws.com/'
      req.body.sauce = JSON.parse(req.body.sauce)
      sauce = {
        _id: req.params.id,
        userId: req.body.sauce.userId,
        name: req.body.sauce.name,
        manufacturer: req.body.sauce.manufacturer,
        description: req.body.sauce.description,
        mainPepper: req.body.sauce.mainPepper,
        imageUrl: url + req.file.key,
        heat: req.body.sauce.heat
      }
    } else {
      sauce = {
        _id: req.params.id,
        userId: req.body.userId,
        name: req.body.name,
        manufacturer: req.body.manufacturer,
        description: req.body.description,
        mainPepper: req.body.mainPepper,
        heat: req.body.heat
      }
    }

    Sauce.updateOne({ _id: req.params.id }, sauce)
      .then(() => {
        res.status(201).json({
          message: 'Sauce updated successfully!'
        })
      })
      .catch(error => {
        res.status(400).json({
          error: error
        })
      })
  })
}

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }).then(sauce => {
    const s3 = new AWS.S3()
    const params = {
      Bucket: 'sopekocko',
      Key: sauce.imageUrl.replace(
        'https://sopekocko.s3.eu-west-2.amazonaws.com/',
        ''
      )
    }
    s3.deleteObject(params, function (err, data) {
      if (err) console.log(err, err.stack)
      else console.log()
    })
    Sauce.deleteOne(sauce)
      .then(() => {
        res.status(200).json({
          message: 'Sauce deleted successfully!'
        })
      })
      .catch(error => {
        res.status(400).json({
          error: error
        })
      })
  })
}

exports.getAllSauce = (req, res, next) => {
  let sql = 'SELECT * FROM Posts'
  db.query(sql, function (err, result, fields) {
    if (err) return res.status(400).json({
      error: err
    })
    res.status(200).json(result)
  })
}

exports.getAllLikes = (req, res, next) => {
  let sql = 'SELECT * FROM Likes'
  db.query(sql, function (err, result, fields) {
    if (err) return res.status(400).json({
      error: err
    })
    res.status(200).json(result)
  })
}

exports.getAllDislikes = (req, res, next) => {
  let sql = 'SELECT * FROM Dislikes'
  db.query(sql, function (err, result, fields) {
    if (err) return res.status(400).json({
      error: err
    })
    res.status(200).json(result)
  })
}

exports.likeSauce = (req, res, next) => {
  let sql = 'INSERT INTO Likes (PostID, UserID) VALUES ("'+req.body.postId+'", "'+req.body.userId+'")'
  db.query(sql, function (err, result, fields) {
    if (err) return res.json({
      status: '400',
      message: null,
      data: err
    })
    res.json({
      status: '200',
      message: 'Preference updated!',
      data: null
    })
  })
}

exports.dislikeSauce = (req, res, next) => {
  let sql = 'INSERT INTO Dislikes (PostID, UserID) VALUES ("'+req.body.postId+'", "'+req.body.userId+'")'
  db.query(sql, function (err, result, fields) {
    if (err) return res.json({
      status: '400',
      message: null,
      data: err
    })
    res.json({
      status: '200',
      message: 'Preference updated!',
      data: null
    })
  })
}

exports.deleteLike = (req, res, next) => {
  let sql = 'DELETE FROM Likes WHERE PostID = "'+req.params.postId+'" AND UserID = "'+req.params.userId+'";'
  db.query(sql, function (err, result, fields) {
    if (err) return res.json({
      status: '400',
      message: null,
      data: err
    })
    res.json({
      status: '200',
      message: 'Preference updated!',
      data: null
    })
  })
}

exports.deleteDislike = (req, res, next) => {
  let sql = 'DELETE FROM Dislikes WHERE PostID = "'+req.params.postId+'" AND UserID = "'+req.params.userId+'";'
  db.query(sql, function (err, result, fields) {
    if (err) return res.json({
      status: '400',
      message: null,
      data: err
    })
    res.json({
      status: '200',
      message: 'Preference updated!',
      data: null
    })
  })
}