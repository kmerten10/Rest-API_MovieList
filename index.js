const express = require('express');
    bodyParser = require('body-parser');
 

const morgan = require('morgan');
const app = express();
const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movies;
const Users = Models.Users;
const Genres = Models.Genre;
const Directors = Models.Director;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect('mongodb://127.0.0.1:27017/cfDB', {useNewURLParser: true, useUnifiedTopology: true});

app.get('/movies', async (req, res) => {
    await Movies.find()
    .then((movies) => {
        res.status(201).json(movies);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

app.get('/movies/:Title', async (req,res)=> {
    await Movies.findOne({Title: req.params.Title})
    .then((movies) => {
        res.json(movies);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

app.get('/movies/:Genre', async (req,res)=> {
    await Genres.find()
    .then((movies) => {
        res.json(genre);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

//Queries below are not working. I tried trouble shooting by updating plurals and adding and removing "movies" from the path

app.get('/movies/genres/:Name', async (req,res)=> {
    await Genres.findOne({Name: req.params.Name})
    .then((genre) => {
        res.json(genre.Name);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

app.get('/director/:Name',  (req, res) => {
    Directors.findOne({Name: req.params.Name})
    .then((director) => {
        res.json(director);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

app.post('/users', async (req, res) => {
    await Users.findOne({Username: req.body.Username})
    .then((user) => {
        if (user){
            return res.status(400).send(req.body.Username + 'already exists'); 
        } else {
            Users
            .create({
                Username: req.body.Username,
                Password: req.body.Password,
                Email: req.body.Email,
                Birthday: req.body.Birthday
            })
            .then((user)=> {res.status(201).json(user)})
            .catch((error)=> {
                console.error(error);
                res.status(500).send('Error: '+ error);
            })
        }
    })
    .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
    });
});

app.get('/users', async (req, res) => {
    await Users.find()
    .then((users) => {
        res.status(201).json(users);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

app.get('/users/:username', async (req, res)=> {
    await Users.findOne({username: req.params.username})
    .then((user) => {
        res.json(user);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});


app.put('/users', async (req, res) => {
   await Users.findOneAndUpdate({Username: req.params.Username},
    {$set:
    {
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday
    }
},
{new: true})
.then((updatedUser) => {
    res.json(updatedUser);
})
.catch((err)=> {
    console.error(err);
    res.status(500).send('Error: ' + err);
})
});

app.post('/users/:Username/movies/:MovieID', async (req, res) => {
    await Users.findOneAndUpdate({Username: req.params.Username},{
        $push: {favoriteMovies: req.params.MovieID}
    },
    {new: true})
    .then((updatedUser)=>{
        res.json(updatedUser);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

app.delete('/favoriteMovies', async (req, res) => {
    await Users.findOneAndRemove({favoriteMovies: req.params.favoriteMovies})
    .then((user) => {
        if(!user) {
            res.status(400).send(req.params.favoriteMovies + ' was not found');
        } else {
            res.status(200).send(req.params.favoriteMovies + ' was deleted.');
        }
    })
    .catch((err)=> {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

app.delete('/users/:Username', async (req, res) => {
    await Users.findOneAndRemove({Username: req.params.Username})
    .then((user) => {
        if(!user) {
            res.status(400).send(req.params.Username + ' was not found');
        } else {
            res.status(200).send(req.params.Username + ' was deleted.');
        }
    })
    .catch((err)=> {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

app.listen(8084, () => {
    console.log('My app is listening on port 8084');
});