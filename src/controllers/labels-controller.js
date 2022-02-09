const Label= require('../models/label');

//Get New label
const getNewLabel = (req, res, next) => {
    res.render('add_label');
}

//Add New label
const postNewLabel = async (req, res, next) => {
    //Get label
    var {label} = req.body;
    label= label.toUpperCase();

    //If no label
    if(!label){
        //Create and save flash message
        req.flash('labelMessage', 'Write a label');
        res.locals.labelMessage= req.flash('labelMessage');
        res.render('add_label');
    }
    //Verify if label already exists
    const verify_label= await Label.findOne({label: label});
    if(verify_label){
        //Create and save flash message
        req.flash('labelMessage', 'This label already exists');
        res.locals.labelMessage= req.flash('labelMessage');
        res.render('add_label');
    }
    //If no errors
    else{
        //Create new Label object and save it
        const newLabel= new Label();
        newLabel.label= label;
        await newLabel.save();
        res.redirect('/profile');
    }
};

//Edit label
const getEditLabel= async (req, res, next) => {
    //Get label by id
    const label= await Label.findById(req.params.id);
    res.render('edit_label', {label});
}

const postEditLabel= async (req, res, next) => {
    //Get label
    var new_label = req.body.label;
    new_label= new_label.toUpperCase();

    //Verify if label already exists
    const label= await Label.findOne({label: new_label});
    if(label){
        //Create and save flash message
        req.flash('labelMessage', 'This label already exists');
        res.locals.labelMessage= req.flash('labelMessage');
        res.render('edit_label', {label});
    }
    //if no errors
    else{
        await Label.findByIdAndUpdate(req.params.id, {label: new_label});
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