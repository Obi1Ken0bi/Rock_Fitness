const jwt = require('jsonwebtoken')
const {secret} = require('./../../config')
module.exports = function (req, res, next) {
    try {
        if(req.signedCookies.length==0){next()}
        const token= req.signedCookies['id']
        console.log(token)
        //const token = req.headers.authorization.split(' ')[1]
        if (!token || token==undefined) {
             req.authrized=false
            console.log('>')
            return  next()
        }
        const decodedData = jwt.verify(token, secret)
        req.authrized=true
        req.user = decodedData
       return  next()
    } catch (e) {
         req.authrized=false
        return  next(e)
    }
}