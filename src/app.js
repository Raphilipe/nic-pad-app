require('dotenv').config();
const i18n = require("./i18n");
const express = require('express');
const app = express();
const path = require("path");
const bodyParser = require('body-parser');

const authentication = require("./routes/authentication");
const user = require("./routes/user");
const person = require("./routes/person");

app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('webapp'));

app.use(i18n.init);

app.get('/', function (req, res) {
    const sHostUrl = req.protocol + '://' + req.get('host');
    res.redirect(sHostUrl);
});

app.get('/activationStatus', function (req, res) {
    const sParsedUrl = req._parsedUrl;
    const sQuery = sParsedUrl.query;
    const sUrl = req.protocol + '://' + req.get('host') + "/#/userActivation/" + sQuery;
    res.redirect(sUrl);
});

app.get('/resetPassword', function (req, res) {
    const sParsedUrl = req._parsedUrl;
    const sQuery = sParsedUrl.query;
    const sUrl = req.protocol + '://' + req.get('host') + "/#/userResetPass/" + sQuery;
    res.redirect(sUrl);
});

app.use("/authentication", authentication);
app.use("/user", user);
app.use("/person", person);

module.exports = app;