var nunjucks = require('nunjucks');
var path = require('path');

var env = new nunjucks.configure(path.join(__dirname, './../templates'), {
	watch: false,
	tags: {
		blockStart: '<%',
		blockEnd: '%>',
		variableStart: '<$',
		variableEnd: '$>',
		commentStart: '<#',
    	commentEnd: '#>'
	}
});

module.exports = env;