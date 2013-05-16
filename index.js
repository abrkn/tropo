var request = require('request')
, _ = require('lodash')
, parseXml = require('xml2js').parseString

var Tropo = module.exports = function(options) {
    this.options = options || {}
    _.defaults(this.options, {
        uri: 'http://api.tropo.com/1.0/sessions'
    })
}

Tropo.prototype.message = function(number, message, cb) {
    request({
        uri: this.options.uri,
        qs: {
            action: 'create',
            token: this.options.messagingToken,
            msg: message,
            number: number
        }
    }, function(err, res, body) {
        if (err) return cb(err)

        parseXml(body, function(err, body) {
            if (err) return cb(err)
            if (body.session.success[0] != 'true') return cb(new Error(body.session.reason[0]))
            cb()
        })
    })
}

Tropo.prototype.call = function(number, message, cb) {
    request({
        uri: this.options.uri,
        qs: {
            action: 'create',
            token: this.options.voiceToken,
            msg: message,
            customerName: 'John Doe',
            numberToDial: number
        }
    }, function(err, res, body) {
        console.log(number)
        if (err) return cb(err)

        console.log(body)

        parseXml(body, function(err, body) {
            if (err) return cb(err)
            if (body.session.success[0] != 'true') return cb(new Error(body.session.reason[0]))
            cb()
        })
    })
}
