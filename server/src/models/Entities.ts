import {
  Column,
  Entity,
  OneToMany,
  ManyToMany,
  ManyToOne,
  JoinTable,
  PrimaryGeneratedColumn, JoinColumn,
} from "typeorm";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  image?: string;

  @OneToMany(() => UserToChat, (c) => c.user)
  userToChats: UserToChat[];

  @OneToMany(() => ChatMessage, (c) => c.fromUser)
  messages: ChatMessage[];
}

@Entity("chats")
export class Chat {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @OneToMany(() => UserToChat, (c) => c.chat)
  userToChats: UserToChat[];

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

  @Column()
  chatId: string;

  @ManyToOne(() => Chat, (c) => c.messages)
  @JoinColumn({name : 'chatId', referencedColumnName: 'id'})
  chat: Chat;

  @Column({ nullable: true })
  timestamp: string;

  @Column()
  text: string;

  @Column()
  fromUserId: string;

  @ManyToOne(() => User, (c) => c.messages)
  @JoinColumn({name : 'fromUserId', referencedColumnName: 'id'})
  fromUser: User;
}

// @Entity("chatUser")
// export class ChatUser {

//   @Column()
//   userId: string;

//   @Column()
//   chatId: string;
// }

@Entity("user_to_chat_id")
export class UserToChat {
  @PrimaryGeneratedColumn("uuid")
  public userToChatId!: string;

  @Column()
  public chatId!: string;

  @ManyToOne(() => Chat, (c) => c.userToChats)
  public chat!: Chat;

  @Column()
  public userId!: string;

  @ManyToOne(() => User, (u) => u.userToChats)
  public user!: User;
}
