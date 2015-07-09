var fs = require('fs');
var path = require('path');

var configFileName = '.skygen';

var utils = {
    checkConfig: function() {

        try {
            var stats = fs.lstatSync(path.join(process.cwd(), configFileName));

            if (!stats.isFile()) {
                return false;
            }
        } catch (e) {
            return false;
        }

        return true;
    },

    getConfig: function() {

        var config = false;

        try {
            config = JSON.parse(fs.readFileSync(path.join(process.cwd(), configFileName), 'utf8'));
        } catch(e) {
            //
        }

        return config;
    }
};

module.exports = utils;