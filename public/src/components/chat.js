import _ from '../../lib/utils'
import App from '../app'
let d = React.DOM

export default React.createClass({
  getInitialState() {
    return {
      messages: []
    }
  },
  componentDidMount() {
    this.refs.entry.getDOMNode().focus()
    App.on('hear', this.hear)
    App.on('chat', messages => this.setState({ messages }))
    App.on('secret', this.scout)
    App.on('error', this.handleError)
  },
  componentWillUnmount() {
    App.off('hear')
    App.off('chat')
    App.off('secret')
    App.off('error')
  },
  render() {
    // must be mounted to receive messages
    return d.div({ className: `chat-container ${App.state.chat ? '' : 'chat-container-hidden'}` },
      d.div({ className: 'chat' },
        d.div({ className: 'messages', ref: 'messages'},
          this.state.messages.map(this.Message)),
        this.Entry()))
  },

  handleError(data){
    console.log('Error', data)
  },
  hear(msg) {
    this.state.messages.push(msg)
    this.forceUpdate(this.scrollChat)
  },
  scout(){
    document.getElementById('scout').play()
  },
  scrollChat() {
    let el = this.refs.messages.getDOMNode()
    el.scrollTop = el.scrollHeight
  },
  Message(msg) {
    if (!msg)
      return

    let {time, name, text} = msg
    let url = null;
    if (msg.url) url = msg.url;
    let date = new Date(time)
    let hours   = _.pad(2, '0', date.getHours())
    let minutes = _.pad(2, '0', date.getMinutes())
    time = `${hours}:${minutes}`

    return d.div({},
      d.time({}, time),
      ' ',
      d.span({ className: 'name' }, name),
      ' ',
      text, 
      url ? d.img({src:`${url}`, alt:`${url}`}) : null)
  },

  Entry() {
    return d.input({
      className: 'chat-input',
      type: 'text',
      ref: 'entry',
      onKeyDown: this.key,
      placeholder: '/nick name'
    })
  },

  key(e) {
    if (e.key !== 'Enter')
      return

    let el = e.target
    let text = el.value.trim()
    el.value = ''

    if (!text)
      return

    if (text[0] === '/')
      this.command(text.slice(1))
    else
      App.send('say', text)
  },

  command(raw) {
    let [, command, arg] = raw.match(/(\w*)\s*(.*)/)
    arg = arg.trim()
    let text

    switch(command) {
      case 'name':
      case 'nick':
        let name = arg.slice(0, 15)

        if (!name) {
          text = 'enter a name'
          break
        }

        text = `hello, ${name}`
        App.save('name', name)
        App.send('name', name)
        break
      case 'scout':
        text = 'You go scouting!'
        App.send('scout', text)
        break
      case 'display':
        text = 'ventifact bottle'
        App.send('lookup', text)
        break
      default:
        text = `unsupported command: ${command}`
    }

    this.state.messages.push({ text,
      time: Date.now(),
      name: ''
    })
    this.forceUpdate(this.scrollChat)
  }
})
