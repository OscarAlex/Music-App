const { resolveSoa } = require('dns');
const express= require('express');
//const req = require('express/lib/request');
//const res = require('express/lib/response');
const router= express.Router();
const { getNewLabel, 
        postNewLabel, 
        getEditLabel, 
        postEditLabel,
        deleteLabel } = require('../controllers/labels-controller');
const { getUploadTrack,
        postUploadTrack,
        getEditTrack,
        postEditTrack,
        deleteTrack,
        getTrack } = require('../controllers/tracks-controller');

//Schema for the labels
//const Label= require('../models/label');

//Add label
router.get('/add_label', getNewLabel);
router.post('/new_label', postNewLabel);

//Edit label
router.get('/edit_label/:id', getEditLabel);
router.post('/edit_label/:id', postEditLabel);

//Delete label
router.post('/delete_label/:id', deleteLabel);


//Upload track
router.get('/upload_track', getUploadTrack);
router.post('/upload_track', postUploadTrack);

//Edit track info
router.get('/edit_track/:id', getEditTrack);
router.post('/edit_track/:id', postEditTrack);

//Delete track
router.post('/delete_track/:id', deleteTrack);

//Get track
router.get('/tracks/:id', getTrack);

module.exports = router;