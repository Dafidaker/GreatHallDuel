require('dotenv').config();
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
//var roomsRouter = require('./routes/roomsRoutes');
var playersRouter = require('./routes/playersRoutes');
var deckRouter = require('./routes/deckRoutes');
var roundRouter = require('./routes/roundRoutes');



var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('BIG SECRET'));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
//app.use('/api/rooms', roomsRouter);
app.use('/api/players',playersRouter);
app.use('/api/deck',deckRouter);
app.use('/api/round',roundRouter);

module.exports = app;
