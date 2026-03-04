const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server: SocketIOServer } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 8083;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

let io;

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handler(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  // Initialiser Socket.io
  io = new SocketIOServer(server, {
    cors: {
      origin: dev ? 'http://localhost:8083' : false,
      methods: ['GET', 'POST'],
    },
    transports: ['websocket', 'polling'],
  });

  io.on('connection', (socket) => {
    console.log(`🔌 Client connecté: ${socket.id}`);

    // Rejoindre la room des ravitaillements
    socket.join('ravitaillements');
    
    socket.on('disconnect', () => {
      console.log(`🔌 Client déconnecté: ${socket.id}`);
    });

    socket.on('join-room', (room) => {
      socket.join(room);
      console.log(`📡 Client ${socket.id} a rejoint la room: ${room}`);
    });

    socket.on('leave-room', (room) => {
      socket.leave(room);
      console.log(`📡 Client ${socket.id} a quitté la room: ${room}`);
    });
  });

  // Rendre io accessible globalement
  global.io = io;

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`🚀 Serveur prêt sur http://${hostname}:${port}`);
    console.log('🔌 Socket.io initialisé');
  });
});

// Fonctions utilitaires pour émettre des événements
const emitRavitaillementCreated = (ravitaillement) => {
  if (global.io) {
    global.io.to('ravitaillements').emit('ravitaillement:created', ravitaillement);
    console.log('📡 Émission: ravitaillement:created', ravitaillement.id);
  }
};

const emitRavitaillementUpdated = (ravitaillement) => {
  if (global.io) {
    global.io.to('ravitaillements').emit('ravitaillement:updated', ravitaillement);
    console.log('📡 Émission: ravitaillement:updated', ravitaillement.id);
  }
};

const emitRavitaillementDeleted = (ravitaillementId) => {
  if (global.io) {
    global.io.to('ravitaillements').emit('ravitaillement:deleted', { id: ravitaillementId });
    console.log('📡 Émission: ravitaillement:deleted', ravitaillementId);
  }
};

module.exports = {
  emitRavitaillementCreated,
  emitRavitaillementUpdated,
  emitRavitaillementDeleted,
};
