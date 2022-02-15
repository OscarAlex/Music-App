const express= require('express');
const router= express.Router();
const { addTrack,
        removeTrack,
        playMusic
        }= require('../controllers/player-controllers');

//Add track to playlist
router.post('/add_track/:id', addTrack);

//Remove track from playlist
router.post('/remove_track/:id', removeTrack);

//Play list
router.get('/play_music', playMusic);

module.exports= router;