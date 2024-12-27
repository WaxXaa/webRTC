const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: 'https://waxxaa.github.io', // Reemplaza con tu origen
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true
  }
});

const port = 3000;

// Middleware CORS
app.use(cors({
  origin: 'https://waxxaa.github.io',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.get('/', (req, res) => {
  res.send('Servidor de videoconferencia');
});

io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado:', socket.id);

  // Notificar a los demás usuarios que un nuevo usuario se ha conectado
  socket.broadcast.emit('user-connected', socket.id);

  // Manejar la oferta de video
  socket.on('video-offer', (message) => {
    console.log('Oferta de video recibida de:', socket.id);
    socket.to(message.to).emit('video-offer', {
      sdp: message.sdp,
      from: socket.id
    });
  });

  // Manejar la respuesta de video
  socket.on('video-answer', (message) => {
    console.log('Respuesta de video recibida de:', socket.id);
    socket.to(message.to).emit('video-answer', {
      sdp: message.sdp,
      from: socket.id
    });
  });

  // Manejar los candidatos ICE
  socket.on('ice-candidate', (message) => {
    console.log('Candidato ICE recibido de:', socket.id);
    socket.to(message.to).emit('ice-candidate', {
      candidate: message.candidate,
      from: socket.id
    });
  });

  // Manejar la desconexión del cliente
  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
    socket.broadcast.emit('user-disconnected', socket.id);
  });
});

server.listen(port, () => {
  console.log(`Servidor escuchando en puerto ${port}`);
});