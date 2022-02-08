const mongoose= require('mongoose');
const {Schema}= mongoose;

const labelSchema= new Schema ({
    label: String
});

//The data is saved in a collection called labels
module.exports= mongoose.model('labels', labelSchema);