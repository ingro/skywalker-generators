var Command = require('ronin').Command;
var chalk = require('chalk');
var inquirer = require('inquirer');

var ModuleGenerator = require('./../utils/generators/moduleGenerator');

var Generate = Command.extend({
    desc: 'Generate boilerplate for a skywalker module',

    options: {
        name: {
            type: 'string',
            alias: 'n'
        },
        table: {
            type: 'string',
            alias: 't'
        }
    },

    run: function (name, table) {

        var confirm = {
            type: 'confirm',
            name: 'confirm',
            message: 'Sei sicuro di voler procedere? Tutti i files già presenti per il modulo "' + name + '" saranno sovrascritti!',
            default: false
        };

        inquirer.prompt([confirm], function(answers) {
            if (answers.confirm) {
                var generator = new ModuleGenerator();

                generator.build(name, table);

                console.log(chalk.bold.green('All done!'));
            } else {
                console.log('Bye');
            }
        });
    }
});

module.exports = Generate;