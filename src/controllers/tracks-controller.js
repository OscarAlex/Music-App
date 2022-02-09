const Label= require('../models/label');
const multer= require('multer');
const {getConnection}= require('../database');
const {GridFSBucket}= require('mongodb');
const {Readable}= require('stream');
const {ObjectId}= require('mongodb');

const getUploadTrack= async (req, res, next) => {
    const labels= await Label.find();
    res.render('upload_track', {labels});
}

const postUploadTrack= (req, res, next) => {
    //Save file in memory, not create a file
    const storage= multer.memoryStorage();
    //Set multer
    const upload= multer({
        storage: storage,
        limits: {
            //fields: 2,
            //15 MB
            fieldSize: 15000000,
            //Upload 1 file at a time
            files: 1
            //2 types of fields
            //parts: 3
        }
    });

    //Listen when a file is uploaded
    upload.single('track') (req, res, (err) => {
        //Get name and labels
        //console.log('Req', req.body);
        const name = req.body.name;
        //Delete name
        delete req.body.name

        const labels = Object.keys(req.body);
        console.log('Labels', labels);

        //Errors
        if(err){
            console.log(err);
        }
        //If no name
        else if(!name){
            console.log('No track name');
        }
        //Save in database
        else{
            const readableTrack= new Readable();
            //Convert audio to a readable string?
            readableTrack.push(req.file.buffer);
            //Stop the conversion
            readableTrack.push(null);

            const db= getConnection();
            const bucket= new GridFSBucket(db, {
                bucketName: 'tracks'                
            })

            //Upload to bucket
            const uploadStream= bucket.openUploadStream(name, {metadata: labels});
            const id= uploadStream.id;
            readableTrack.pipe(uploadStream);

            //Errors
            uploadStream.on('error', () => {
                console.log('Error uploading file');
            });

            uploadStream.on('finish', () => {
                res.redirect('/profile');
                console.log('File uploaded in id:', id);
            });
        }        
    });
}

//Edit
const getEditTrack= (req, res, next) => {
    //Get label by id
    //const label= await Label.findById(req.params.id);
    res.render('edit_track');
}

const getTrack= (req, res, next) => {
    //Connection
    const db= getConnection();
    const bucket= new GridFSBucket(db, {
        bucketName: 'tracks'
    });
    
    res.set('content-type', 'audio/mp3');
    res.set('accept-ranges', 'bytes');
    
    const id= new ObjectId(req.params.id);

    //Download from database
    const downloaded= bucket.openDownloadStream(id);
    //console.log('Down', downloaded);

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
    getTrack
}