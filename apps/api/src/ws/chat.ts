import { ConversationModel } from "@/models/conversation";
import { MessageModel } from "@/models/message";

interface ChatClients {
  [conversationId: string]: Set<WebSocket>;
}

const chatClients: ChatClients = {};

export function setupChatWebSocket(server: any) {
  server.route({
    method: "GET",
    url: "/ws/chat",
    handler: async (request: any, reply: any) => {
      if (request.headers.upgrade !== "websocket") {
        return reply.status(400).send("Expected WebSocket");
      }

      const [socket, client] = Object.values(server.websocket) as any;

      const conversationId = request.query.conversationId as string;

      if (conversationId) {
        if (!chatClients[conversationId]) {
          chatClients[conversationId] = new Set();
        }
        chatClients[conversationId].add(socket);

        socket.on("close", () => {
          chatClients[conversationId]?.delete(socket);
        });
      }

      socket.on("message", async (data: any) => {
        try {
          const message = JSON.parse(data.toString());

          if (message.type === "init") {
            const { email, name } = message.payload;

            let conversation = await ConversationModel.findOne({ clientEmail: email });

            if (!conversation) {
              conversation = await ConversationModel.create({
                clientEmail: email,
                clientName: name,
                status: "active",
              });
            }

            socket.send(
              JSON.stringify({
                type: "init",
                payload: { conversationId: conversation._id.toString() },
              }),
            );

            if (!chatClients[conversation._id.toString()]) {
              chatClients[conversation._id.toString()] = new Set();
            }
            chatClients[conversation._id.toString()].add(socket);
          }

          if (message.type === "message") {
            const { conversationId: convId, text, imageUrl } = message.payload;

            const newMessage = await MessageModel.create({
              conversationId: convId,
              sender: "client",
              text,
              imageUrl,
              timestamp: new Date(),
            });

            await ConversationModel.findByIdAndUpdate(convId, {
              lastMessageAt: new Date(),
            });

            const broadcastMessage = {
              type: "message",
              payload: {
                _id: newMessage._id.toString(),
                conversationId: convId,
                sender: "client",
                text,
                imageUrl,
                timestamp: newMessage.timestamp.toISOString(),
              },
            };

            chatClients[convId]?.forEach((client) => {
              client.send(JSON.stringify(broadcastMessage));
            });

            const adminClients = chatClients["admin"];
            adminClients?.forEach((client) => {
              client.send(JSON.stringify(broadcastMessage));
            });
          }
        } catch (error) {
          console.error("WebSocket message error:", error);
        }
      });

      return { status: "ok" };
    },
  });
}

export function broadcastToConversation(conversationId: string, message: any) {
  chatClients[conversationId]?.forEach((client) => {
    client.send(JSON.stringify(message));
  });
}

export function broadcastToAdmin(message: any) {
  chatClients["admin"]?.forEach((client) => {
    client.send(JSON.stringify(message));
  });
}
