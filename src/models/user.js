const mongoose= require('mongoose');
const bcrypt= require('bcrypt-nodejs');
const {Schema}= mongoose;

const userSchema= new Schema({
    name: String,
    email: String,
    password: String
});

//Encrypt password
userSchema.methods.encryptPassword= (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

//Compare passwords
userSchema.methods.comparePassword= function (password) {
    return bcrypt.compareSync(password, this.password);
};

//The data is saved in a collection called users
module.exports= mongoose.model('users', userSchema);
