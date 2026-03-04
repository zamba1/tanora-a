// Gestionnaire SSE centralisé
class SSEManager {
  private static instance: SSEManager;
  private connections = new Set<ReadableStreamDefaultController>();

  private constructor() {}

  static getInstance(): SSEManager {
    if (!SSEManager.instance) {
      SSEManager.instance = new SSEManager();
    }
    return SSEManager.instance;
  }

  addConnection(controller: ReadableStreamDefaultController): void {
    this.connections.add(controller);
    console.log(`📡 Nouvelle connexion SSE. Total: ${this.connections.size}`);
  }

  removeConnection(controller: ReadableStreamDefaultController): void {
    this.connections.delete(controller);
    console.log(`📡 Connexion SSE fermée. Total: ${this.connections.size}`);
  }

  broadcast(event: string, data: any): void {
    const message = `data: ${JSON.stringify({ 
      type: event, 
      data, 
      timestamp: new Date().toISOString() 
    })}\n\n`;
    
    // Envoyer à toutes les connexions actives
    const deadConnections: ReadableStreamDefaultController[] = [];
    
    this.connections.forEach((controller) => {
      try {
        controller.enqueue(message);
      } catch (error) {
        // Marquer les connexions fermées pour suppression
        deadConnections.push(controller);
      }
    });

    // Nettoyer les connexions fermées
    deadConnections.forEach(controller => {
      this.connections.delete(controller);
    });

    if (deadConnections.length > 0) {
      console.log(`📡 ${deadConnections.length} connexion(s) SSE fermée(s) nettoyée(s)`);
    }

    console.log(`📡 Message SSE diffusé à ${this.connections.size} client(s): ${event}`);
  }

  getConnectionCount(): number {
    return this.connections.size;
  }
}

export const sseManager = SSEManager.getInstance();

// Fonction utilitaire pour diffuser des événements
export function broadcastToSSE(event: string, data: any): void {
  sseManager.broadcast(event, data);
}
