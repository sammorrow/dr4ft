let {EventEmitter} = require('events')
let Sock = require('./sock')
let cards = require('../data/cards')

module.exports = class extends EventEmitter {
  constructor({isPrivate}) {
    this.messages = Array(50)
    this.socks = []
    this.isPrivate = isPrivate
    this.timeCreated = new Date
  }
  join(sock) {
    this.socks.push(sock)
    sock.once('exit', this.exit.bind(this))
    sock.on('say', this.say.bind(this))
    sock.on('name', this.name.bind(this))
    sock.on('scout', this.scout.bind(this))
    sock.on('lookup', this.lookup.bind(this))
    sock.send('chat', this.messages)
  }
  lookup(text, sock){
    if (!text) return
    if (cards[text]){
      let [code] = Object.keys(cards[text].sets)
      let url = cards[text].sets[code].url ? cards[text].sets[code].url : null
    }
    if (url){
      let msg = { 
        text,
        url,
        time: Date.now(),
        name: sock.name
      }
      this.messages.shift()
      this.messages.push(msg)
      for (sock of this.socks)
        if (text === 'mardu scout') sock.send('secret')
        sock.send('hear', msg)
    } else {
      sock.send('error', null)
    }
  }
  scout(text, sock) {
    var msg =
    { 
      text,
      time: Date.now(),
      name: sock.name
    }
    for (sock of this.socks)
      sock.send('secret', msg)
  }
  name(name, sock) {
    if (typeof name !== 'string')
      return
    sock.name = name.slice(0, 15)
  }
  exit(sock) {
    sock.removeAllListeners('say')
    sock.removeAllListeners('lookup')
    sock.removeAllListeners('scout')

    var index = this.socks.indexOf(sock)
    this.socks.splice(index, 1)
  }
  say(text, sock) {
    var msg =
    { 
      text,
      time: Date.now(),
      name: sock.name
    }
    this.messages.shift()
    this.messages.push(msg)
    for (sock of this.socks)
      sock.send('hear', msg)
  }
}
