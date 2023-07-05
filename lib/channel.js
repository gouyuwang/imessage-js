'use strict'
function Channel(name, client) {
    this.name = name
    this.client = client
    this.registered = [];
}

Channel.prototype.broadcast = function (ev, payload) {
    if (payload === void 0) {
        payload = ev
        ev = 'message'
    }
    this.client.emit('broadcast', {
        channels: this.name + '::' + ev, payload
    })
    return this;
}

Channel.prototype.on = function (ev, cb) {
    let event = this.name + '::' + ev;
    if (this.registered.indexOf(event) > -1) {
        return this
    }
    this.registered.push(event)
    this.client.on(event, cb)
    return this;
}

module.exports = Channel
