const mongoose= require('mongoose');
const {mongodb}= require('./keys');

let DB;

mongoose.connect(mongodb.URI, {})
.then(db => {
    console.log('Database connected');
})
.catch(err => console.log(err));

DB= mongoose.connection
const getConnection= () => DB;

module.exports= {getConnection}