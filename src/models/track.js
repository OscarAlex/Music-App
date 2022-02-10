const mongoose= require('mongoose');
const {ObjectId}= require('mongodb');
const {Schema}= mongoose;

const trackSchema= new Schema ({
    name: String,
    file_id: ObjectId
    //chunk_id: ObjectId
});

//The data is saved in a collection called labels
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