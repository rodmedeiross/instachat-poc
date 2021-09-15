export interface User {
  name: string;
  status: Status;
  picture: string;
  lastMessage?: string;
  newMessagesCount?: number;
}

export type Status = "online" | "offline";
