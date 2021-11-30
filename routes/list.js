const express = require('express');
const  router = express.Router();
const emploeesController=require('../controllers/emploeesController')


router.get('/Admin/edit',)
router.get('/Admin/delete',)
router.get('/employees',emploeesController.Employees)
router.get('/admins',emploeesController.Admin)
router.get('/coaches',)



module.exports=router