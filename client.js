var ws = new WebSocket('ws://localhost:3000/'); 

ws.onerror = function (error) {  console.log('bye',error) } 
ws.onclose = function () { console.log('bye') } 

ws.onopen = function () { 
  ws.send("Connection established. Hello server!"); 
}

ws.onmessage = function(msg) { 
console.log('msg',msg)
  if(msg.data instanceof Blob) { 
    processBlob(msg.data);
  } else {
    processText(msg.data);
  }
}
