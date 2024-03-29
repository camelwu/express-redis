#!/usr/bin/env node

const express = require('express'),
    path = require('path'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    opn = require('opn'),
    address = require('address'),
    config = require('./configs'),
    tpl = require('express-art-template'),
    app = express(),
    { generator } = require('./utils'),
    routes = require('./routes');

app.engine('html', tpl)
app.set('view options', {
    debug: process.env.NODE_ENV !== 'production'
})
app.set('views', path.join(__dirname, './views'))
app.set('view engine', 'html')

app.use(logger('dev'))
app.use(express.static(path.join(__dirname, 'statics')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(cookieParser())

routes(app)

// start the crawler, for create sitemap.xml
// generator.start();

var server = app.listen(config.port, function () {
    var host = server.address().address
    var port = server.address().port

    console.log('Example app listening at http://%s:%s', host, port)
    process.env.NODE_ENV !== 'production' && opn("http://"+address.ip()+":"+port)
})