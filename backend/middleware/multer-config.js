const aws = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3')

aws.config.update({
  secretAccessKey: 'KYZboy5V/a87vTDXC60LTntfnBAOojMJey/EMFyK',
  accessKeyId: 'AKIAZJI6OO465SWD4YDS',
  region: 'eu-west-2'
})

const s3 = new aws.S3()

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'sopekocko',
    key: function (req, file, cb) {
      cb(null, new Date().toISOString() + '-' + file.originalname)
    }
  })
})

module.exports = multer(upload).single('file')