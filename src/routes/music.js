const { resolveSoa } = require('dns');
const express= require('express');
const req = require('express/lib/request');
const res = require('express/lib/response');
const router= express.Router();
//const passport= require('passport');

//Schema for the labels
const Label= require('../models/label');


//Add label
router.get('/add_label', (req, res, next) => {
    res.render('add_label');
});

router.post('/new_label', async (req, res, next) => {
    //Get label
    var {label} = req.body;
    label= label.toUpperCase();

    //If not label
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
    //If not errors
    else{
        //Create new Label object and save it
        const newLabel= new Label();
        newLabel.label= label;
        await newLabel.save();
        res.redirect('/profile');
    }
});

//Edit label
router.get('/edit_label/:id', async (req, res, next) => {
    const label= await Label.findById(req.params.id);
    res.render('edit_label', {label});
});

router.post('/edit_label/:id', async (req, res, next) => {
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
    else{
        await Label.findByIdAndUpdate(req.params.id, {label: new_label});
        res.redirect('/profile');
    }
});

//Delete label
router.post('/delete_label/:id', async (req, res, next) => {
    //Find by id and delete
    await Label.findByIdAndDelete(req.params.id);
    res.redirect('/profile');
});

module.exports = router;