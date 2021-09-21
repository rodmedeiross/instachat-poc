export interface User {
  id: string;
  name: string;
  status: string;
  sendMessages?: Message[];
  receivedMessages?: Message[];
  picture?: string;
}

export interface Chat {
  id: string;
  title: string;
  lastMessage?: string;
  messages: any[];
  avatar?: string;
  userToChats: any[];
}

export interface Message {
  timestamp: string;
  text: string;
}

export type Status = "online" | "offline";
