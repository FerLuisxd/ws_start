const uWS = require('uWebSockets.js');
const port = 9001;
let socketList = {}
const app = uWS./*SSL*/App({
  // key_file_name: 'misc/key.pem',
  // cert_file_name: 'misc/cert.pem',
  // passphrase: '1234'
})


app.ws('/*', {
  compression: uWS.SHARED_COMPRESSOR,
  maxPayloadLength: 16 * 1024 * 1024,
  idleTimeout: 0,
  open: (ws) => {
    console.log('A WebSocket connected!');
    ws.id = Math.random()
    socketList[ws.id] = ws
  },
  message: (ws, message, isBinary) => {
    /* Ok is false if backpressure was built up, wait for drain */

    // console.log(ws,message,isBinary)
    var arr = new Uint8Array(message);
    var str = String.fromCharCode.apply(String, arr);
    let obj = JSON.parse(str)
    switch (obj.method) {
      case 'chat':
        chatNewMessage(ws, obj)
        break;
      case 'new':
        addUser(ws, obj)
        break;
      case 'chatt':
        break;
      case 'chattt':
        break;
    }
  },
  drain: (ws) => {
    console.log('WebSocket backpressure: ' + ws.getBufferedAmount());
  },
  close: (ws, code, message) => {
    delete socketList[ws.id]
    console.log('WebSocket closed');
  }
})

app.any('/*', (res, req) => {
  res.end('Nothing to see here!');
})

app.listen(port, (token) => {
  if (token) {
    console.log('Listening to port ' + port);
  } else {
    console.log('Failed to listen to port ' + port);
  }
});

function sendToEveryone(msg) {
  for (let i in socketList) {
    let socket = socketList[i]
    if (socket.id)
      socket.send(msg)
  }
}
setInterval(() => {
  let messages = []
  for (let i in socketList) {
    let socket = socketList[i]
    if (socket.lastMessage)
      messages.push(socket.lastMessage)
  }
  console.log(messages, socketList)
}, 2000)

function chatNewMessage(ws, obj) {
  socketList[ws.id].lastMessage = obj.message
  let string = JSON.stringify({ message: obj.message, user: ws.id })
  // let ok = ws.send(, isBinary);
  sendToEveryone(string)
}
function addUser(ws, obj) {
  console.log('new user added?')
  delete socketList[ws.id]
  ws.id = obj.user
  socketList[ws.id] = ws
}