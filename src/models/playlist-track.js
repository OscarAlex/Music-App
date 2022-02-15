const mongoose= require('mongoose');
const {ObjectId}= require('mongodb');
const {Schema}= mongoose;

const playSchema= new Schema ({
    name: String,
    file_id: ObjectId,
    labels_ids: Array
});

//The data is saved in a collection called playlist
module.exports= mongoose.model('playlist', playSchema);
