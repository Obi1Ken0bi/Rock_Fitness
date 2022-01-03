const express = require('express');
const router = express.Router();
const contractController = require('../controllers/contractController')
const checkRole = require('../bin/middleware/roleMiddleware')

/* GET users listing. */
router.get('/', checkRole('USER'), async function (req, res, next) {
    const sql = req.sql
    const login = req.session.login
    let request = new sql.Request();
    request.input('login', sql.NVarChar(20), login)
    const queryResult = await request.query('select id from User_Client where login=@login')
    const id = queryResult.recordset[0].id;
    request.input('ID', sql.Int, id)
    const queryResult1 = await request.query('select COUNT(ID) as c from Contract where ID_Client=@ID')
    const numberOfContracts = queryResult1.recordset[0].c
    if (numberOfContracts > 0) {
        contractController.checkConractGet(req, res, next)
    } else {
        contractController.BuyContractGet(req, res, next)
    }
})
router.post('/', checkRole('USER'), contractController.BuyContractPost)
router.post('/add', checkRole('USER'), contractController.updateEntersPost)

module.exports = router;
