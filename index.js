const express = require('express');

const morgan = require('morgan');
const app = express();
const mongoose = require('mongoose');
const Models = require('./models.js');
const bodyParser = require('body-parser');
const {check, validationResult} = require('express-validator');

const Movies = Models.Movies;
const Users = Models.Users;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const cors = require('cors');
app.use(cors());
let auth = require('./auth') (app);

const passport = require('passport');
    require('./passport');

// mongoose.connect('mongodb://127.0.0.1:27017/cfDB', { useNewURLParser: true, useUnifiedTopology: true });
mongoose.connect('process.env.CONNECTION_URI', { useNewURLParser: true, useUnifiedTopology: true });

app.get('/', (req, res) => {
    res.send('Welcome to MyFlix!');
  });
  

app.get('/', passport.authenticate('jwt',{session: false}), async (req, res) => {
    await Movies.find()
        .then((movies) => {
            res.status(201).json(movies);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

app.get('/movies', passport.authenticate('jwt',{session: false}), async (req, res) => {
    await Movies.find()
        .then((movies) => {
            res.status(201).json(movies);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

app.get('/movies/:Title', passport.authenticate ('jwt',{session: false}), async (req, res) => {
    await Movies.findOne({ Title: req.params.Title })
        .then((movies) => {
            res.json(movies);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

app.get('/movies/genre/:genreName', passport.authenticate ('jwt',{session: false}), async (req, res) => {
    Movies.findOne({ 'Genre.Name': req.params.genreName })
        .then((Movies) => {
            res.json(Movies);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

app.get('/movies/director/:Name', passport.authenticate('jwt', {session: false}), async (req, res) => {
   await Movies.findOne({'Director.Name': req.params.Name})
        .then((Movies) => {
            res.json(Movies);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

app.get('/users', passport.authenticate('jwt', {session: false}), async (req, res) => {
    await Users.find()
        .then((users) => {
            res.status(201).json(users);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

app.get('/users/:username', passport.authenticate('jwt', {session: false}), async (req, res) => {
    await Users.findOne({username: req.params.username})
        .then((users) => {
            res.json(users);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});


app.put('/users/:username', passport.authenticate('jwt', {session: false}), [
    check('Username', 'Username is required').isLength({min:5}),
    check('Username', 'Username contains non alphanumberic characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
    ], async (req, res) => {
        let errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(422).json({errors: errors.array()});
        }
    await Users.findOneAndUpdate({ username: req.params.username },
        {
            $set:
            {
                username: req.body.username,
                password: req.body.password,
                email: req.body.email,
                birth_date: req.body.birth_date
            }
        },
        { new: true })
        .then((updatedUser) => {
            res.json(updatedUser);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        })
});

app.post('/users', [
    check('Username', 'Username is required').isLength({min: 5}),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
    ], async (req, res) => {
        let errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(422).json({errors: errors.array()});
        }

    let hashedPassword = Users.hashPassword(req.body.password);
    await Users.findOne({ username: req.body.username })
        .then((user) => {
            if (user) {
                return res.status(400).send(req.body.Username + 'already exists')
            } else {
                Users.create({
                        username: req.body.username,
                        password: hashedPassword,
                        email: req.body.email,
                        birth_date: req.body.birth_date,
                    })
                    .then((user) => { res.status(201).json(user); })
                    .catch((error) => {
                        console.error(error);
                        res.status(500).send('Error: ' + error);
                    });
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
        });
});

app.post('/users/:username/movies/:MovieID', passport.authenticate('jwt', {session: false}), async (req, res) => {
    await Users.findOneAndUpdate({ username: req.params.username }, {
        $push: { favoriteMovies: req.params.MovieID }
    },
        { new: true })
        .then((updatedUser) => {
            res.json(updatedUser);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

app.delete('/users/:username/movies/:MovieID', passport.authenticate('jwt', {session: false}), async (req, res) => {
    await Users.findOneAndUpdate({ username: req.params.username },
        {
            $pull: { favoriteMovies: req.params.MovieID },
        },
        { new: true }
    )
        .then((updatedUser) => {
            res.status(201).json(updatedUser);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

app.delete('/users/:username', passport.authenticate('jwt', {session: false}), async (req, res) => {
    await Users.findOneAndRemove({ username: req.params.username })
        .then((user) => {
            if (!user) {
                res.status(400).send(req.params.username + ' was not found');
            } else {
                res.status(200).send(req.params.username + ' was deleted.');
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', ()=> {
    console.log('Listening on Port ' = port);
});



// mongoimport --uri mongodb+srv://kelseymerten:Oll13dog@cluster0.xag6grs.mongodb.net/myFlixDB --collection users --type json --file users.json