const Label= require('../models/label');
const Track= require('../models/track');
const multer= require('multer');
const {getConnection}= require('../database');
const {GridFSBucket}= require('mongodb');
const {Readable}= require('stream');
const {ObjectId}= require('mongodb');

//Upload new track
const getUploadTrack= async (req, res, next) => {
    //Get labels
    const labels= await Label.find();
    res.render('upload_track', {labels});
}

const postUploadTrack= (req, res, next) => {
    //Settings
    //Save file in memory, not create a file
    const storage= multer.memoryStorage();
    //Set multer
    const upload= multer({
        storage: storage,
        limits: {
            //15 MB
            fieldSize: 15000000,
            //Upload 1 file at a time
            files: 1
        }
    });

    //Listen when a file is uploaded
    upload.single('track') (req, res, async (err) => {
        //Get labels
        const labels= await Label.find();
        //Get name
        const name= req.body.name;
        //Delete name
        delete req.body.name
        //Get labels
        const labels_ids= Object.keys(req.body);
        console.log('Labels', labels_ids);

        //If error
        if(err){
            req.flash('trackMessage', err);
            res.locals.trackMessage= req.flash('trackMessage');
            res.render('upload_track', {labels})
        }
        //If no name
        else if(!name){
            req.flash('trackMessage', 'Write a name');
            res.locals.trackMessage= req.flash('trackMessage');
            res.render('upload_track', {labels})
        }
        //If no errors, save in database
        else{
            //Convert audio to a readable string and get it from buffer
            const readableTrack= new Readable();
            readableTrack.push(req.file.buffer);
            //When finish, stop the conversion
            readableTrack.push(null);

            //Get db connection
            const db= getConnection();
            //Save in collections named tracks.files and tracks.chunks
            //Different from tracks collection we created
            const bucket= new GridFSBucket(db, {
                bucketName: 'tracks'                
            })

            //Upload to bucket with filename= name of the song
            const uploadStream= bucket.openUploadStream(name);
            readableTrack.pipe(uploadStream);

            //If errors
            uploadStream.on('error', () => {
                req.flash('trackMessage', 'Error uploading file');
                res.locals.trackMessage= req.flash('trackMessage');
                res.render('upload_track')
            });

            //When finish
            uploadStream.on('finish', async () => {
                //Save in tracks model
                const newTrack= new Track();
                newTrack.name= name;
                newTrack.file_id= uploadStream.id;
                newTrack.labels_ids= labels_ids;
                await newTrack.save();

                req.flash('trackMessage', 'File uploaded successfully');
                res.redirect('/profile');
            });
        }        
    });
}

//Edit track
const getEditTrack= async (req, res, next) => {
    //Get track and labels
    const track= await Track.findById(req.params.id);
    const labels= await Label.find();
    res.render('edit_track', {track, labels});
}

const postEditTrack= async (req, res, next) => {
    //Get name
    const new_name= req.body.name;
    //Delete name and method
    delete req.body.name
    delete req.body._method
    
    //If no name
    if(!new_name){
        const track= await Track.findById(req.params.id);
        const labels= await Label.find();
        req.flash('trackMessage', 'Write a name');
        res.locals.trackMessage= req.flash('trackMessage');
        res.render('edit_track', {track, labels})
    }
    //If no errors
    else{
        //Get labels array
        const labels= Object.keys(req.body);
        //Update by id
        await Track.findByIdAndUpdate(req.params.id, {name: new_name, labels_ids: labels});
        res.redirect('/profile');
    }
}

//Delete track
const deleteTrack= async (req, res, next) => {
    //Get track
    const track= await Track.findById(req.params.id);

    //Delete from tracks.files and tracks.chunks
    const db = getConnection();
    db.collection('tracks.files').deleteOne({_id:track.file_id});
    db.collection('tracks.chunks').deleteMany({files_id:track.file_id});

    //Find by id and delete
    await Track.findByIdAndDelete(req.params.id);
    res.redirect('/profile');
}

//Get track
const getTrack= (req, res, next) => {
    //Set up response
    res.set('content-type', 'audio/mp3');
    res.set('accept-ranges', 'bytes');

    //Connection
    const db= getConnection();
    const bucket= new GridFSBucket(db, {
        bucketName: 'tracks'
    });
    
    //Download from database
    const id= new ObjectId(req.params.id);
    const downloaded= bucket.openDownloadStream(id);

    //While getting data, write chunks
    downloaded.on('data', chunk => {
        res.write(chunk);
    });
    //If error
    downloaded.on('error', () => {
        res.send('error');
    })
    //When finish
    downloaded.on('end', () => {
        res.end();
    })
}

module.exports= {
    getUploadTrack,
    postUploadTrack,
    getEditTrack,
    postEditTrack,
    deleteTrack,
    getTrack
}