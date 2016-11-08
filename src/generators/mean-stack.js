"use strict";
var shell = require('shelljs');
var inquirer = require('inquirer');
var fs = require('fs');
var path = require('path');
var directories = require('../config/directories');
var child_process = require('child_process');
/**
 * MEAN Stack Generator
 */
var MEANStack = (function () {
    function MEANStack() {
    }
    /*
     * Creates Everything Required for the MEAN Stack
     */
    MEANStack.generateApplication = function (parent, base) {
        MEANStack.coreTokens['ApplicationName'] = base;
        var promise = new Promise(function (resolve, reject) {
            MEANStack.generateDirectories(parent, base).then(function () {
                MEANStack.generateFiles(parent, base).then(function () {
                    resolve();
                });
            });
        });
        return promise;
    };
    /*
     * Create Base Directories for the MEAN Stack
     */
    MEANStack.generateDirectories = function (parent, base) {
        var promise = new Promise(function (resolve, reject) {
            var projectDir = parent + "/" + base;
            try {
                shell.mkdir('-p', projectDir); // Project Directory
                var core_1 = directories.names.core;
                MEANStack.coreDirectories.forEach(function (name) {
                    name = name.substr(name.lastIndexOf(core_1) + core_1.length + 1, name.length);
                    try {
                        shell.mkdir('-p', projectDir + "/" + name);
                    }
                    catch (err) {
                        reject(err);
                    }
                });
                resolve();
            }
            catch (error) {
                reject(error);
            }
        });
        return promise;
    };
    /*
     * Create Generic Files for the MEAN Stack
     */
    MEANStack.generateFiles = function (parent, base) {
        var projectDir = parent + "/" + base;
        var promise = new Promise(function (resolve, reject) {
            var core = directories.names.core;
            MEANStack.coreFiles.forEach(function (name) {
                var fileName = name.substr(name.lastIndexOf(core) + core.length + 1, name.length);
                try {
                    shell.touch(projectDir + "/" + fileName);
                    MEANStack.parseFile(name, projectDir + "/" + fileName);
                }
                catch (err) {
                    reject(err);
                }
            });
            resolve();
        });
        return promise;
    };
    /**
     * Parses original file
     */
    MEANStack.parseFile = function (source, destination) {
        try {
            var data = fs.readFileSync(source, 'utf8');
            if (data.indexOf('[--') !== -1 && data.indexOf('--]') !== -1) {
                // This file contains a token
                var lines = data.split('\n');
                for (var line in lines) {
                    var start = lines[line].indexOf('[--');
                    var end = lines[line].indexOf('--]');
                    if (start !== -1 && end !== -1) {
                        // This line has a token
                        var value = lines[line].substring(start + 3, end);
                        if (MEANStack.coreTokens[value]) {
                            // This is a valid token replace the value
                            var tokenized = lines[line]
                                .replace(value, MEANStack.coreTokens[value])
                                .replace('[--', '')
                                .replace('--]', '');
                            lines[line] = tokenized;
                        }
                    }
                }
                var joinedLines = lines.join('\n');
                fs.writeFileSync(destination, joinedLines, 'utf8');
            }
            else {
                // No Tokens founds just copy over code
                fs.writeFileSync(destination, data, 'utf8');
            }
        }
        catch (err) {
            throw err;
        }
    };
    MEANStack.askQuestion = function (options) {
        return inquirer.prompt(options);
    };
    MEANStack.writableDirectory = function (directory) {
        var promise = new Promise(function (resolve, reject) {
            try {
                fs.accessSync(directory, fs['W_OK'] | fs['R_OK']);
                resolve();
            }
            catch (err) {
                reject(err);
            }
        });
        return promise;
    };
    MEANStack.directoryExist = function (directory) {
        var promise = new Promise(function (resolve, reject) {
            fs.lstat(directory, function (err, stat) {
                if (!err && stat.isDirectory()) {
                    // Folder or File Exists
                    resolve(stat.isDirectory());
                }
                else {
                    // Directory does not Exists
                    if (!err && stat.isFile()) {
                        // Check if it's a file
                        reject(stat.isFile());
                    }
                    else {
                        reject(err);
                    }
                }
            });
        });
        return promise;
    };
    /**
     * Initialize the core code and registers it to this instance.
     **/
    MEANStack.initializeCore = function (base) {
        var promise = new Promise(function (resolve, reject) {
            var project = '/full-stack/src/config/base-project';
            MEANStack.directoryExist("" + base + project).then(function () {
                // Found Base Project
                MEANStack.registerFiles("" + base + project);
                resolve(); // Analyzed Project
            }).catch(function (error) {
                reject('Core Is missing!');
            });
        });
        return promise;
    };
    MEANStack.registerFiles = function (directory) {
        var ignore = directories.names.ignore;
        var files = fs.readdirSync(directory);
        files.forEach(function (file) {
            var destination = directory + "/" + file;
            var ignoreDestination = ignore.find(function (item) {
                return item === file;
            }) !== undefined;
            if (!ignoreDestination) {
                // Valid Directory or File
                var stat = fs.lstatSync(destination);
                if (stat.isFile()) {
                    MEANStack.coreFiles.push(destination);
                }
                if (stat.isDirectory()) {
                    MEANStack.coreDirectories.push(destination);
                    MEANStack.registerFiles(destination);
                }
            }
        });
    };
    /**
    * Finds the Global path for npm modules
    **/
    MEANStack.getGlobalPath = function () {
        var promise = new Promise(function (resolve, reject) {
            try {
                var binary = shell.which('npm');
                var globalDir = path.resolve(binary['stdout'] + '/../../lib/node_modules');
                resolve(globalDir);
            }
            catch (err) {
                reject(err);
            }
        });
        return promise;
    };
    MEANStack.serveLocalInstance = function (parent, cb) {
        var promise = new Promise(function (resolve, reject) {
            MEANStack.directoryExist(parent + "/package.json").then(function () {
                // This is a directory! ERROR out
                reject();
            }).catch(function (isFile) {
                if (isFile === true) {
                    // This is a valid file
                    try {
                        fs.accessSync(parent + "/package.json", fs['R_OK']);
                    }
                    catch (err) {
                        // Not able to read in JSON file
                        reject(err);
                    }
                    var config = require(parent + "/package.json");
                    if (config && config.scripts && config.scripts.start && config.scripts.start !== '') {
                        // Valid start command
                        var child = child_process.exec(config.scripts.start);
                        child.stdout.on('data', function (data) {
                            // Runs callback with live feed
                            cb(data);
                        });
                        child.stdout.on('close', function (data) {
                            // All done!
                            resolve();
                        });
                    }
                    else {
                        reject();
                    }
                }
                else {
                    // ERROR Thrown
                    reject(isFile);
                }
            });
        });
        return promise;
    };
    MEANStack.getVersion = function (parent) {
        var config = require(parent + "/package.json");
        return config.version;
    };
    MEANStack.coreTokens = {};
    MEANStack.coreFiles = [];
    MEANStack.coreDirectories = [];
    return MEANStack;
}());
exports.MEANStack = MEANStack;
