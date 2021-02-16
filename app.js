const express = require('express');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const path = require('path');
const Traffic = require('./models/model_traffic');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const catchAsync = require('./utils/catchAsync');
const uuid = require('uuid')


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

mongoose.set('useFindAndModify', false);

const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

app.use(express.urlencoded({extended: true}));


app.post('/', async (req, res, next) => {
    const traffic = new Traffic(req.body.traffic);
    await traffic.save();
    res.redirect('/');
});

app.get('/', async (req, res) => {
    console.log('Main Page')
    const listName = await Traffic.find({});
    const msgDisplay = ["Free, come on in!", "On call, but can come in.", "Busy, you shall not pass!"]
    res.render('home.ejs', {listName, msgDisplay})
});

app.put('/:id/', catchAsync(async (req, res) => {
    const {id} = req.params;
    console.log(req.body['traffic'])
    if (req.body['traffic']['status'].match(/^[0-9]+$/) == null) {
        delete req.body['traffic']['status'];
    }

    const traffic = await Traffic.findByIdAndUpdate(id, {...req.body.traffic})
    res.redirect(`/`)
}))

app.delete('/:id', catchAsync(async (req, res) => {
    const {id} = req.params;
    await Traffic.findByIdAndDelete(id);
    res.redirect('/');
}))


app.listen(3000, () => {
    console.log('Serving on port 3000')
})
