const Track= require('../models/track');
const Playlist= require('../models/playlist-track');

//Get New label
const addTrack = async (req, res, next) => {
    //Get track
    const track= await Track.findById(req.params.id);

    //Save track in playlist
    const newPlay= new Playlist();
    newPlay.name= track.name;
    newPlay.file_id= track.file_id;
    newPlay.labels_ids= track.labels_ids;
    await newPlay.save();

    res.redirect('/music');
}

//Remove track from playlist
const removeTrack= async (req, res, next) => {
    //Find by id and delete
    await Playlist.findByIdAndDelete(req.params.id);
    res.redirect('/music');
}

const playMusic= (req, res, next) => {
    
    res.redirect('/');
}

module.exports= {
    addTrack,
    removeTrack,
    playMusic
}