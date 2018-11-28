const talk = require('./util/talk')
const http = require('http')
const WebSocketServer = require('websocket').server

const httpServer = http.createServer((request, response) => {
  console.log('[' + new Date + '] Received request for ' + request.url)
  response.writeHead(404)
  response.end()
})

const wsServer = new WebSocketServer({
  httpServer,
  autoAcceptConnections: true
})

wsServer.on('connect', connection => {
  connection.on('message', message => {
    console.log('message',message)
    if (message.type === 'utf8') {
      console.log('message.utf8Data:' + message.utf8Data)
      connection.sendUTF('reply:' + message.utf8Data)
    }
    if (message.type === 'binary') { //二进制Buffer
      console.log('message.binaryData:~~')
      // talk.write('tmp/aaa.mp3',message.binaryData).then(filename=>{
      //   connection.sendUTF('reply:~~'+filename);
      // });
      talk.mp3buf('tmp/aaa.mp3',message.binaryData).then(filename=>{
        connection.sendUTF('reply:~~'+filename);
      });
    }
  }).on('close', (reasonCode, description) => {
    console.log('Client Peer ' + connection.remoteAddress + ' disconnected.')
  })
})

httpServer.listen(8888, () => {
  console.log('Serveris listening on port 8888')
})