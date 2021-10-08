require('dotenv').config()

//___________________
//Dependencies
//___________________
const express = require('express');
const methodOverride = require('method-override');
const mongoose = require ('mongoose');
const app = express();
const db = mongoose.connection;
const squad = require('./models/squad.js')
//___________________
//Port
//___________________
// Allow use of Heroku's port or your own local port, depending on the environment
const PORT = process.env.PORT || 3000;

//___________________
//Database
//___________________
// How to connect to the database either via heroku or locally
const MONGODB_URI = process.env.MONGODB_URI;

// Connect to Mongo &
// Fix Depreciation Warnings from Mongoose
// May or may not need these depending on your Mongoose version
mongoose.connect(MONGODB_URI , { useNewUrlParser: true, useUnifiedTopology: true }
);

// Error / success
db.on('error', (err) => console.log(err.message + ' is mongod not running?'));
db.on('connected', () => console.log('mongod connected: ', MONGODB_URI));
db.on('disconnected', () => console.log('mongod disconnected'));

const Predict = require('./models/predict.js');

//___________________
//Middleware
//___________________

//use public folder for static assets
app.use(express.static('public'));

// populates req.body with parsed info from forms - if no data from forms will return an empty object {}
app.use(express.urlencoded({ extended: false }));// extended: false - does not allow nested objects in query strings
app.use(express.json());// returns middleware that only parses JSON - may or may not need it depending on your project

//use method override
app.use(methodOverride('_method'));// allow POST, PUT and DELETE from a form


//___________________
// Routes
//___________________
//localhost:3000

//INDEX AND SHOW PAGES//


app.get('/chelsea' , (req, res) => {
  res.render('index.ejs')
});

app.get('/team', (req, res) => {
  res.render('team.ejs', {data: squad});
})

app.get('/trophies', (req, res) => {
  res.render('trophies.ejs')
})


// INDEX
app.get('/fixtures', (req, res) => {
  Predict.find({}, (error, allPredictions) => {
    res.render('fixtures.ejs', {
      predicts: allPredictions,
    });
  });
});

// NEW
app.get('/fixtures/new', (req, res) => {
  res.render('new.ejs');
});

// DELETE
app.delete('/fixtures/:id', (req, res) => {
  Predict.findByIdAndDelete(req.params.id, (err, data) => {
    res.redirect('/fixtures');
  });
});

// UPDATE
app.put('/fixtures/:id', (req, res) => {
  Predict.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  }, (error, updatedPrediction) => {
    res.redirect(`/fixtures/${req.params.id}`);
  });
});

// CREATE
app.post('/fixtures', (req, res) => {
  Predict.create(req.body, (error, createdPrediction) => {
    res.redirect('/fixtures');
  });
});

// EDIT
app.get('/fixtures/:id/edit', (req, res) => {
  Predict.findById(req.params.id, (error, foundPrediction) => {
    res.render('edit.ejs', {
      predict: foundPrediction,
    });
  });
});

// SHOW
app.get('/fixtures/:id', (req, res) => {
  Predict.findById(req.params.id, (err, foundPrediction) => {
    res.render('showw.ejs', {
      predict: foundPrediction,
    });
  });
});


// SHOW
app.get('/team/:indexOfSquad', (req, res) => {
  res.render('show.ejs', { data: squad[req.params.indexOfSquad]})
})



//___________________
//Listener
//___________________
app.listen(PORT, () => console.log('express is listening on:', PORT));


