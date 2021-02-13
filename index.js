const express = require('express');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const path = require('path');
const Traffic = require('./models/traffic');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const catchAsync = require('./utils/catchAsync');


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
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.render('home.ejs')
});

app.post('/', async (req, res, next) => {
    const traffic = new Traffic(req.body.traffic);
    await traffic.save();
    res.redirect('/');
});

app.get('/', async (req, res) => {
    const listName = await Traffic.find({});
    res.render('home.ejs', {listName})
});

app.delete('/:id', catchAsync(async (req, res) => {
    const {id} = req.params;
    await Traffic.findByIdAndDelete(id);
    res.redirect('/');
}))


// ***TEST DATA***
// app.get('/booboo', async (req, res) => {
//     const traffic = new Traffic({ name: 'christie', status: '2' })
//     await traffic.save();
//     res.send(traffic)
// });

// app.all('*', (req, res, next) => {
//     next(new ExpressError('Page Not Found', 404))
// })

app.listen(3000, () => {
    console.log('Serving on port 3000')
})
