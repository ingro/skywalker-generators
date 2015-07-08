var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var chalk = require('chalk');

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
	var data = Renderer.render(tpl, { name: this.name });
	var filePath = path.resolve(rootDir, fileName);
	fs.writeFile(filePath, data.trim());

	console.log('Created file ' + chalk.bold.green(filePath));
};

ModuleGenerator.prototype.build = function(name) {
	this.name = name;

	this.createDirectories();
	this.createModuleFile();
	this.createListFiles();
	this.createEditFiles();
};

module.exports = ModuleGenerator;