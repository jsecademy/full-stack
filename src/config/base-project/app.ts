import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as root from 'app-root-path';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as routes from './server/routes/routes';
import * as mongoose from 'mongoose';

const settings = require('./config/settings.json');
const db = settings.database;

mongoose.connect(`mongodb://localhost:${db.port}/${db.name}`);

const app = express();

// setup sessions
app.use(session({
    secret: "hello-secret-hash",
    resave: false,
    saveUninitialized: false
}));

// view engine setup
app.set('views', `${root.path}/server/views/`);
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(cookieParser());
app.use('/api', routes);

// catch 404 and forward to error handler
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    let err: any = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

app.use(function(err: any, req: express.Request, res: express.Response, next: Function) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

export = app;