import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import Contact from "./Contact";

@Entity("users")
class User {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column()
  name?: string;

  @Column()
  userName?: string;

  @Column()
  password?: string;

  @Column()
  avatar?: string;

  @Column()
  contacts?: Contact[];
}

export default User;
