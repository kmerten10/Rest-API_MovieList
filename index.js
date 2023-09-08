const express = require('express');
const app = express();
let http = require('http');

console.log('My first node test server is running on port 8080');

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
        title: "Garden State"
    },
    {
        title: "Frozen"
    },
]

app.get('/movies', (req, res) => {
    res.json(topMovies);
});

app.get('/', (req, res) => {
    res.send('Here are 10 great movies!');
});

app.use(express.static('public'));

app.use((err, req, res, next)=>{
    console.error(err.stack);
    res.status(500).send('Something Broke!');
});


app.listen(8080, () => {
    console.log('My app is listening on port 8080');
});