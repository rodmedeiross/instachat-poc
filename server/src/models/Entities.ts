import {
  Column,
  Entity,
  OneToMany,
  ManyToMany,
  ManyToOne,
  JoinTable,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  userName: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  avatar?: string;

  @ManyToMany(() => Chat, (c) => c.users)
  chats: Chat[];

  @OneToMany(() => ChatMessage, (c) => c.fromUser)
  messages: ChatMessage[];
}

@Entity("chats")
export class Chat {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToMany(() => User)
  @JoinTable("chatUser")
  users: User[];

  @OneToMany(() => ChatMessage, (m) => m.chat)
  messages: ChatMessage[];

  @Column()
  title: string;

  @Column({ nullable: true })
  lastMessage?: string;
}

@Entity("chatMessages")
export class ChatMessage {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Chat, (c) => c.messages)
  chat: Chat;

  @Column()
  timestamp: number;

  @Column()
  text: string;

  @ManyToOne(() => User, (c) => c.messages)
  fromUser: User;
}

// @Entity("chatUser")
// export class ChatUser {

//   @Column()
//   userId: string;

//   @Column()
//   chatId: string;
// }
