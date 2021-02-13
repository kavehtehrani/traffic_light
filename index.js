const express = require('express');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const path = require('path');
const Traffic = require('./models/traffic');

mongoose.connect('mongodb://localhost:27017/traffic_light', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database Connected');
});

const app = express();
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req, res) => {
    res.render('home.ejs')
});

// ***TEST DATA***
// app.get('/booboo', async (req, res) => {
//     const traffic = new Traffic({ name: 'christie', status: '2' })
//     await traffic.save();
//     res.send(traffic)
// });

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})
