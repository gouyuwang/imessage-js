'use strict'
module.exports = Channel

module.exports.Manager = Manager

var arrayWrap = require('./utils').arrayWrap
let registered = [];

function Channel(name, client) {
  this.name = name
  this.client = client

}

Channel.prototype.broadcast = function (ev, payload) {
  if (payload === undefined) {
    payload = ev
    ev = 'message'
  }


  this.client.emit('broadcast', {
    channels: this.name + '::' + ev,
    payload
  })
  return this;
}

Channel.prototype.on = function (ev, cb, once) {
  let event = this.name + '::' + ev;
  once = once || true

  if (once && registered.indexOf(event) > -1) {
    return this
  }

  registered.push(event)
  this.client.on(event, cb)
  return this;
}


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
  const chs = this.channels.filter(channel => arrayWrap(channels).indexOf(channel.name) > -1)
  return new Manager(chs)
}

Manager.prototype.has = function (channel) {
  return this.channels.filter(ch => ch.name === channel).length > 0
}

Manager.prototype.out = function (channels) {
  this.channels = this.channels.filter(ch => arrayWrap(channels).indexOf(ch.name) < 0)
  return this
}
