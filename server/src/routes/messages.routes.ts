import { Router } from "express";
const messageRouter = Router();

export interface Chat {
  id: string;
  user1: string;
  user2: string;
  messages: Message[];
}

interface Message {
  timestamp: Number;
  text: string;
  from: string;
  to: string;
}

interface User {
  id: string;
  name: string;
}

const users: User[] = [
  { id: "61492917ad6f5a68ca26e2cf", name: "Rodrigo" },
  { id: "6149291fb19dad1f1969630c", name: "Fernando" },
  { id: "614929239b44840ffb29ec46", name: "Livia" },
];

const chats: Chat[] = [
  {
    id: "6149293de6111efb28fb8a6a",
    user1: "61492917ad6f5a68ca26e2cf",
    user2: "614929239b44840ffb29ec46",
    messages: [
      {
        text: "ola",
        timestamp: Date.now(),
        from: "61492917ad6f5a68ca26e2cf",
        to: "614929239b44840ffb29ec46",
      },
      {
        text: "como vai",
        timestamp: Date.now(),
        from: "61492917ad6f5a68ca26e2cf",
        to: "614929239b44840ffb29ec46",
      },
    ],
  },
];

messageRouter.get("/users/:userId/chats", (req, res) => {
  const userId = req.params.userId;
  res.json(
    chats
      .filter((x) => x.user1 == userId || x.user2 == userId)
      .map((x) => ({ ...x, messages: undefined }))
  );
});

messageRouter.get("/users/:userId/chats/:chatId", (req, res) => {
  const userId = req.params.userId;
  const chatId = req.params.chatId;
  res.json(chats.find((x) => x.id == chatId));
});

messageRouter.put("/users/:userId/chats/:chatId", (req, res) => {
  const { userId, chatId } = req.params;
  const chat = chats.find((x) => x.id == chatId);
  const { message } = req.body;
  const { user1, user2 } = chat || {};
  const to = userId == user1 ? user2 : user1;
  chat?.messages.push({
    ...message,
    timestamp: Date.now(),
    from: userId,
    to: to,
  });
});

// messageRouter.post("/", async (request, response) => {
//   const { fromUserId, toUserId, message } = request.body;

//   if (!message) {
//     return {
//       error: "Message not found",
//     };
//   }
//   const newMessageContent = {
//     currentMessage: message,
//     from: fromUserId,
//     to: toUserId,
//   };

//   return chatMessages.push(newMessageContent), console.log(chatMessages);
// });

// messageRouter.get("/", async (request, response) => {
//   return response.json(chatMessages);
// });

export default messageRouter;
