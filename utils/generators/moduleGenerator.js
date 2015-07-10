// Example configuration
// {
// 	"path": "dummy",
// 	"connector": {
// 		"default": {
// 			"type": "mysql",
// 			"config": {
// 				"host": "127.0.01",
// 				"user": "foo",
// 				"password": "bar",
// 				"database": "baz"
// 			}
// 		}
// 	}
// }

var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var chalk = require('chalk');
var _ = require('lodash');

var mysql = require('mysql');
var Promise = require('bluebird');

var Utils = require('./../utils');
var Renderer = require('./../renderer');

var ModuleGenerator = function() {
	if (! Utils.checkConfig()) {
        throw new Error('A skygen.json config file must be present in the current working directory!');
    }

    this.config = Utils.getConfig();
    this.rootPath = path.resolve(process.cwd(), this.config.path);
};

ModuleGenerator.prototype.createDirectories = function() {
	this.rootDir = path.resolve(this.rootPath, 'modules', this.name);
	this.createDirectory(this.rootDir);

	this.listDir = path.resolve(this.rootDir, 'list');
	this.createDirectory(this.listDir);

	this.listTplDir = path.resolve(this.listDir, 'templates');
	this.createDirectory(this.listTplDir);

	this.editDir = path.resolve(this.rootDir, 'edit');
	this.createDirectory(this.editDir);

	this.editTplDir = path.resolve(this.editDir, 'templates');
	this.createDirectory(this.editTplDir);
};

ModuleGenerator.prototype.createModuleFile = function() {
	this.createFile('module.nunjucks', this.rootDir, this.name + '.js');
	this.createFile('entity.nunjucks', path.resolve(this.rootPath, 'entities'), this.name + '.js');
};

ModuleGenerator.prototype.createListFiles = function() {
	this.createFile('list/list_controller.nunjucks', this.listDir, 'list_controller.js');
	this.createFile('list/list_views.nunjucks', this.listDir, 'list_views.js');
	this.createFile('list/templates/_row.nunjucks', this.listTplDir, '_row.nunjucks');
	this.createFile('list/templates/grid.nunjucks', this.listTplDir, 'grid.nunjucks');
};

ModuleGenerator.prototype.createEditFiles = function() {
	this.createFile('edit/edit_controller.nunjucks', this.editDir, 'edit_controller.js');
	this.createFile('edit/edit_views.nunjucks', this.editDir, 'edit_views.js');
	this.createFile('edit/templates/edit.nunjucks', this.editTplDir, 'edit.nunjucks');;
	this.createFile('edit/templates/title.nunjucks', this.editTplDir, 'title.nunjucks');
};

ModuleGenerator.prototype.createDirectory = function(dir) {
	mkdirp.sync(dir);

	console.log('Created dir ' + chalk.bold.yellow(dir));
};

ModuleGenerator.prototype.createFile = function(tpl, rootDir, fileName) {
	var data = Renderer.render(tpl, this.templateParams);
	var filePath = path.resolve(rootDir, fileName);
	fs.writeFile(filePath, data.trim());

	console.log('Created file ' + chalk.bold.green(filePath));
};

ModuleGenerator.prototype.buildTemplateParams = function() {

	var params = {
		name: this.name,
		fields: []
	};

	var self = this;

	return new Promise(function (resolve, reject) {

		if (self.params.table) {

			self.getTableFields().then(function(fields) {
				params.fields = _.pluck(fields, 'Field');

				self.templateParams = params;

				resolve();
			});

		} else {
			self.templateParams = params;

			resolve();
		}
	});
}

ModuleGenerator.prototype.getTableFields = function() {

	var self = this;

	return new Promise(function (resolve, reject) {
		var mysqlConfig = self.config.connector.default.config;

		var connection = mysql.createConnection({
			host: mysqlConfig.host,
			user: mysqlConfig.user,
			password: mysqlConfig.password,
			database: mysqlConfig.database,
		});

		connection.connect(function(err) {
			if (err) {
				console.log(err);
			}

			// console.log('connected as id ' + connection.threadId);

			connection.query('SHOW COLUMNS FROM ' + self.params.table, function(err, rows, fields) {

				if (err) {
					console.log(err);
				}

				// console.log(rows);
				resolve(rows);

				connection.end();
			});
		});
	});
}

ModuleGenerator.prototype.build = function(params) {

	_.defaults(params, {
		table: false
	});

	this.params = params;

	this.name = params.name;

	var self = this;

	this.buildTemplateParams().then(function() {

		self.createDirectories();
		self.createModuleFile();
		self.createListFiles();
		self.createEditFiles();
	});
};

module.exports = ModuleGenerator;