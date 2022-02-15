const {getConnection}= require('../database');
const {ObjectId}= require('mongodb');
const Label= require('../models/label');
const Track= require('../models/track');

//Get New label
const getNewLabel = async (req, res, next) => {
    //Get tracks
    const tracks= await Track.find();
    res.render('add_label', {tracks});
}

//Add New label
const postNewLabel = async (req, res, next) => {
    //Get label
    var label = req.body.label;
    //Delete label
    delete req.body.label

    //Verify if label already exists
    const verify_label= await Label.findOne({label: label});
    //If no label
    if(!label){
        //Create and save flash message
        req.flash('labelMessage', 'Write a label');
        res.locals.labelMessage= req.flash('labelMessage');
        
        const tracks= await Track.find();
        res.render('add_label', {tracks});
    }
    else if(verify_label){
        //Create and save flash message
        req.flash('labelMessage', 'This label already exists');
        res.locals.labelMessage= req.flash('labelMessage');

        const tracks= await Track.find();
        res.render('add_label', {tracks});
    }
    //If no errors
    else{
        //Get tracks
        var tracks_ids= Object.keys(req.body);
        tracks_ids= tracks_ids.map(ObjectId);

        //Create new Label object and save it
        const newLabel= new Label();
        newLabel.label= label;
        newLabel.tracks_ids= tracks_ids;
        await newLabel.save();

        //Add label to tracks
        if(tracks_ids){
            const db = getConnection();
            //$in to read array of ids
            //$addToSet to add value to labels_ids
            //$each to add many values
            db.collection('tracks').updateMany(
                { _id:{ $in: tracks_ids }}, 
                { $addToSet:{ labels_ids: ObjectId(newLabel.id) }}
            );
        }

        res.redirect('/profile');
    }
}

//Edit label
const getEditLabel= async (req, res, next) => {
    //Get label and tracks
    const label= await Label.findById(req.params.id);
    const tracks= await Track.find();
    res.render('edit_label', {label, tracks});
}

const postEditLabel= async (req, res, next) => {
    //Get label
    var new_label = req.body.label;
    //Delete label and method
    delete req.body.label
    delete req.body._method
    
    //Get other labels
    const labels= await Label.find({ _id:{ $nin: req.params.id}});
    //If no label
    if(!new_label){
        //Create and save flash message
        req.flash('labelMessage', 'Write a label');
        res.locals.labelMessage= req.flash('labelMessage');

        const label= await Label.findById(req.params.id);
        const tracks= await Track.find();
        res.render('edit_label', {label, tracks});
    }
    //If label already exists
    else if(labels.some(e => e.label == new_label)){
        //Create and save flash message
        req.flash('labelMessage', 'This label already exists');
        res.locals.labelMessage= req.flash('labelMessage');

        const label= await Label.findById(req.params.id);
        const tracks= await Track.find();
        res.render('edit_label', {label, tracks});
    }
    //If no errors
    else{
        //Get label
        const label= await Label.findById(req.params.id);
        //Get tracks before and after edit
        var before_tracks_ids= label.tracks_ids.map(String);
        var after_tracks_ids= Object.keys(req.body);
        const db = getConnection();

        //Delete label id from associated tracks
        before_tracks_ids.forEach(track_id => {
            if(!after_tracks_ids.includes(track_id)){
                db.collection('tracks').updateOne(
                    { _id: ObjectId(track_id) }, 
                    { $pull:{ labels_ids: ObjectId(label.id) }}
                );
            }
        });

        //Add label id to new tracks
        after_tracks_ids.forEach(track_id => {
            if(!before_tracks_ids.includes(track_id)){
                db.collection('tracks').updateOne(
                    { _id: ObjectId(track_id) }, 
                    { $addToSet:{ labels_ids: ObjectId(label.id) }}
                );
            }
        });

        //Tracks array to ObjectId
        after_tracks_ids= after_tracks_ids.map(ObjectId);

        await Label.findByIdAndUpdate(req.params.id, {label: new_label, tracks_ids:after_tracks_ids});
        res.redirect('/profile');
    }
}

//Delete label
const deleteLabel= async (req, res, next) => {
    //Get track
    const label= await Label.findById(req.params.id);

    //Delete label id from associated tracks
    const db = getConnection();
    db.collection('tracks').updateMany(
        { _id:{ $in: label.tracks_ids }}, 
        { $pull:{ labels_ids: ObjectId(label.id) }}
    );

    //Find by id and delete
    await Label.findByIdAndDelete(req.params.id);
    res.redirect('/profile');
}

module.exports = {
    getNewLabel,
    postNewLabel,
    getEditLabel,
    postEditLabel,
    deleteLabel
}