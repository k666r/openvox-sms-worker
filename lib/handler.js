'use strict';

var console = require('tracer').colorConsole();

var Handler = function (validator, smsSender) {
    var msgCounter = 1;

    var getMessageId = function () {
        var length = 7;
        //magic from https://gist.github.com/aemkei/1180489#file-index-js
        var q = function (a, b) {
            return ([1e15] + a).slice(-b)
        };
        return q(msgCounter++, length);
    };

    this.handle = function (job, done) {

        var msgId = getMessageId();

        var log = function (text, object) {
            console.log(msgId, text, object);
        };

        var message = job.data;
        log("received", message);

        validator.validate(message)
            .then(function (validatedMessage) {
                log("validated successfully", validatedMessage);

                return smsSender.connect()
                    .then(function () {
                        var sms = {
                            span: validatedMessage.span,
                            number: validatedMessage.targetNumber,
                            text: validatedMessage.msgText
                        };

                        log('sms for send', sms);

                        return smsSender.sendSMS(sms);
                    });
            })
            .then(function (response) {
                log('send good', response);
                return smsSender.close();
            })
            .catch(function (error) {
                log('error', error);
            })
            .done(function () {
                done();
            });
    };
};

module.exports = Handler;