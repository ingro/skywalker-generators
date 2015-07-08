#! /usr/bin/env node

var ronin = require('ronin');

var program = ronin({
    path: __dirname,
    desc: 'Generators for Skywalker\'s app',
    delimiter: ':'
});

return program.run();