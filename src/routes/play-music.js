const express= require('express');
const router= express.Router();
const {getNewLabel}= require('../controllers/player-controllers');

router.get('/add_label', getNewLabel);

module.exports= router;