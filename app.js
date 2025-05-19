require('dotenv').config();
const bodyparser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const hubRoutes = require('./Routes/hubRoutes');

const app = express();
const PORT = process.env.PORT || 3000;


const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/quiznet';


console.log('Attempting to connect to MongoDB at:', MONGODB_URI);
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB successfully'))
  .catch(err => console.error('MongoDB connection error:', err));


app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false
}));

// Middleware to set res.locals.user for all views
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

app.set('view engine', 'ejs');
app.set('views', 'Views');

app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static('Public'));
app.use(hubRoutes);

app.listen(PORT, () => {
  console.log('Welcome to the hub on port', PORT);
});