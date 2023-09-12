const express = require('express');
const app = express();
let http = require('http');

let myLogger = (req, res, next) => {
    console.log(req.url);
    next();
};

app.use(myLogger);

let topMovies = [
    {
        title: "The Matrix"
    },
    {
        title: "Kill Bill Volume 1"
    },
    {
        title: "Inception"
    },
    {
        title: "Saving Private Ryan"
    },
    {
        title: "Spirited Away"
    },
    {
        title: "Mrs. Doubtfire"
    },
    {
        title: "Tenacious D in the Pick of Destiny"
    },
    {
        title: "How to Lose a Guy in 10 Days"
    },
    {
        title: "Pulp Fiction"
    },
    {
        title: "Frozen"
    },
]

// app.get('/movies', (req, res) => {
//     res.json(topMovies);
// });

// app.get('/', (req, res) => {
//     res.send('Here are 10 great movies!');
// });

app.use(express.static('public'));

app.get('/movies', (req, res) => {
    res.send('Successful Get request returning list of movies')
});

app.get('/movies/:Title', (req, res) => {
    res.send('Successful Get request returning movie data by title')
});

app.get('/movies/:genre/:genreName', (req, res) => {
    res.send('Successful Get request returning list of movies by genre')
});

app.get('/director', (req, res) => {
    res.send('Successful Get request returning director information')
});

app.post('/users', (req, res) => {
    res.send('Successful Post request creating new username')
});

app.put('/users', (req, res) => {
    res.send('Successful Put request updated username')
});

app.post('/favoriteMovies', (req, res) => {
    res.send('Successful Post request added movie to favorites list')
});

app.delete('/favoriteMovies', (req, res) => {
    res.send('Successful Delete request removed movie to favorites list')
});

app.delete('/users', (req, res) => {
    res.send('Successful Delete request removed username')
});

app.use((err, req, res)=>{
    console.error(err.stack);
    res.status(500).send('Something Broke!');
});


app.listen(8082, () => {
    console.log('My app is listening on port 8082');
});