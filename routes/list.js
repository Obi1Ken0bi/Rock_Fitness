const express = require('express');
const  router = express.Router();
const emploeesController=require('../controllers/emploeesController')

router.get('/Admin/create',)
router.post('/Admin/create',emploeesController.PostAdminCreate)
router.post('/Admin/edit',emploeesController.PostAdminEdit)
router.post('/Admin/delete',emploeesController.PostAdminDelete)
router.get('/employees',emploeesController.Employees)
router.get('/admins',emploeesController.Admin)
router.get('/coaches',)



module.exports=router