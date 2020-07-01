const nanoexpress = require('nanoexpress-pro/cjs')

const app = nanoexpress();

app.ws('/*', (req, ws) => {
  console.log('Connected');

  ws.on('message', (message) => {
    console.log('Message received', message);
  });
});

app.listen(4000);