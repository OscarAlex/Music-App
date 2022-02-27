const Track= require('../models/track');
const Label= require('../models/label');
const Playlist= require('../models/playlist-track');
const {ObjectId}= require('mongodb');

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

//Add all songs to playlist
const addAllSongs= async (req, res, next) => {
    //Clear playlist
    await Playlist.deleteMany();
    //Get all tracks
    const Object = await Track.find();
    //Pass all tracks to playlist
    await Playlist.insertMany(Object);

    res.redirect('/music');
}

//Clear playlist
const clearPlaylist= async (req, res, next) => {
    await Playlist.deleteMany();
    res.redirect('/music');
}

//Add tracks to playlist with labels
const addWithLabels= async (req, res, next) => {
    //Get option
    const option= req.body.options;
    //Delete option
    delete req.body.options

    //Get labels
    var labels= Object.keys(req.body);
    //labels= labels.map(ObjectId);
    //console.log(labels);
    
    //Get tracks_ids from labels
    var tracks= await getTracksIds(labels)
    console.log(tracks);
    
    //Preserve the uniques
    if(option == 'any'){

    }
    //Preserve the repeateds
    else{

    }
    
    res.redirect('/music');
}

function getTracksIds(labels_arr){
    //Tracks list
    var tracks= []

    labels_arr.forEach(async id => {
        const label= await Label.findById(id);
        console.log(label);
        tracks.push(label.tracks_ids);
    });
    return tracks
}

module.exports= {
    addTrack,
    removeTrack,
    addAllSongs,
    clearPlaylist,
    addWithLabels
}