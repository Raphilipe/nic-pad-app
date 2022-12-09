const path = require("path");
const { I18n } = require('i18n');
const i18n = new I18n();
const currentLocale = Intl.DateTimeFormat().resolvedOptions().locale;

i18n.configure({
    locales: ['en', 'pt'],
    directory: path.join(__dirname, '/locales'),

});

module.exports = i18n;