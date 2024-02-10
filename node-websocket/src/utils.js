const crypto = require('crypto')

function hashKey(key){
  const sha1 = crypto.createHash('sha1')
  sha1.update(key + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11')
  return sha1.digest('base64')
}

function handleMask(maskBytes,data){
  const payload = Buffer.alloc(data.length)
  for(let i = 0; i < data.length; i++){
    payload[i] = maskBytes[i % 4] ^ data[i]
  }
  return payload
}

module.exports = {
  hashKey,
  handleMask
}
