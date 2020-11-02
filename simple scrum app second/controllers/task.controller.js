const Task = require('../models/task.model');

exports.createTask = (req, res) => {
    if (Object.keys(req.body).length === 0) {
        res.status(400).send('No data provided!');
        return;
    }

    const isValid = isCreateDataValid(req);

    if (isValid !== 'Invalid') {
        res.status(400).send(isValid);
        return;
    }

    const task = new Task(req.body);
    
    task.save((err) =>  {
        if (err) {
            res.status(500).send('Creating task failed!');
        } else {
            res.status(201).send('Creating task successful!');
        }
    })
};

exports.getTasks = (req, res) => {
    Task.find({ }, (err, tasks) => {
        if (err) {
            res.status(500).send('Finding tasks failed!');
        } else {
            res.status(200).send(tasks);
        }
    })
};

exports.updateTask = (req, res) => {
    if (req.query.id) {
        const isValid = isUpdateDataValid(req);

        if (isValid !== 'Invalid') {
            res.status(400).send(isValid);
            return;
        }

        Task.findById(req.query.id, (err, task) => {
            if (err) {
                res.status(500).send('Updatind task failed!');
            } else {

                let message = 'Cannot update';

                if (req.body.name) {
                    message += ' name';
                }

                if (req.body.description) {
                    task.description = req.body.description;
                }

                if (req.body.startDate) {
                    task.startDate = req.body.startDate;
                }

                if (req.body.endDate) {
                    task.endDate = req.body.endDate;
                }
                
                if (req.body.status) {
                    if (message === 'Cannot update') {
                        message += ' status';
                    } else {
                        message += ', status';
                    }
                }

                if (req.body.tag) {
                    task.tag = req.body.tag;
                }

                if (message !== 'Cannot update') {
                    message += '.';
                    res.status(400).send(message);
                    return;
                }

                task.save((err) => {
                    if (err) {
                        res.status(500).send('Updating task failed!');
                    } else {
                        res.status(200).send('Updating task successful!');
                    }
                });
            } 
        });
    } else {
        res.status(400).send('No id provided!');
    }
};

exports.deleteTask = (req, res) => {
    if (req.query.id) {
        Task.findByIdAndDelete(req.query.id, (err) => {
            if (err) {
                res.status(500).send('Deleting task failed!');
            } else {
                res.status(200).send('Deleting task successful!');
            }
        });
    } else {
        res.status(400).send('No id provided!');
    }
};

function isCreateDataValid (req) {
    let message = 'Invalid';
    const name = req.body.name;
    const description = req.body.description;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    const status = req.body.status;
    const tag = req.body.tag;

    if (!name || typeof name !== 'string') {
        message += ' name';
    }

    if (typeof description !== 'string') { //description could be empty field - not required
        if (message === 'Invalid') {
            message += ' description';
        } else {
            message += ', description';
        }
    }

    if (!startDate || typeof startDate !== 'string') {
        if (message === 'Invalid') {
            message += ' startDate';
        } else {
            message += ', startDate';
        }
    }

    if (!endDate || typeof endDate !== 'string') {
        if (message === 'Invalid') {
            message += ' endDate';
        } else {
            message += ', endDate';
        }
    }

    if (!status || typeof status !== 'string') {
        if (message === 'Invalid') {
            message += ' status';
        } else {
            message += ', status';
        }
    }

    if (!tag || typeof tag !== 'string') {
        if (message === 'Invalid') {
            message += ' tag';
        } else {
            message += ', tag';
        }
    }

    if (message !== 'Invalid') {
        message += '.';

        return message;
    }
 
    return message;
};

function isUpdateDataValid (req) {
    let message = 'Invalid';
    const description = req.body.description;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    const tag = req.body.tag;

    if (description && typeof description !== 'string') {
        message += ' description';
    }

    if (startDate && typeof startDate !== 'string') {
        if (message === 'Invalid') {
            message += ' startDate';
        } else {
            message += ', startDate';
        }
    }

    if (endDate && typeof endDate !== 'string') {
        if (message === 'Invalid') {
            message += ' endDate';
        } else {
            message += ', endDate';
        }
    }

    if (tag && typeof tag !== 'string') {
        if (message === 'Invalid') {
            message += ' tag';
        } else {
            message += ', tag';
        }
    }

    if (message !== 'Invalid') {
        message += '.';

        return message;
    }
 
    return message;
};
