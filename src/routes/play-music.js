const express= require('express');
const router= express.Router();
const { addTrack,
        removeTrack,
        addAllSongs,
        clearPlaylist,
        addWithLabels
        }= require('../controllers/player-controllers');

//Add track to playlist
router.post('/add_track/:id', addTrack);

//Remove track from playlist
router.post('/remove_track/:id', removeTrack);

//Play list
router.get('/add_all', addAllSongs);

//Clear playlist
router.get('/clear_playlist', clearPlaylist);

//Add track with label
router.post('/add_with_labels', addWithLabels);

module.exports= router;