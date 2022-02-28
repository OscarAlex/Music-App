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
    newPlay.duration= track.duration;
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
    const tracks = await Track.find();
    //Pass all tracks to playlist
    await Playlist.insertMany(tracks);

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

    //Add tracks ids from each label
    var tracks_ids= [];
    for (const id of labels) {
        const label= await Label.findById(id);
        tracks_ids.push(label.tracks_ids);
    }
    //Get size
    const selected_labels= tracks_ids.length;
    //Flat list and convert to String
    tracks_ids= tracks_ids.flat().map(String);
    
    
    //Get songs according to option
    var selected_tracks= [];
    //Preserve the uniques
    if(option == 'any'){
        //Get unique tracks 
        selected_tracks = await Track.find({ '_id': { $in: tracks_ids } });
    }
    //Preserve the duplicates
    else{
        //Create dictionary with counter and id
        var uniq = tracks_ids
            .map((id) => {
            return {
            count: 1,
            id: id
            }
        })
        //??????
        .reduce((a, b) => {
            a[b.id] = (a[b.id] || 0) + b.count
            return a
        }, {})
        //Get tracks repeated [selected labels] times
        const duplicates = Object.keys(uniq).filter((a) => uniq[a] == selected_labels);
        //Get duplicate tracks 
        selected_tracks = await Track.find({ '_id': { $in: duplicates } });
    }
    
    //Get files ids
    var files_ids= [];
    selected_tracks.forEach(function(track){
        files_ids.push(track.file_id.toString())
    });

    //Get files_ids from playlist
    const playlist = await Playlist.find();
    var playlist_ids= [];
    playlist.forEach(function(track){
        playlist_ids.push(track.file_id.toString())
    });

    //If not track in playlist, add
    files_ids.forEach(async id => {
        if(!playlist_ids.includes(id)){
            //Get all tracks
            const track_to_add = await Track.find({ 'file_id': id });
            //Pass all tracks to playlist
            await Playlist.insertMany(track_to_add);
        }
    });
    
    res.redirect('/music');
}

module.exports= {
    addTrack,
    removeTrack,
    addAllSongs,
    clearPlaylist,
    addWithLabels
}