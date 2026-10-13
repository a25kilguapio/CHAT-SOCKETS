const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
  socket.on('chat:send', (data) => {
    const name = (data.name || '').trim();
    const text = (data.text || '').trim();

    if (name.length === 0 || name.length > 20) return;
    if (text.length === 0 || text.length > 500) return;

    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    io.emit('chat:message', {
      name: name,
      text: text,
      time: hours + ':' + minutes
    });
  });
});

server.listen(3000, () => {
  console.log('Servidor en marxa a http://localhost:3000');
});
