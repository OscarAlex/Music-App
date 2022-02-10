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
    const all_labels= await Label.find();
    res.render('upload_track', {all_labels});
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
        //Get name
        const name= req.body.name;
        //Delete name
        delete req.body.name

        //Get labels
        const labels= Object.keys(req.body);
        console.log('Labels', labels);

        //If error
        if(err){
            req.flash('trackMessage', err);
            //Get labels
            const all_labels= await Label.find();
            res.render('upload_track', {all_labels})
        }
        //If no name
        else if(!name){
            req.flash('trackMessage', 'Write a name');
            //Get labels
            const all_labels= await Label.find();
            res.render('upload_track', {all_labels})
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
            //const uploadStream= bucket.openUploadStream(name, {metadata: labels});
            const uploadStream= bucket.openUploadStream(name);
            readableTrack.pipe(uploadStream);

            //If errors
            uploadStream.on('error', () => {
                req.flash('trackMessage', 'Error uploading file');
                res.render('upload_track')
            });

            //When finish
            uploadStream.on('finish', async () => {
                //Save in tracks model
                const newTrack= new Track();
                newTrack.name= name;
                newTrack.file_id= uploadStream.id;
                await newTrack.save();

                req.flash('trackMessage', 'File uploaded successfully');
                res.redirect('/profile');
            });
        }        
    });
}

//Edit track
const getEditTrack= async (req, res, next) => {
    //Get track by id
    const track= await Track.findById(req.params.id);
    res.render('edit_track', {track});
}

const postEditTrack= async (req, res, next) => {
    //Get track
    await Track.findByIdAndUpdate(req.params.id, {name: req.body.name});
    res.redirect('/profile');
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
    //Connection
    const db= getConnection();
    const bucket= new GridFSBucket(db, {
        bucketName: 'tracks'
    });
    
    res.set('content-type', 'audio/mp3');
    res.set('accept-ranges', 'bytes');
    
    //Download from database
    const id= new ObjectId(req.params.id);
    const downloaded= bucket.openDownloadStream(id);

    downloaded.on('data', chunk => {
        res.write(chunk);
    });
    downloaded.on('error', () => {
        res.send('error');
    })
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