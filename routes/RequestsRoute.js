const express = require('express');
const { sendRequest, acceptRequest, rejectRequest } = require('../services/requestsService');
const { protect, allowedTo } = require('../services/authService');




const router = express.Router();
router.use(protect);

router.post('/sendRequest', allowedTo('patient') ,sendRequest);
router.post('/accept/:patientId', allowedTo('doctor') ,acceptRequest);
router.post('/reject/:patientId', allowedTo('doctor') ,rejectRequest);



module.exports = router;
