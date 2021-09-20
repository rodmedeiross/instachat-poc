import { getRepository } from "typeorm";
import { hash } from "bcryptjs";
import AppError from "../errors/AppError";
import User from "../models/User";

interface Request {
  name: string;
  username: string;
  password: string;
}

class CreateUserService {
  public async execute({ name, username, password }: Request): Promise<User> {
    const usersRepository = getRepository(User);

    const checkUserExists = await usersRepository.findOne({
      where: { username },
    });

    if (checkUserExists) {
      throw new AppError("User name already exists");
    }

    const hashedPassword = await hash(password, 8);

    const user = usersRepository.create({
      name,
      username,
      password: hashedPassword,
    });

    await usersRepository.save(user);

    return user;
  }
}

export default CreateUserService;
