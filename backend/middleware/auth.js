const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]
    const decodedToken = jwt.verify(
      token,
      'FKDAFJKA775JKJFDKAnfamnkjfka-fadfajkjfkadf89kfdka/fafak*kfdajkfjakjkfadfaduirueqir847jfancmnahjkfanvh12hj3hjfafkjfa'
    )
    const userId = decodedToken.userId
    if (req.body.userId && req.body.userId !== userId || req.params.userId && req.params.userId !== userId ) {
      return res.json({
        status: '401',
        message: 'Invalid User Id, please login again to confirm your identity',
        data: null
      })
    } else {
      next()
    }
  } catch {
    res.json({
      status: '401',
      message: 'Your session is expired, please login again',
      data: null
    })
  }
}