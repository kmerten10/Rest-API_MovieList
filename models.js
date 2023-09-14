const mongoose = require('mongoose');

let movieSchema = mongoose.Schema({
    Title: {type: String, required: true},
    Description: {type: String, required: true},
    Genre: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Genre'}],
    Director: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Director'}],
});

let userSchema = mongoose.Schema({
    username: {type: String, required: true},
    Password: {type: String, required: true},
    Email: {type: String, required: true},
    Birthday: Date,
    FavoriteMovies: [{type: mongoose.Schema.Types.ObjectId, ref: 'Movies'}]
});

// let directorSchema = mongoose.Schema({
//     Name: {type: String, required: true},
//     Bio: {type: String, required: true},
// });

// let genreSchema = mongoose.Schema({
//     Name: {type: String, required: true},
//     Description: {type: String, required: true},
// });

// let Genre = mongoose.model('Genre', genreSchema);
// let Director = mongoose.model('Director', directorSchema);

let Movies = mongoose.model('Movies', movieSchema);
let Users = mongoose.model('Users', userSchema);

// module.exports.Genre = Genre;
// module.exports.Director = Director;

module.exports.Movies = Movies;
module.exports.Users = Users;
