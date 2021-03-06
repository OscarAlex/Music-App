const mongoose= require('mongoose');
const {ObjectId}= require('mongodb');
const {Schema}= mongoose;

const trackSchema= new Schema ({
    name: String,
    duration: Number,
    file_id: ObjectId,
    labels_ids: Array
});

//The data is saved in a collection called tracks
module.exports= mongoose.model('tracks', trackSchema);

/*
"fs.files": {    
    "_id" : "<ObjectId>",    
    "length" : "<num>",                 
    "chunkSize" : "<num>",              
    "uploadDate" : "<timestamp>",       
    "md5" : "<hash>",                   
    "filename" : "<string>",            
    "contentType" : "<string>",         
    "aliases" : "<string array>",       
    "metadata" : "<any>",   
  },  
  "fs.chunks" :{    
     "_id" : "<ObjectId>",    
     "files_id" : "<ObjectId>",    
     "n" : "<num>",    
     "data" : "<binary>"  
  }  
*/