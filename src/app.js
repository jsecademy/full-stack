#!/usr/bin/env node
"use strict";
var shell = require('shelljs');
var chalk = require('chalk');
var minimist = require('minimist');
var mean_stack_1 = require('./generators/mean-stack');
var log = console.log;
var args = minimist(process.argv.slice(2));
if (inArgs('help') || (args['_'].length === 0) && Object.keys(args).length === 1) {
    displayHelp();
    process.exit();
}
if (inArgs('version')) {
    mean_stack_1.MEANStack.getGlobalPath().then(function (path) {
        var version = mean_stack_1.MEANStack.getVersion(path + "/full-stack");
        log(chalk.yellow("" + version));
    });
}
if (inArgs('serve')) {
    mean_stack_1.MEANStack.serveLocalInstance(process.cwd(), function (data) {
        // Live feed running from process
        process.stdout.write(data);
    }).then(function (stdout) {
        // All done
        process.exit();
    }).catch(function (error) {
        log(chalk.red('Not able to find a a valid package.json file.'));
        process.exit();
    });
}
var projectName = args['_'][1]; // Get the Project Name
if (inArgs('init') && projectName) {
    mean_stack_1.MEANStack.getGlobalPath().then(function (globalPath) {
        mean_stack_1.MEANStack.writableDirectory(process.cwd()).then(function () {
            mean_stack_1.MEANStack.initializeCore(globalPath).then(function () {
                (function generateApplication() {
                    var options = {
                        type: 'input',
                        name: 'name',
                        message: 'Name your application:',
                        default: projectName,
                        validate: function (name) {
                            return !!name.trim() || 'Name is required';
                        }
                    };
                    clear();
                    mean_stack_1.MEANStack.askQuestion(options).then(function (question) {
                        mean_stack_1.MEANStack.directoryExist(process.cwd() + "/" + question.name).then(function () {
                            // Folder exists
                            clear();
                            log(chalk.white.bold.bgRed('That folder name is already taken:') + chalk.cyan(" " + process.cwd() + "/" + question.name));
                            var options = {
                                type: 'list',
                                name: 'action',
                                message: 'What would you like to do?:',
                                choices: ['Rename the application', ("Delete this directory: " + process.cwd() + "/" + question.name)]
                            };
                            mean_stack_1.MEANStack.askQuestion(options).then(function (answer) {
                                if (answer.action === 'Rename the application') {
                                    return generateApplication();
                                }
                                if (answer.action === "Delete this directory: " + process.cwd() + "/" + question.name) {
                                    var options_1 = {
                                        type: 'confirm',
                                        name: 'remove',
                                        message: "Are you sure you want to delete this directory?",
                                        default: false
                                    };
                                    mean_stack_1.MEANStack.askQuestion(options_1).then(function (answer) {
                                        if (answer.remove) {
                                            // Delete Directory
                                            shell.rm('-rf', process.cwd() + "/" + question.name);
                                            log(chalk.cyan('Deleted Directory: ') + chalk.red(process.cwd() + "/" + question.name));
                                            // Directory does not exists generate app
                                            mean_stack_1.MEANStack.generateApplication(process.cwd(), question.name).then(function () {
                                                displayPostInstallMessage(question.name);
                                            });
                                        }
                                        else {
                                            // Rename Directory
                                            return generateApplication();
                                        }
                                    });
                                }
                            });
                        }).catch(function (error) {
                            // Directory does not exists generate app
                            mean_stack_1.MEANStack.generateApplication(process.cwd(), question.name).then(function () {
                                displayPostInstallMessage(question.name);
                            });
                        });
                    });
                }());
            }).catch(function (error) {
                log(chalk.white.bold.bgRed('Core is MISSING!!!'));
                process.exit();
            });
        }).catch(function (error) {
            // Directory is not writable
            log(chalk.white.bgRed.bold('Parent directory is not writable:') + chalk.cyan(" " + process.cwd()));
            log(chalk.green.bold('Change Permissions of directory: ') + chalk.cyan('sudo chmod 0750 .'));
            process.exit();
        });
    }).catch(function (err) {
        log(chalk.white.bgRed('Global path for NPM can not be found!'));
        log(chalk.white.bgRed(err));
        process.exit();
    });
}
if (inArgs('init') && !projectName) {
    displayHelp();
    log(chalk.white.bgRed('init command requires a project name'));
    process.exit();
}
function inArgs(name) {
    if (args['_'] && args['_'].length > 0) {
        // Example full-stack init
        return args['_'].find(function (item) { return item === name.toString(); }) !== undefined;
    }
    if (args[name.toString()] !== undefined) {
        // Example full-stack --init
        return true;
    }
    return false;
}
function displayHelp() {
    // Output help and exit
    log(chalk.cyan('\n  Usage: ') + chalk.yellow('full-stack [options] [value]'));
    log(chalk.cyan('\n  Options:'));
    log(chalk.yellow('\n    init, --init') + chalk.cyan('            Creates a base project using the MEAN Stack'));
    log(chalk.yellow('\n    serve, --serve') + chalk.cyan('          Serves the local instance the application.'));
    log(chalk.yellow('\n    version, --version') + chalk.cyan('      Displays version'));
    log(chalk.yellow('\n    help, --help') + chalk.cyan('            Displays the description for each of the flags available'));
    log(chalk.cyan('\n  Read the README.md for more detailed options'));
    log(chalk.cyan('\n  Example:'));
    log(chalk.cyan('\n    $ ') + chalk.yellow('full-stack init myProjectName\n'));
}
function displayPostInstallMessage(name) {
    clear();
    log(chalk.cyan("\n  Application ") + chalk.cyan.bold("" + name) + chalk.cyan(" created"));
    log(chalk.cyan('\n  Download dependencies:'));
    log(chalk.yellow("   $ cd " + name + " && npm install"));
    log(chalk.cyan('\n  Start the application'));
    log(chalk.yellow("   $ full-stack serve\n"));
}
function requirements() {
    // Required Programs for the MEAN Stack
    if (!shell.which('git')) {
        log(chalk.white.bgRed.bold('Git is required! Install git: https://git-scm.com/'));
        process.exit();
    }
    if (!shell.which('mongo')) {
        log(chalk.white.bgRed.bold('MongoDB is required! Install MongoDB: https://docs.mongodb.com/master/installation/'));
        process.exit();
    }
}
function clear() {
    // process.stdout.write('\x1Bc');
}
