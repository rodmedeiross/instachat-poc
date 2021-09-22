import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import { AvatarGenerator } from "random-avatar-generator";
const generator = new AvatarGenerator();
import { Connection } from "typeorm";

const { createToken, checkToken } = require("../utils/token");
// Local Imports
import {User} from "../models/Entities";
import {NextFunction, Request, Response} from "express";

export function getUserController(connection: Connection) {
  const userRepository = connection.getRepository(User);

  const findUserWithEmail = async (email) => {
    try {
      return (await userRepository.find({ where: { email } }))[0];
    } catch (error) {
      return null;
    }
  };

  const login = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    // Input validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json({ message: "Access denied, invalid Entries.", access: false });
      return next();
    }

    // Find User with email
    const user = await findUserWithEmail(email);
    if (!user) {
      res.json({ message: "Access denied, incorrect Email.", access: false });
      return next();
    }

    // Decrypt password & Check if password is valid
    const decryptedPassword = await bcrypt.compare(password, user.password);
    if (!decryptedPassword) {
      res.json({ message: "Access denied, incorrect Password.", access: false });
      return next();
    }

    // Create token
    let token = await createToken(user.id);

    // Send response
    res.json({
      message: "[USER][LOGIN] Access granted.",
      access: true,
      user: { id: user.id, email: user.email, image: user.image, token },
    });
  };

  const signup = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, name } = req.body;
    const defaultImage = generator.generateRandomAvatar();

    // Input validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json({ message: "Access denied, invalid Entries.", access: false });
      return next();
    }

    // Check if user with this email already exists
    const existingUser = await findUserWithEmail(email);
    if (existingUser) {
      res.json({ message: "Access denied, email already used.", access: false });
      return next();
    }
    // Encrypt password
    const hashedPassword = await bcrypt.hash(password, 8);

    // Create new user.
    const newUser = await userRepository.create({
      email,
      password: hashedPassword,
      name,
      image: defaultImage,
    });

    try {
      await userRepository.save(newUser);
    } catch (error) {
      return next(
          new Error("[ERROR][USERS] Could not save user in DB: " + error)
      );
    }


    console.log('asdadadsad' + newUser.id);
    
    // Create token
    let token = await createToken(newUser.id);


    // Send response
    res.json({
      message: "[USER][SIGNUP] Access granted.",
      access: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        image: newUser.image,
        token,
      },
    });
  };

  const guest = async (req, res, next) => {
    const randomUsername = `Guest${Math.floor(Math.random() * 99999) + 1}`;
    const defaultImage = generator.generateRandomAvatar();

    // Create Guest
    const newGuest = await userRepository.create({ name: randomUsername, image: defaultImage });
    try {
      await userRepository.save(newGuest);
    } catch (error) {
      return next(
          new Error("[ERROR][USERS] Could not save guest in DB: " + error)
      );
    }

    // Send response
    res.json({
      message: "[USER][GUEST] Access granted.",
      access: true,
      user: {
        id: newGuest.id,
        name: newGuest.name,
        image: newGuest.image,
      },
    });
  };

  const verify = async (req, res, next) => {
    const { id, token } = req.body;

    // Find user with id
    let user;
    try {
      user = await userRepository.findOne(id);
    } catch (error) {
      return next(
          new Error("[ERROR][USERS] Could not find user by id: " + error)
      );
    }

    // Verify Token
    const tokenIsValid = await checkToken(id, token);
    if (!tokenIsValid) {
      res.json({
        message: "[USER][VERIFY] Access denied, invalid token.",
        access: false,
      });
      return next();
    }

    // Send response
    res.json({
      message: "[USER][LOGIN] Access granted.",
      access: true,
      user: { id: user.id, name: user.name, image: user.image, token },
    });
  };

  const edit = async (req, res, next) => {
    const { id, name, image } = req.body;

    // Input validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new Error("[ERROR][USERS] Edit invalid entries: " + errors));
    }

    // Find user by id
    let user;
    try {
      user = await userRepository.findOne(id);
    } catch (error) {
      return next(
          new Error("[ERROR][USERS] Could not find user by id: " + error)
      );
    }

    user.name = name;
    user.image = image;

    // Save changes
    try {
      await user.save();
    } catch (error) {
      return next(
          new Error("[ERROR][USERS] Could not save user update: " + error)
      );
    }

    // Send response
    res.json({
      message: "[USER][EDIT] User updated.",
      access: true,
      user: { name: user.name, image: user.image },
    });
  };

  return {
    login, signup, edit, guest, verify
  };
}
