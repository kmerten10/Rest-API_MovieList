const mongoose = require('mongoose');

let movieSchema = mongoose.Schema({
    Title: {type: String, required: true},
    Description: {type: String, required: true},
    Genre: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Genre'},
    Director: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Director'},
});

let userSchema = mongoose.Schema({
    username: {type: String, required: true},
    Password: {type: String, required: true},
    Email: {type: String, required: true},
    Email: {type: String, required: true},
    Birthday: Date,
    FavoriteMovies: [{type: mongoose.Schema.Types.ObjectId, ref: 'Movies'}]
});

let directorSchema = mongoose.Schema({
    Name: String,
    Bio: String,
})

let genreSchema = mongoose.Schema ({
    Name: String,
    Desciprtion: String,
})

let Directors = mongoose.model('Movies', directorSchema);
let Genres = mongoose.model('Movies', genreSchema)

let Movies = mongoose.model('Movies', movieSchema);s
let Users = mongoose.model('Users', userSchema);

module.exports.Genres = Genres;
module.exports.Directors = Directors;
module.exports.Movies = Movies;
module.exports.Users = Users;

