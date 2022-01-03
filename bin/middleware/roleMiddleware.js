const jwt = require("jsonwebtoken");
const {secret} = require("./../../config");
module.exports = function (role1, role2 = undefined) {
    return function (req, res, next) {
        //if (req.method === 'OPTIONS') {
        // next()
        // }
        //   console.log('sveta')
        try {
            // const token = req.headers.authorization.split(' ')[1]
            const token = req.signedCookies['id']

            if (!token || token == undefined) {
                return res.status(403).json({message: 'Пользователь не авторизован'})
            }
            const decodedData = jwt.verify(token, secret)
            //   console.log(decodedData)
            let userRole = decodedData.role
            //     console.log(userRole)
            let hasRole = false

            if (userRole === role1 || userRole === role2) {
                hasRole = true
            }

            if (!hasRole) {
                return res.status(403).json({message: 'У вас нет доступа'})
            }
            return next()
        } catch (e) {
            return res.status(403).json({message: 'Пользователь не авторизован'})
        }
    }
}