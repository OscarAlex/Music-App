const express= require('express');
const router= express.Router();
const { addTrack,
        removeTrack,
        addAllSongs,
        clearPlaylist,
        addWithLabels
        }= require('../controllers/player-controllers');

function isAuthenticated(req, res, next) {
    if(req.isAuthenticated()){
            return next();
    }
    //If not, redirect to main page
    res.redirect('/');
};

//Add track to playlist
router.post('/add_track/:id', isAuthenticated, addTrack);

//Remove track from playlist
router.post('/remove_track/:id', isAuthenticated, removeTrack);

//Play list :D
router.get('/add_all', isAuthenticated, addAllSongs);

//Clear playlist
router.get('/clear_playlist', isAuthenticated, clearPlaylist);

//Add track with label
router.post('/add_with_labels', isAuthenticated, addWithLabels);

module.exports= router;