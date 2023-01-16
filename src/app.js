const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const cors = require('cors')

const indexRouter = require('./routes/index');
const authRouter = require('./v1/auth/router');
const bankRouter = require('./v1/bank/router');
const memberRouter = require('./v1/members/router');
const adminRouter = require('./v1/admin/router');



// const passport = require('./middleware/passport');
const errorHandler = require('./middleware/error_handler');

const app = express();

app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/bank', bankRouter);
app.use('/member', memberRouter);
app.use('/admin', adminRouter);


app.use(errorHandler);

module.exports = app;
