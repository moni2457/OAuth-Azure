require('./connectDB');

const passport = require('passport');
const mySQLconnection = require('./connectDB');
const GoogleOAuth = require('passport-google-oauth20').Strategy;

// putting the user in Cookie to be used by passport.session()
passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

passport.use(new GoogleOAuth({
    // OAuth 2.0 credentials
    clientID: "189107860928-6nbbmhe7g2i5se5383hlkfjas6ppqj5m.apps.googleusercontent.com",
    clientSecret: "NZ1URYs2DaJr9G6KYZNwIavE",
    callbackURL: "https://monisilverback.azurewebsites.net/google/callback"
},
    function (accessToken, refreshToken, profile, done) {
        //  using the profile.id to check if the user exists in Azure DB
        try {
            mySQLconnection.query("SELECT * FROM USERS WHERE id = ?", profile.id, function (err, rows) {
                if (err) {
                    console.log("error: ", err);
                }
                if (rows.length > 0) {
                    // user found, passing it to done callback
                    return done(null, profile)
                } else {
                    // no user found
                    return done(null, null)
                }
            })
        } catch (error) {
            console.log("Error detected: ", error);
        }
    }
));