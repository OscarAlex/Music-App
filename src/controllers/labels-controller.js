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
    //Get tracks
    const tracks= await Track.find();
    //Get label
    var label = req.body.label;
    //Delete label
    delete req.body.label
    //Get tracks
    const tracks_ids= Object.keys(req.body);
    console.log('Tracks', tracks_ids);

    //Verify if label already exists
    const verify_label= await Label.findOne({label: label});
    //If no label
    if(!label){
        const tracks= await Track.find();
        //Create and save flash message
        req.flash('labelMessage', 'Write a label');
        res.locals.labelMessage= req.flash('labelMessage');
        res.render('add_label', {tracks});
    }
    else if(verify_label){
        const tracks= await Track.find();
        //Create and save flash message
        req.flash('labelMessage', 'This label already exists');
        res.locals.labelMessage= req.flash('labelMessage');
        res.render('add_label', {tracks});
    }
    //If no errors
    else{
        //Create new Label object and save it
        const newLabel= new Label();
        newLabel.label= label;
        newLabel.tracks_ids= tracks_ids;
        await newLabel.save();
        res.redirect('/profile');
    }
};

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
    const labels= await Label.find({ _id:{ $nin: req.params.id}})
    //If no label
    if(!new_label){
        const label= await Label.findById(req.params.id);
        const tracks= await Track.find();
        req.flash('labelMessage', 'Write a label');
        res.locals.labelMessage= req.flash('labelMessage');
        res.render('edit_label', {label, tracks});
    }
    //If label already exists
    else if(labels.some(e => e.label == new_label)){
        const label= await Label.findById(req.params.id);
        const tracks= await Track.find();
        //Create and save flash message
        req.flash('labelMessage', 'This label already exists');
        res.locals.labelMessage= req.flash('labelMessage');
        res.render('edit_label', {label, tracks});
    }
    //If no errors
    else{
        //Get checked tracks
        const tracks= Object.keys(req.body);
        await Label.findByIdAndUpdate(req.params.id, {label: new_label, tracks_ids:tracks});
        res.redirect('/profile');
    }
}

//Delete label
const deleteLabel= async (req, res, next) => {
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
};