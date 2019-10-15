var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var db = require('../models').Users;
const passportJWT = require('passport-jwt');

const JWTStrategy   = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

passport.use(new LocalStrategy (
    {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true
    },

    function(req ,email, password, done) {
        db.findOne({
            where: {
                email: email
            }
        }).then(function(dbUser) {
            if(!dbUser) {
                return done(null, false, {
                    message: "Incorrect e-mail"
                });
            } else if(!dbUser.validPassword(password)) {
                return done(null, false, {
                    message: "Incorrect password!"
                });
            }
            return done(null, dbUser);
        });
    }
));

  // In order to help keep authentication state across HTTP requests,
  // Sequelize needs to serialize and deserialize the user
passport.serializeUser(function(user, cb) {
    cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
});

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'secret', 
}, function(jwtPayload, cb) {
    return db.findOne({
        where: {
            id: jwtPayload.id
        }
    }).then(user => {
        return cb(null, user);
    }).catch(err => {
        return cb(err);
    });
}));

module.exports = passport;