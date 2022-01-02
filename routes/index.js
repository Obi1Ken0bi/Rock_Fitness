const express = require('express');
const router = express.Router();
const controller = require('./../controllers/authController')
const {check} = require('express-validator')
const roleMiddleware = require('../bin/middleware/roleMiddleware')

router.get('/', function (req, res, next) {
   // console.log('???')
    res.render('home',{auth: req.authrized});
});
router.get('/registration', function (req, res) {
    res.render('registration')
})
router.post('/registration', [check('username', 'Имя пользователя не может быть пустым').notEmpty(),
    (check('password', 'Пароль от 4 до 10 символов').isLength({max: 10, min: 4}))
], controller.registration)
router.post('/api/login', controller.login)
router.get('/users', roleMiddleware('ADMIN'), controller.getUsers)
router.get('/logout',(req, res) => {
    res.clearCookie('id')
    req.session.destroy()
    return  res.redirect('/')
})
module.exports = router
