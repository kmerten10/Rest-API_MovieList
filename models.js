const mongoose = require('mongoose');

let movieSchema = mongoose.Schema({
    Title: {type: String, required: true},
    Description: {type: String, required: true},
    Genre: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Movies'},
    Director: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Movies'},
});

let userSchema = mongoose.Schema({
    username: {type: String, required: true},
    Password: {type: String, required: true},
    Email: {type: String, required: true},
    Email: {type: String, required: true},
    Birthday: Date,
    FavoriteMovies: [{type: mongoose.Schema.Types.ObjectId, ref: 'Movies'}]
});

let Movies = mongoose.model('Movies', movieSchema);
let Users = mongoose.model('Users', userSchema);
module.exports.Movies = Movies;
module.exports.Users = Users;
