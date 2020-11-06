const AWS = require('aws-sdk')
let db = require('../dbConfig');

exports.uploadPost = (req, res, next) => {
  const fileName = 'https://sopekocko.s3.eu-west-2.amazonaws.com/' + req.file.key;
  let sql = 'INSERT INTO Posts (UserID, Title, ImageURL) VALUES ("'+req.body.userId+'", "'+req.body.title+'", "'+fileName+'")'
  db.query(sql, function (err, result, fields) {
    if (err) return res.json({
      status: err.status,
      message: err.sqlMessage,
      data: err
    })
    res.json({
      status: '201',
      message: 'Post saved successfully!',
      data: null
    })
  })
}

exports.commentPost = (req, res, next) => {
  db.query('SET foreign_key_checks = 0; INSERT INTO Comments (UserID, Comment, PostID, ParentID) VALUES ("'+req.body.userId+'", "'+req.body.comment+'", "'+req.params.postId+'", "'+req.body.parentId+'"); SELECT Comments.CommentID, Comments.Comment, Comments.UserID, Comments.PostID, Comments.ParentID, Users.Username FROM Comments INNER JOIN Users On Comments.UserID = Users.UserID WHERE CommentID = LAST_INSERT_ID(); SET foreign_key_checks = 1;', function (err, result, fields) {
    if (err) return res.json({
      status: err.status,
      message: err.sqlMessage,
      data: err
    })
    res.json({
      status: '201',
      message: 'Comment saved successfully!',
      data: result
    })
  })
}

exports.getLastComment = (req, res, next) => {
  db.query('SELECT Comments.CommentID, Comments.Comment, Comments.UserID, Comments.PostID, Comments.ParentID, Users.Username FROM Comments INNER JOIN Users On Comments.UserID = Users.UserID WHERE CommentID = LAST_INSERT_ID();', function (err, result, fields) {
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

exports.editPost = (req, res, next) => {
  if (req.file) {
    let sqlSelect = 'SELECT * FROM Posts WHERE PostID = "'+req.params.postId+'";'
      db.query(sqlSelect, function (err, result, fields) {
        if (err) return res.json({
          status: err.status,
          message: err.sqlMessage,
          data: err
        })
        const s3 = new AWS.S3()
        const params = {
          Bucket: 'sopekocko',
          Key: result[0].ImageURL.replace(
            'https://sopekocko.s3.eu-west-2.amazonaws.com/',
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
      })
      const fileName = 'https://sopekocko.s3.eu-west-2.amazonaws.com/' + req.file.key;
      let sqlUpdate = 'UPDATE Posts SET Title = "'+req.body.title+'", ImageURL = "'+fileName+'" WHERE PostID = "'+req.params.postId+'";'
      db.query(sqlUpdate, function (err, result, fields) {
        if (err) return res.json({
          status: err.status,
          message: err.sqlMessage,
          data: err
        })
        res.json({
          status: '200',
          message: 'Post Edited!',
          data: null
        })
      })
  } else {
    let sqlUpdate = 'UPDATE Posts SET Title = "'+req.body.title+'" WHERE PostID = "'+req.params.postId+'";'
    db.query(sqlUpdate, function (err, result, fields) {
      if (err) return res.json({
        status: err.status,
        message: err.sqlMessage,
        data: err
      })
      res.json({
        status: '200',
        message: 'Post Edited!',
        data: null
      })
    })
  }
}

exports.deletePost = (req, res, next) => {
  let sqlSelect = 'SELECT * FROM Posts WHERE PostID = "'+req.params.postId+'";'
    db.query(sqlSelect, function (err, result, fields) {
      if (err) return res.json({
        status: err.status,
        message: err.sqlMessage,
        data: err
      })
      const s3 = new AWS.S3()
      const params = {
        Bucket: 'sopekocko',
        Key: result[0].ImageURL.replace(
          'https://sopekocko.s3.eu-west-2.amazonaws.com/',
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
    })
    let sqlDelete = 'DELETE FROM Posts WHERE PostID = "'+req.params.postId+'";'
    db.query(sqlDelete, function (err, result, fields) {
      if (err) return res.json({
        status: err.status,
        message: err.sqlMessage,
        data: err
      })
      res.json({
        status: '200',
        message: 'Post Deleted!',
        data: null
      })
    })
}

exports.getAllPosts = (req, res, next) => {
  let sql = 'SELECT Posts.PostID, Posts.UserID, Posts.Title, Posts.ImageURL, Posts.DateTime, Users.Username FROM Posts INNER JOIN Users ON Posts.UserID=Users.UserID;'
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

exports.getSinglePost = (req, res, next) => {
  let sql = 'SELECT * FROM Posts WHERE PostID = "'+req.params.postId+'";'
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

exports.getAllLikesPosts = (req, res, next) => {
  let sql = 'SELECT * FROM PostLikes'
  db.query(sql, function (err, result, fields) {
    if (err) return res.json({
      status: err.status,
      message: err.sqlMessage,
      error: err
    })
    res.json({
      status: '200',
      message: null,
      data: result
    })
  })
}

exports.getAllDislikesPosts = (req, res, next) => {
  let sql = 'SELECT * FROM PostDislikes'
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

exports.likePost = (req, res, next) => {
  let sql = 'INSERT INTO PostLikes (PostID, UserID) VALUES ("'+req.body.postId+'", "'+req.body.userId+'")'
  db.query(sql, function (err, result, fields) {
    if (err) return res.json({
      status: '400',
      message: null,
      data: err
    })
    res.json({
      status: '200',
      message: 'Preference Updated!',
      data: null
    })
  })
}

exports.dislikePost = (req, res, next) => {
  let sql = 'INSERT INTO PostDislikes (PostID, UserID) VALUES ("'+req.body.postId+'", "'+req.body.userId+'")'
  db.query(sql, function (err, result, fields) {
    if (err) return res.json({
      status: err.status,
      message: err.sqlMessage,
      data: err
    })
    res.json({
      status: '200',
      message: 'Preference updated!',
      data: null
    })
  })
}

exports.deleteLikePost = (req, res, next) => {
  let sql = 'DELETE FROM PostLikes WHERE PostID = "'+req.params.postId+'" AND UserID = "'+req.params.userId+'";'
  db.query(sql, function (err, result, fields) {
    if (err) return res.json({
      status: err.status,
      message: err.sqlMessage,
      data: err
    })
    res.json({
      status: '200',
      message: 'Preference updated!',
      data: null
    })
  })
}

exports.deleteDislikePost = (req, res, next) => {
  let sql = 'DELETE FROM PostDislikes WHERE PostID = "'+req.params.postId+'" AND UserID = "'+req.params.userId+'";'
  db.query(sql, function (err, result, fields) {
    if (err) return res.json({
      status: err.status,
      message: err.sqlMessage,
      data: err
    })
    res.json({
      status: '200',
      message: 'Preference updated!',
      data: null
    })
  })
}

exports.getCommentsPost = (req, res, next) => {
  let sql = 'SELECT CommentID, Comment, PostID, ParentID, c.UserID, Users.Username, EXISTS(SELECT 1 FROM Comments r WHERE r.ParentID = c.CommentID) hasReply from Comments c INNER JOIN Users ON c.UserID = Users.UserID WHERE ParentID = 0 AND PostID = "'+req.params.postId+'";'
  db.query(sql, function (err, comments, fields) {
    if (err) return res.json({
      status: err.status,
      message: err.sqlMessage,
      error: err
    })
    res.json({
      status: '200',
      message: null,
      data: comments
    })
  })
}

exports.getReply = (req, res, next) => {
  let sql = 'SELECT CommentID, Comment, PostID, ParentID, c.UserID, Users.Username, EXISTS(SELECT 1 FROM Comments r WHERE r.ParentID = c.CommentID) hasReply from Comments c INNER JOIN Users ON c.UserID = Users.UserID WHERE PostID = "'+req.params.postId+'" AND ParentID = "'+req.params.replyParentId+'";'
  db.query(sql, function (err, comments, fields) {
    if (err) return res.json({
      status: err.status,
      message: err.sqlMessage,
      error: err
    })
    res.json({
      status: '200',
      message: null,
      data: comments
    })
  })
}

exports.getAllLikesComments = (req, res, next) => {
  let sql = 'SELECT * FROM CommentLikes'
  db.query(sql, function (err, result, fields) {
    if (err) return res.json({
      status: err.status,
      message: err.sqlMessage,
      error: err
    })
    res.json({
      status: '200',
      message: null,
      data: result
    })
  })
}

exports.getAllDislikesComments = (req, res, next) => {
  let sql = 'SELECT * FROM CommentDislikes'
  db.query(sql, function (err, result, fields) {
    if (err) return res.json({
      status: err.status,
      message: err.sqlMessage,
      error: err
    })
    res.json({
      status: '200',
      message: null,
      data: result
    })
  })
}

exports.likeComment = (req, res, next) => {
  let sql = 'INSERT INTO CommentLikes (CommentID, UserID) VALUES ("'+req.body.commentId+'", "'+req.body.userId+'")'
  db.query(sql, function (err, result, fields) {
    if (err) return res.json({
      status: '400',
      message: null,
      data: err
    })
    res.json({
      status: '200',
      message: 'Preference Updated!',
      data: null
    })
  })
}

exports.dislikeComment = (req, res, next) => {
  let sql = 'INSERT INTO CommentDislikes (CommentID, UserID) VALUES ("'+req.body.commentId+'", "'+req.body.userId+'")'
  db.query(sql, function (err, result, fields) {
    if (err) return res.json({
      status: err.status,
      message: err.sqlMessage,
      data: err
    })
    res.json({
      status: '200',
      message: 'Preference updated!',
      data: null
    })
  })
}

exports.deleteLikeComment = (req, res, next) => {
  let sql = 'DELETE FROM CommentLikes WHERE CommentID = "'+req.params.commentId+'" AND UserID = "'+req.params.userId+'";'
  db.query(sql, function (err, result, fields) {
    if (err) return res.json({
      status: err.status,
      message: err.sqlMessage,
      data: err
    })
    res.json({
      status: '200',
      message: 'Preference updated!',
      data: null
    })
  })
}

exports.deleteDislikeComment = (req, res, next) => {
  let sql = 'DELETE FROM CommentDislikes WHERE CommentID = "'+req.params.commentId+'" AND UserID = "'+req.params.userId+'";'
  db.query(sql, function (err, result, fields) {
    if (err) return res.json({
      status: err.status,
      message: err.sqlMessage,
      data: err
    })
    res.json({
      status: '200',
      message: 'Preference updated!',
      data: null
    })
  })
}

exports.deleteComment = (req, res, next) => {
  let sql = 'DELETE FROM Comments WHERE CommentID = "'+req.params.commentId+'";'
  db.query(sql, function (err, result, fields) {
    if (err) return res.json({
      status: err.status,
      message: err.sqlMessage,
      data: err
    })
    res.json({
      status: '200',
      message: 'Comment Deleted!',
      data: null
    })
  })
}

exports.editComment = (req, res, next) => {
  let sql = 'UPDATE Comments SET Comment = "'+req.body.comment+'" WHERE CommentID = "'+req.body.commentId+'";'
    db.query(sql, function (err, result, fields) {
      if (err) return res.json({
        status: err.status,
        message: err.sqlMessage,
        data: err
      })
      res.json({
        status: '200',
        message: 'Comment Edited!',
        data: null
      })
    })
}