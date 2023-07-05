'use strict'

const Utils = require('./utils');

function Manager(channels) {
    channels = channels || []
    this.channels = channels
}

Manager.prototype.broadcast = function (ev, payload) {
    this.channels.forEach(function (channel) {
        channel.broadcast(ev, payload)
    })
    return this
}
Manager.prototype.on = function (ev, cb, once) {
    this.channels.forEach(function (channel) {
        channel.on(ev, cb, once)
    })
    return this
}

Manager.prototype.push = function (channel) {
    this.channels.push(channel)
    return this
}

Manager.prototype.select = function (channels) {
    const chs = this.channels.filter(channel => Utils.array_wrap(channels).indexOf(channel.name) > -1)
    return new Manager(chs)
}

Manager.prototype.has = function (channel) {
    return this.channels.filter(ch => ch.name === channel).length > 0
}

Manager.prototype.out = function (channels) {
    this.channels = this.channels.filter(ch => Utils.array_wrap(channels).indexOf(ch.name) < 0)
    return this
}

module.exports = Manager
