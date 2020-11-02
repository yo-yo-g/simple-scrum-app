const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const api = require('./routes/route'); 

const url = 'mongodb://127.0.0.1:27017/simple-scrum-app';

mongoose.connect(url, { useNewUrlParser: true })

const db = mongoose.connection;
db.once('open', () => {
  console.log('Database connected:', url + '. Welcome to Gaia!')
});
db.on('error', (err) => {
  console.error('connection error:', err)
});

const port = 443;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/api', api);

app.listen(port, () =>  {
    console.log('Server is up and running on port number: ' + port);
});
