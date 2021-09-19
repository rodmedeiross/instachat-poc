export interface User {
  id: string;
  name: string;
  status: string;
  sendMessages?: Message[];
  receivedMessages?: Message[];
  picture?: string;
}

export interface Message {
  date: string;
  message: string;
}

export type Status = "online" | "offline";
