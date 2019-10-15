const users = require('../models').Users;

module.exports =  {
 register
};

function register(req, res) {
    users.create({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    }).then(response => res.status(200).send ({
        message: 'User ' + response.username + ' has been created!',
    })).catch(error => {
       
        for(var i in error.errors){
            if(error.errors[i].type === 'unique violation'){
                res.status(403).json({
                    statusText: 403 + ' Forbidden!',
                    message: 'This email is already registered!',
                    error_message: error.errors[i].type
                });
            }
            if(error.errors[i].type === 'Validation error') {
                res.status(403).json({
                    statusText: 403 + ' Forbidden!',
                    message: 'A filed cannot be empty!',
                    error_message: error.errors[i].type
                });
            } 
            if(error.errors[i].type === 'notNull Violation') {
                res.status(403).json({
                    statusText: 403 + ' Forbidden!',
                    message: 'A filed cannot be null!',
                    error_message: error.errors[i].type
                });
            } 
            else{
                res.json(error);
            }
        }
    });
}