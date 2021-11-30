const express = require('express');
const  router = express.Router();
const emploeesController=require('../controllers/emploeesController')
const roleMiddleware = require("../bin/middleware/roleMiddleware");

router.get('/Admin/create',roleMiddleware('ADMIN'),emploeesController.GetAdminCreate)
router.post('/Admin/create',roleMiddleware('ADMIN'),emploeesController.PostAdminCreate)
router.post('/Admin/edit',emploeesController.PostAdminEdit)
router.post('/Admin/delete/:id',emploeesController.PostAdminDelete)
router.get('/employees',emploeesController.Employees)
router.get('/admins',emploeesController.Admin)
router.get('/coaches',)



module.exports=router