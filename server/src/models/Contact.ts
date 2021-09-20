import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("contact")
class Contact {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column()
  name?: string;

  @Column()
  avatar?: string;
}

export default Contact;
