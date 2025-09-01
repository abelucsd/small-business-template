// TODO: service and repository layer.

import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../users/model.js";
import { signToken, setAuthCookie } from "./jwt.js";
import * as userService from '../users/service.js';
import * as loginService from './service.js';

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let { firstname, lastname, email, password, role } = req.body;
    const exists = await User.findOne({ email });
    if (exists) {
      res.status(409).json({ message: "Email already in use" });
      return;
    }

    role = role === "admin" ? "admin" : "user";    
    
    const user = await userService.createUser({ firstname, lastname, email, password, role });
    const token = signToken({ sub: user.id, role: user.role as "user" | "admin" });
    setAuthCookie(res, token);
    res.status(201).json({ id: user.id, email: user.email, role: user.role });
  } catch (error) {
    next(error);
  }  
}

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;
    const {user, token} = await loginService.login(email, password);
    setAuthCookie(res, token);
    res.json({ id: user.id, email: user.email, role: user.role });
  } catch (error) {
    next(error);
  }
}

export const logout = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
    res.status(204).send();
  } catch (error) {
    next(error);
  }  
}