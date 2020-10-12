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
  let sql = 'INSERT INTO Comments (UserID, Comment, PostID, ParentID) VALUES ("'+req.body.userId+'", "'+req.body.comment+'", "'+req.params.postId+'", '+req.body.parentId+')'
  db.query(sql, function (err, result, fields) {
    if (err) return res.json({
      status: err.status,
      message: err.sqlMessage,
      data: err
    })
    res.json({
      status: '201',
      message: 'Comment saved successfully!',
      data: null
    })
  })
}

exports.editPost = (req, res, next) => {
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
  let sql = 'SELECT Comments.CommentID, Comments.Comment, Comments.UserID, Comments.PostID, Comments.ParentID, Users.Username FROM Comments INNER JOIN Users On Comments.UserID = Users.UserID WHERE PostID = "'+req.params.postId+'"'
  db.query(sql, function (err, comments, fields) {
    if (err) return res.json({
      status: err.status,
      message: err.sqlMessage,
      error: err
    })
    
    if (comments.length !== 0) {

      function hierarchySortFunc(a,b ) {
        return a.name > b.name;
      }
    
      function hierarhySort(hashArr, key, result) {
        if (hashArr[key] == undefined) return;
        let arr = hashArr[key].sort(hierarchySortFunc);
        for (let i = 0; i < arr.length; i++) {
          result.push(arr[i]);
          hierarhySort(hashArr, arr[i].CommentID, result);
        }
        return result;
      }
    
      var arr = comments
    
      var hashArr = {};
    
      for (let i = 0; i < arr.length; i++) {
        if (hashArr[arr[i].ParentID] == undefined) hashArr[arr[i].ParentID] = [];
        hashArr[arr[i].ParentID].push(arr[i]);
      }
    
      let result = hierarhySort(hashArr, 0, []);
    
      const nest = (items, CommentID = 0, link = 'ParentID') =>
      items
        .filter(item => item[link] === CommentID)
        .map(item => ({ ...item, children: nest(items, item.CommentID) }));
    
      res.json({
        status: '200',
        message: null,
        data: nest(result)
      })
    } else {
      res.json({
        status: '200',
        message: 'No comments',
        data: null
      })
    }
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
  let sql = 'INSERT INTO CommentLikes (PostID, UserID) VALUES ("'+req.body.commentId+'", "'+req.body.userId+'")'
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
  let sql = 'INSERT INTO PostDislikes (PostID, UserID) VALUES ("'+req.body.commentId+'", "'+req.body.userId+'")'
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

exports.deleteDislikeComment = (req, res, next) => {
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