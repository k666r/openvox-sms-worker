'use strict';

var kue = require('kue');
var Joi = require('joi');
var when = require('when');
var console = require('tracer').colorConsole();

var openvoxWrapper = require('./lib/openvoxWrapper');

var Handler = require('./lib/handler');


var Server = function (config) {

    var configSchema = require('./lib/configSchema');
    var smsSender, validator;

    var validate = function (file, schema) {
        var defer = when.defer();
        Joi.validate(file, schema, function (err, value) {
            if (err) {
                defer.reject(err);
            } else {
                defer.resolve(value);
            }
        });
        return defer.promise;
    };

    var init = function () {
        var msgFormat = require('./lib/msgFormat');
        validator = new (require('./lib/validator'))(msgFormat);
        smsSender = new openvoxWrapper(config['openvox-sms']);
        return when.resolve(1);
    };

    this.start = function () {

        validate(config, configSchema)
            .then(function (validatedConfig) {
                return init();
            })
            .then(function () {
                var queue = kue.createQueue();
                var handler = new Handler(validator, smsSender);
                queue.process(config.kue.queue, handler.handle);
            })
    };
};

module.exports = Server;