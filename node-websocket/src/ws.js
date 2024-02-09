const { EventEmitter } = require('events')
const http = require('http')
const { hashKey } = require('./utils')

class MyWebsocket extends EventEmitter {
  constructor(options){
    super(options)
    
    const server = http.createServer()
  
    server.listen(options.port || 8000)

    server.on('upgrade',(req,socket)=>{
      this.socket = socket

      socket.setKeepAlive(true)

      const resHeaders = [
        'HTTP/1.1 101 Switching Protocols',
        'Upgrade: websocket',
        'Connection: Upgrade',
        `Sec-WebSocket-Accept: ${hashKey(req.headers['sec-websocket-key'])}`,
        '',
        ''
      ].join('\r\n')

      socket.write(resHeaders)

      socket.on('data',(data)=>{
        this.emit('data')
      })

      socket.on('close',(error)=>{
        this.emit('close')
      })
    })
  }
}

module.exports = MyWebsocket
