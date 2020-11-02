const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const userSchema = new Schema ({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: (value) => {
            if (!validator.isEmail(value)) {
                throw new Error({ error: 'Invalid Email address' });
            }
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 8
    }
});

userSchema.pre('save', async function (next) {
    // Hash the password before saving the user model
    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 9);
    }
    next();
});

userSchema.statics.findByCredentials = async function (email, password) {
    // Search for a user by email and password.
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error('Invalid login credentials!');
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
        throw new Error('Invalid login credentials!');
    }

    return user;
}

const User = mongoose.model('User', userSchema);

module.exports = User;
