const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

let movieSchema = mongoose.Schema({
    Title: { type: String, required: true },
    Description: { type: String, required: true },
    Genre: [{
        Name: { type: String },
        Description: { type: String }
    }],
    Director: [{
        Name: { type: String },
        Bio: { type: String }
    }],
    Image: { type: String, required: false }
});

let userSchema = mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    birth_date: Date,
    favoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movies' }]
});

userSchema.statics.hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
};

userSchema.methods.validatePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
}


let Movies = mongoose.model('Movies', movieSchema);
let Users = mongoose.model('Users', userSchema);


module.exports.Movies = Movies;
module.exports.Users = Users;
