const {EventEmitter} = require('events')
const http = require('http')

class MyWebsocket extends EventEmitter {
  constructor(options){
    super(options)
    
    const server = http.createServer()
    server.listen(options.port || 8000)

    server.on('upgrade',(req,socket)=>{})
  }

}
