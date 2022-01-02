const express = require('express');
var  router = express.Router();
const profileController=require('../controllers/profileController')
const role=require('../bin/middleware/roleMiddleware')

router.get('/',(req, res, next) => {
    if(req.session.role=='ADMIN'){
        profileController.adminProfile(req,res,next)
    }
    if(req.session.role=='USER'){
        profileController.clientProfile(req,res,next)
    }
})
router.get('/edit',role('USER'),profileController.profileEditGet)
router.post('/edit',role('USER'),profileController.profileEditPost)
router.post('/delete',role('USER'),profileController.profileDeletePost)

module.exports=router