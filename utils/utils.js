var fs = require('fs');
var path = require('path');

var configFileName = 'skygen.json';

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
            config = require(path.join(process.cwd(), configFileName));
        } catch(e) {
            //
        }

        return config;
    }
};

module.exports = utils;