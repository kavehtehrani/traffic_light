if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate');
const path = require('path');
const ModelTrafficInstance = require('./models/modelTraffic');
const ModelRoommate = require('./models/modelRoommate');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const catchAsync = require('./utils/catchAsync');
const uuid = require('uuid')
const dateFormat = require("dateformat");
const bodyParser = require('body-parser');
const fetch = require('isomorphic-fetch');
const {checkHuman} = require('./public/javascript/recaptcha')
// const {MongoStore} = require('connect-mongo')
// const MongoDBStore = require("connect-mongo")(session)

// mongoose.connect('mongodb://localhost:27017/traffic_light', {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useUnifiedTopology: true
// });

// changed to remote db
MONGO_URI = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@clustertrafficsignal.xv8s2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database Connected');
    console.log(MONGO_URI)
});

mongoose.set('useFindAndModify', false);

const app = express();
const sessionConfig = {
    secret: 'needtochange',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
}
app.use(session(sessionConfig));
app.use(flash());

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json());
console.log(path.join(__dirname, 'public'))


app.use((req, res, next) => {
    // res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.get('/', (req, res) => {
    console.log('HOME PAGE')
    API_KEY = process.env.CAPTCHA_API_KEY_V3
    res.render('home.ejs', {API_KEY})
})

app.post('/new', checkHuman, catchAsync(async (req, res) => {
    console.log('NEW REQUESTED')
    const trafficInstance = new ModelTrafficInstance({'url': uuid.v4()});
    await trafficInstance.save();
    req.flash('success', 'Successfully made a new traffic light!');
    res.redirect(302, `/${trafficInstance.url}`)
}))


app.get('/:idInstance', async (req, res) => {
    console.log('Instance Page')
    const trafficInstance = await ModelTrafficInstance.findOne({'url': req.params.idInstance}).populate('roommates')
    const instanceURL = trafficInstance.url;
    const listRoommates = trafficInstance.roommates;
    const msgDisplay = ["Free, come on in!", "Can come in quietly.", "Busy, you shall not pass!"]
    res.status(302).render('trafficInstance.ejs', {listRoommates, instanceURL, msgDisplay, dateFormat})
});

app.post('/:idInstance', async (req, res) => {
    const roommate = new ModelRoommate(req.body.roommate);
    roommate.lastUpdate = Date()
    await roommate.save();

    // add to traffic instance
    const trafficInstance = await ModelTrafficInstance.findOne({'url': req.params.idInstance})
    trafficInstance.roommates.push(roommate)
    await trafficInstance.save()

    req.flash('success', `Welcome ${roommate.name}!`);
    res.redirect(`/${req.params.idInstance}`);
});


app.put('/:idInstance/:idRoommate/', catchAsync(async (req, res) => {
    const {idRoommate} = req.params;
    console.log(req.body['roommate'])
    if (req.body['roommate']['status'].match(/^[0-9]+$/) == null) {
        delete req.body['roommate']['status'];
    }

    req.body['roommate']['lastUpdate'] = Date.now()
    const roommate = await ModelRoommate.findByIdAndUpdate(idRoommate, {...req.body.roommate})
    res.redirect(`/${req.params.idInstance}`);
}))

app.delete('/:idInstance/:idRoommate', catchAsync(async (req, res) => {
    const {idRoommate} = req.params;
    await ModelRoommate.findByIdAndDelete(idRoommate);
    res.redirect(`/${req.params.idInstance}`);
}))


PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Serving on port ${PORT}`)
})
