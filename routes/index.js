const express = require('express');
const router = express.Router();
const controller = require('./../controllers/authController')
const {check} = require('express-validator')
const roleMiddleware = require('../bin/middleware/roleMiddleware')

router.get('/', function (req, res, next) {
    const sql = req.sql
    const rofl = new sql.Request()
    rofl.query('select count(ID) as cont from Client').then((aRolf) => {
            //   console.log(aRolf)
            const pepega = aRolf.recordset[0].cont
            res.render('home', {count: pepega});
        }
    )

});
router.get('/registration', function (req, res) {
    res.render('registration')
})
router.post('/registration', [check('username1', 'Имя пользователя не может быть пустым').notEmpty(),
    (check('password1', 'Пароль от 4 до 10 символов').isLength({max: 10, min: 4}))
], controller.registration)
router.post('/api/login', controller.login)
router.get('/users', roleMiddleware('ADMIN'), controller.getUsers)
router.get('/logout', (req, res) => {
    res.clearCookie('id')
    req.session.destroy()
    return res.redirect('/')
})
module.exports = router
