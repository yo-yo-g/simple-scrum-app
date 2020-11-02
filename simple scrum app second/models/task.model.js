const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const taskSchema = new Schema ({
    name: { 
        type: String, 
        required: true,
        trim: true
    },
    description: { 
        type: String, 
        required: true,
        trim: true
    },
    creationDate: { 
        type: Date, 
        default: Date.now 
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        required: true,
        trim: true,
        enum: ['To Do', 'In Progress', 'Done']
    },
    tag: {
        type: String,
        required: true,
        trim: true
    }
});

module.exports = mongoose.model('Task', taskSchema);
