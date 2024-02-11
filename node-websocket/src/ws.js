const { EventEmitter } = require('events')
const http = require('http')
const { hashKey,handleMask } = require('./utils')

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
        this.processData(data)
        this.emit('data')
      })

      socket.on('close',(error)=>{
        this.emit('close')
      })
    })
  }

  processData(data){
    const byte1 = bufferData.readUInt8(0)
    let opcode = byte1 & 0x0f

    const byte2 = bufferData.readUInt8(1)
    const str2 = byte2.toString(2)
    const MASK  = str2[0]

    let curByteIndex = 2 

    let payloadLength = parseInt(str2.substring(1),2)

    if(payloadLength === 126){
      payloadLength = bufferData.readUInt16BE(2)
      curByteIndex += 2
    }else if(payloadLength === 127){
      payloadLength = bufferData.readBigUint64BE(2)
      curByteIndex += 8
    }

    let realData = null

    if(MASK){
      const maskKey = bufferData.slice(curByteIndex,curByteIndex + 4)
      curByteIndex += 4
      const payloadData = bufferData.slice(curByteIndex, curByteIndex + payloadLength)
      realData = handleMask(maskKey,payloadData)
    }

    this.handleRealData(opcode,realData)

  }
  
  handleRealData(opcode, realDataBuffer) {
      switch (opcode) {
        case OPCODES.TEXT:
          this.emit('data', realDataBuffer.toString('utf8'));
          break;
        case OPCODES.BINARY:
          this.emit('data', realDataBuffer);
          break;
        default:
          this.emit('close');
          break;
     }
  } 
}

module.exports = MyWebsocket
