const User = require('../models/user.model');

exports.createUser = async function (req, res) {
    try {
        const user = new User(req.body);

        const resultMessage = validDataInput(req, res);

        if (resultMessage !== 'Valid.') {
            res.status(400).send(resultMessage);
            return;
        }

        await user.save();
        
        res.status(201).send('Creating user successful!');
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.loginUser = async function (req, res) {
    try {
        const { email, password } = req.body;
        const user = await User.findByCredentials(email, password);

        if (!user) {
            res.status(401).send({ error: 'Login failed! Check authentication credentials!' });
            return;
        }

        res.send( 'You are now logged in '  + user.name + '!');
        
    } catch (error) {
        res.status(400).send(error.message);
    }
};

exports.getUser = async function (req, res) {
    User.findById(req.query.id,  (err, user) =>  {
        if (req.query.id) {
            if (err) {
                res.status(500).send('Finding user failed!');
            } else {
                res.status(200).send(user);
            }
        } else {
            res.status(400).send('No id provided!');
        }
    })
};

exports.deleteUser = function (req, res) {
    if (req.query.id) {
        User.findByIdAndDelete(req.query.id, (err) => {
            if (err) {
                res.status(500).send('Deleting user failed!');
            } else {
                res.status(200).send('Deleting user successful!');
            }
        });
    } else {
        res.status(400).send('No id provided!');
    }
};

function validDataInput (req) {
    let message = 'Valid';
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    let bodyElements = new Map();
    let invalidBodyElements = [];
    
    bodyElements.set('name', name);
    bodyElements.set('email', email);
    bodyElements.set('password', password);

    for (let [key, value] of bodyElements) {

        if (!value || typeof value !== 'string' || value === "null") {
            invalidBodyElements.push(key);
            message = 'Invalid ';
        }

    }
    
    message += invalidBodyElements.join(', ');
    message += '.';

    return message;
};
