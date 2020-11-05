require('./passport-OAuth');

const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const passport = require('passport');
const cookieSession = require('cookie-session');

app.use(cors())

// parse application/urlencoded-form
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// cookie setup
app.use(cookieSession({
    name: 'silverback-user',
    keys: ['key1', 'key2']
}))

// middleware to check if user is logged in
const isLoggedIn = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.sendStatus(401);
    }
}

app.use(passport.initialize());
app.use(passport.session());

// route set-up
app.get('/', (req, res) => res.send('Welcome to the Landing Page!'))
app.get('/unauthorized', (req, res) => res.send('You are not authorized to login'))

// user is logged in
app.get('/page1', isLoggedIn, (req, res) => {
    res.send(`Welcome user - ${req.user.displayName}!`)
})

// OAuth Routes
app.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/google/callback', passport.authenticate('google', { failureRedirect: '/unauthorized' }),
    function (req, res) {
        // upon successful authentication, redirect to page1
        res.redirect('/page1');
    }
);

// logout route
app.get('/logout', (req, res) => {
    // clear cookie session and redirect to landing page
    req.session = null;
    req.logout();
    res.redirect('/');
})

app.listen(3000, () => console.log(`SilverBack Assignment - listening on port ${3000}!`))