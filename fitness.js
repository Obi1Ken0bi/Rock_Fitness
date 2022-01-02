const createError = require('http-errors')
const express = require('express')
const session = require('express-session')
const path = require('path')
const {secret}=require('./config')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const expressHandlebars = require('express-handlebars')
const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')
const profileRouter=require('./routes/profile')
const dbConnectMiddleWare = require('./bin/middleware/dbConnect')
const app = express();
const authMiddleware=require('./bin/middleware/authMiddleware')
const listRouter=require('./routes/list')
const hbs = expressHandlebars.create({
    defaultLayout: 'main',
    helpers: {
        section: function (name, options) {
            if (!this._sections) {
                this._sections = {};
            }
            this._sections[name] = options.fn(this);
            return null;
        }
    },

})
// view engine setup
app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser(secret));
app.use(express.static(path.join(__dirname, 'public')));

app.use(dbConnectMiddleWare)
app.use(session({
    secret:secret,
    resave: false,
    saveUninitialized: false,
    cookie:{signed:true}
}))
app.use((req,res,next)=>{
    req.session.role='GUEST'
    //console.log(req.session.role)
    return next();
})
app.use(authMiddleware)
//Конец настройки
app.use((req, res,next) => {
    let phones
    if (req.body.Phones) {
        phones = req.body.Phones
        req.body.Phones = phones.split(',')
    }
    return next()
})
app.use('/users', usersRouter);
app.use('/myprofile',profileRouter)
app.use('/list',listRouter)
app.use('/', indexRouter);



// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
