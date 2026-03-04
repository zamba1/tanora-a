import type { Server as HTTPServer } from 'http';

import { Server as SocketIOServer } from 'socket.io';

let io: SocketIOServer | null = null;

export const initializeSocketServer = (server: HTTPServer) => {
  if (io) {
    return io;
  }

  io = new SocketIOServer(server, {
    cors: {
      origin: process.env.NODE_ENV === 'development' ? 'http://localhost:8083' : false,
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

    // Gérer les événements personnalisés si nécessaire
    socket.on('join-room', (room: string) => {
      socket.join(room);
      console.log(`📡 Client ${socket.id} a rejoint la room: ${room}`);
    });

    socket.on('leave-room', (room: string) => {
      socket.leave(room);
      console.log(`📡 Client ${socket.id} a quitté la room: ${room}`);
    });
  });

  return io;
};

export const getSocketServer = (): SocketIOServer | null => io;

// Fonctions utilitaires pour émettre des événements
export const emitRavitaillementCreated = (ravitaillement: any) => {
  if (io) {
    io.to('ravitaillements').emit('ravitaillement:created', ravitaillement);
    console.log('📡 Émission: ravitaillement:created', ravitaillement.id);
  }
};

export const emitRavitaillementUpdated = (ravitaillement: any) => {
  if (io) {
    io.to('ravitaillements').emit('ravitaillement:updated', ravitaillement);
    console.log('📡 Émission: ravitaillement:updated', ravitaillement.id);
  }
};

export const emitRavitaillementDeleted = (ravitaillementId: number) => {
  if (io) {
    io.to('ravitaillements').emit('ravitaillement:deleted', { id: ravitaillementId });
    console.log('📡 Émission: ravitaillement:deleted', ravitaillementId);
  }
};
