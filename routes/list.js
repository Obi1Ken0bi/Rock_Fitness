const express = require('express');
const router = express.Router();
const emploeesController = require('../controllers/emploeesController')
const roleMiddleware = require("../bin/middleware/roleMiddleware");
//АДМИНЫ:
router.get('/Admin/create', roleMiddleware('ADMIN'), emploeesController.GetAdminCreate)
router.post('/Admin/create', roleMiddleware('ADMIN'), emploeesController.PostAdminCreate)
router.post('/Admin/edit', roleMiddleware('ADMIN'), emploeesController.PostAdminEdit)
router.get('/Admin/edit/:id', roleMiddleware('ADMIN'), emploeesController.GetAdminEdit)
router.post('/Admin/delete/:id', roleMiddleware('ADMIN'), emploeesController.PostAdminDelete)
router.get('/employees', emploeesController.Employees)
//ТРЕНЕРЫ:
router.get('/Coach/create', roleMiddleware('ADMIN'), emploeesController.GetCoachCreate)
router.post('/Coach/create', roleMiddleware('ADMIN'), emploeesController.PostCoachCreate)
router.post('/Coach/edit', roleMiddleware('ADMIN'), emploeesController.PostCoachEdit)
router.get('/Coach/edit/:id', roleMiddleware('ADMIN'), emploeesController.GetCoachEdit)
router.post('/Coach/delete/:id', roleMiddleware('ADMIN'), emploeesController.PostCoachDelete)


module.exports = router