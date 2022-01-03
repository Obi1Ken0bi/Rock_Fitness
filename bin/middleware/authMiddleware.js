const jwt = require('jsonwebtoken')
const {secret} = require('./../../config')
module.exports = function (req, res, next) {
    try {
        if(!res.locals.partials) res.locals.partials = {}
        if(req.signedCookies.length==0){next()}
        const token= req.signedCookies['id']
        console.log('token: ',token)
        //const token = req.headers.authorization.split(' ')[1]
        if (!token || token==undefined) {
            res.locals.partials.loginboxContext=false
            req.session.loggedIn=false
           // console.log('>')
            return  next()
        }
        const decodedData = jwt.verify(token, secret)
        res.locals.partials.loginboxContext=true
        console.log(decodedData)

        req.user = decodedData
        req.session.role=decodedData.role
        req.session.login=decodedData.login
        if(req.session.role=="ADMIN") {
            res.locals.partials.admin = true
            // res.locals.partials.user=true}
        }
        if(req.session.role=="USER") res.locals.partials.user=true
        req.session.loggedIn=true
        res.locals.partials.role=req.session.role
    //    console.log(req.session.role)
       return  next()
    } catch (e) {
        res.locals.partials.loginboxContext=false
        return  next(e)
    }
}