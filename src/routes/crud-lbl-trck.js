const express= require('express');
const router= express.Router();
const { getNewLabel, 
        postNewLabel, 
        getEditLabel, 
        postEditLabel,
        deleteLabel,
        deleteAllLabels } = require('../controllers/labels-controller');
const { getUploadTrack,
        postUploadTrack,
        getEditTrack,
        postEditTrack,
        deleteTrack,
        deleteAllTracks,
        getTrack } = require('../controllers/tracks-controller');

function isAuthenticated(req, res, next) {
        if(req.isAuthenticated()){
                return next();
        }
        //If not, redirect to main page
        res.redirect('/');
};

//Add label
router.get('/add_label', isAuthenticated, getNewLabel);
router.post('/new_label', postNewLabel);

//Edit label
router.get('/edit_label/:id', isAuthenticated, getEditLabel);
router.post('/edit_label/:id', isAuthenticated, postEditLabel);

//Delete label
router.post('/delete_label/:id', isAuthenticated, deleteLabel);
//Delete all labels
router.post('/delete_all_labels', isAuthenticated, deleteAllLabels);

//Upload track
router.get('/upload_track', isAuthenticated, getUploadTrack);
router.post('/upload_track', isAuthenticated, postUploadTrack);

//Edit track info
router.get('/edit_track/:id', isAuthenticated, getEditTrack);
router.post('/edit_track/:id', isAuthenticated, postEditTrack);

//Delete track
router.post('/delete_track/:id', isAuthenticated, deleteTrack);
//Delete all tracks
router.post('/delete_all_tracks', isAuthenticated, deleteAllTracks);

//Get track
router.get('/tracks/:id', getTrack);

module.exports= router;