// authController.js
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { findUserByUsername } from "../models/authmodel.js";

export const login = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const user = await findUserByUsername(username);
    // console.log("Fetched user:", user);
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    const hash = user.password.replace(/^\$2y\$/, "$2b$");

    const isPasswordValid = await bcrypt.compare(password, hash);
    // console.log("Entered password:", isPasswordValid);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        usertype: user.usertype,
        username: username,
        name: user.name
      
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    // Exclude password from response
    const { password: _, ...userWithoutPassword } = user;

    return res.status(200).json({ token, user: userWithoutPassword });
  } catch (error) {
    next(error);
  }
};
