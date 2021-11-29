const express = require('express');
const router = express.Router();
const controller = require('./../controllers/authController')
const {check} = require('express-validator')
const authMiddleware = require('../bin/middleware/authMiddleware')
const roleMiddleware = require('../bin/middleware/roleMiddleware')

router.get('/', function (req, res, next) {
    res.render('home');
});
router.get('/registration', function (req, res) {
    res.render('registration')
})
router.post('/registration', [check('username', 'Имя пользователя не может быть пустым').notEmpty(),
    (check('password', 'Пароль от 4 до 10 символов').isLength({max: 10, min: 4}))
], controller.registration)
router.post('/login', controller.login)
router.get('/users', roleMiddleware('ADMIN'), controller.getUsers)
module.exports = router
