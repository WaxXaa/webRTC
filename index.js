const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: 'https://waxxaa.github.io',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true
  }
});

const port = 3000;

app.use(cors({
  origin: 'https://waxxaa.github.io',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.get('/', (req, res) => {
  res.send('Servidor de videoconferencia');
});

io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');

  // Manejar la oferta de video
  socket.on('video-offer', (message) => {
    console.log('Oferta de video recibida:', message);
    socket.broadcast.emit('video-offer', message);
  });

  // Manejar la respuesta de video
  socket.on('video-answer', (message) => {
    console.log('Respuesta de video recibida:', message);
    socket.broadcast.emit('video-answer', message);
  });

  // Manejar los candidatos ICE
  socket.on('ice-candidate', (message) => {
    console.log('Candidato ICE recibido:', message);
    socket.broadcast.emit('ice-candidate', message);
  });

  // Manejar la desconexión del cliente
  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

server.listen(port, () => {
  console.log(`Servidor escuchando en puerto ${port}`);
});