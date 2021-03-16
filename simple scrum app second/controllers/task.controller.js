const Task = require('../models/task.model');

exports.createTask = (req, res) => {
    if (Object.keys(req.body).length === 0) {
        res.status(400).send('No data provided!');
        return;
    }

    const resultMessage = validDataInput(req);

    if (resultMessage !== 'Valid.') {
        res.status(400).send(resultMessage);
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
        const resultMessage = validDataUpdate(req);

        if (resultMessage !== 'Valid.') {
            res.status(400).send(resultMessage);
            return;
        }

        Task.findById(req.query.id, (err, task) => {
            if (err) {
                res.status(500).send('Updatind task failed!');
            } else {

                let message = 'Cannot update';
                const body = req.body;

                if (body.name) {
                    message += ' name';
                }
               
                if (body.status) {
                    if (message === 'Cannot update') {
                        message += ' status';
                    } else {
                        message += ', status';
                    }
                }

                if (message !== 'Cannot update') {
                    message += '.';
                    res.status(400).send(message);
                    return;
                }

                if (body.description || body.startDate || body.endDate || body.tag) {
                    task.description = body.description;
                    task.startDate = body.startDate;
                    task.endDate = body.endDate;
                    task.tag = body.tag; 
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

function validDataInput (req) {
    let message = 'Valid';
    const name = req.body.name;
    const description = req.body.description;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    const status = req.body.status;
    const tag = req.body.tag;
    let bodyElements = new Map();
    let invalidBodyElements = [];
    
    bodyElements.set('name', name);
    bodyElements.set('description', description);
    bodyElements.set('startDate', startDate);
    bodyElements.set('endDate', endDate);
    bodyElements.set('status', status);
    bodyElements.set('tag', tag);

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

function validDataUpdate (req) {
    let message = 'Valid';
    const description = req.body.description;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    const tag = req.body.tag;
    let bodyElements = new Map();
    let invalidBodyElements = [];
    
    bodyElements.set('description', description);
    bodyElements.set('startDate', startDate);
    bodyElements.set('endDate', endDate);
    bodyElements.set('tag', tag);

    for (let [key, value] of bodyElements) {
        
        if (value && typeof value !== 'string' || value === "null") {
            invalidBodyElements.push(key);
            message = 'Invalid ';
        }

    }
    
    message += invalidBodyElements.join(', ');
    message += '.';
    
    return message;

};
