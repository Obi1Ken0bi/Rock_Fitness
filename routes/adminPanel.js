const express = require('express');
const router = express.Router();
const panelController = require('../controllers/panelController')

router.get('/', panelController.panelHome)
//Посещения
router.get('/visits', panelController.visitsGet)
router.get('/visits/edit/:id', panelController.visitsEdit)
router.post('/visits/edit', panelController.visitsEditPost)
router.post('/visits/delete/:id', panelController.deleteVisit)
router.get('/visits/create', panelController.createVisit)
router.post('/visits/create', panelController.createVisitPost)
//Запрос
router.get('/query', panelController.createQueryGet)
router.post('/query', panelController.createQueryPost)
//Абонементы
router.get('/contracts', panelController.contractsList)
router.get('/contracts/edit/:id', panelController.contractEdit)
router.post('/contracts/ed', panelController.contractEditPost)
router.get('/contracts/create', panelController.createContract)
router.post('/contracts/create', panelController.createContractPost)
router.post('/contracts/delete/:id', panelController.deleteContract)
//Клиенты
router.get('/clients', panelController.clientsGet)
router.get('/clients/edit/:id', panelController.clientsEdit)
router.post('/clients/edit', panelController.clientsEditPost)
router.post('/clients/delete/:id', panelController.deleteClient)
router.get('/clients/create', panelController.createClient)
router.post('/clients/create', panelController.createClientPost)

module.exports = router;