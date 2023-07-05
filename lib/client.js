'use strict'

const io = require('socket.io-client');

const Channel = require('./channel');
const Manager = require('./manager');
const Utils = require('./utils');

const errorEv = '_error';


/**
 *
 * @param url
 * @param [opts]
 * @param [autoCreate]
 * @constructor
 */
function Client(url, opts, autoCreate) {
    if (autoCreate === void 0) {
        autoCreate = true
    }
    this.url = url
    this.opts = opts
    if (autoCreate) {
        this.socket = io(url, opts)
    }
    this.manager = new Manager([])
}


Client.prototype.create = function () {
    this.getSocket(true)

    return this
}

Client.prototype.setUrl = function (url) {
    this.url = url
    return this
}

Client.prototype.setOptions = function (options) {
    this.opts = options
    return this
}


Client.prototype.subscribe = function (channels) {
    const self = this;

    this.connected(function () {
        self.emit('subscribe', {
            channels
        })
    })
    if (typeof channels === 'string') {
        const chan = new Channel(channels, this);
        if (this.manager.has(channels)) {
            return chan
        }
        this.manager.push(chan)
        return chan
    }
    Utils.array_wrap(channels).forEach(function (channel) {
        self.manager.has(channel) || self.manager.push(new Channel(channel, self))
    })
    return this.manager
}

Client.prototype.unsubscribe = function (channels) {
    const self = this;

    this.connected(function () {
        self.emit('unsubscribe', {
            channels
        })
    })
    this.manager.out(channels)

    return this.manager
}

Client.prototype.connected = function (cb) {
    if (this.getSocket().connected) {
        if (cb === undefined) {
            return new Promise(resolve => {
                resolve(this)
            })
        } else {
            return cb(this, this.socket)
        }
    }

    if (cb === undefined) {
        return new Promise(resolve => {
            this.on('connect', () => {
                resolve(this)
            })
        })
    }

    this.on('connect', () => cb(this, this.socket))
}

Client.prototype.broadcast = function (channel, ev, payload) {
    if (typeof channel === 'string') {
        return this.select(channel, true).broadcast(ev, payload)
    }
    if (channel instanceof Array) {
        channel.forEach(ch => this.select(ch, true).broadcast(ev, payload))
    }
}


Client.prototype.select = function (channel, create) {
    create = create || true

    if (create && typeof channel === 'string' && !this.manager.has(channel)) {
        return new Channel(channel, this)
    }

    return this.manager.select(channel)
}

Client.prototype.on = function (ev, cb) {
    this.getSocket().on(ev, cb)

    return this;
}

Client.prototype.emit = function (ev, payload) {
    return this.getSocket().emit(ev, payload)
}

Client.prototype.onError = function (cb) {
    if (cb === undefined) {
        return new Promise(resolve => {
            this.connected(() => {
                this.on(errorEv, resolve)
            })
        })
    }
    return this.connected(() => this.on(errorEv, cb))
}

Client.prototype.disconnect = function () {
    return this.close()
}

Client.prototype.connect = function () {
    return this.open()
}

Client.prototype.close = function () {
    if (this.getSocket().connected) {
        this.socket.close()
    }
    return this
}

Client.prototype.open = function () {
    if (!this.getSocket().connected) {
        this.socket.open()
    }
    return this
}

Client.prototype.recreate = function (url, opts) {
    this.close()
    if (url === undefined) {
        url = this.url
        opts = {}
    }

    if (opts === undefined && typeof url === 'object') {
        opts = url
        url = this.url
    }

    this.socket = io(url, opts)
    this.manager = new Channel.Manager([])
    return this
}

Client.prototype.main = function () {
    return this.select('*')
}

Client.prototype.getSocket = function (create) {
    if (create === void 0) {
        create = true
    }
    if (this.socket === void 0 && create) {
        this.socket = io(this.url, this.opts)
    }

    return this.socket;
}

Client.install = function (Vue, options) { // for vue
    options = options || {}
    Vue.prototype.$io = new Client(options.url, options.options, options.autoCreate)
}


export default Client
