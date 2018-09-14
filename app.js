const express = require('express');
const bodyParser = require('body-parser');
const logErrors = require('./bin/log-errors');
const errorHandler = require('./bin/error-handler');
const clientErrorHandler = require('./bin/client-error-handler');
const db = require('./db');

const users = require('./routes/users');
const testcases = require('./routes/testcases');
const main = require('./routes/main');

db.connect(process.env.MONGODB_URI || 'mongodb://heroku_zcss1c7w:hfcujj2kjtvh3u68r672925ove@ds251632.mlab.com:51632/heroku_zcss1c7w', 'heroku_zcss1c7w', (err) => {
    if (err) {
        console.log(err);
        process.exit(1);
    }
});

const app = express();

const allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        res.send(200);
    }
    else {
        next();
    }
};

app.use(allowCrossDomain);
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static('assets'));
app.use(logErrors);
app.use(errorHandler);
app.use(clientErrorHandler);

app.use('/users', users);
app.use('/main', main);
app.use('/testcases', testcases);

app.use((req, res, next) => {
    const err = new Error('Not Found');

    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);

    next();
});

module.exports = app;