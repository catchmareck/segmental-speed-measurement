'use strict';

const express = require('express');
const path = require('path');
const sassMiddleware = require('node-sass-middleware');

const routes = require('./routes');

const app = express();

const PORT = 8080;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(sassMiddleware({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    indentedSyntax: false, // true = .sass and false = .scss
    sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(routes);

// error handler
app.use((err, req, res, next) => {
    
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error/error');
});
app.listen( PORT, function () {

    console.log('######## Segmental Speed Measurement ########');
    console.log(`Listening on port: ${PORT}...`);
    console.log('---');
});

module.exports = app;
