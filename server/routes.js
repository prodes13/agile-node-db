const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const passport = require('./config/passport');

const usersController = require('./controllers/users');

// Users controller 
router.post('/register', usersController.register);

router.post('/login', function(req, res, next) {
    passport.authenticate('local',{session: false}, (err, user, info) => {
        if(err || !user) {
            return res.status(400).send(info);
        }
        req.login(user, {session: false}, (err) => {
            if(err){
                res.send(err);
            }
            const token = jwt.sign(user.toJSON(), 'secret', {expiresIn: '10s'});
            return res.json({user, token});
        });
    })(req, res);
});


module.exports = router;