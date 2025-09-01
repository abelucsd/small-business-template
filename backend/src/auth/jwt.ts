import jwt from "jsonwebtoken";
import type { Response } from "express";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = "1h"; // adjust

export type JWTPayload = { sub: string; role: "user" | "admin" };

export function signToken(payload: JWTPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function setAuthCookie(res: Response, token: string) {
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 1000 * 60 * 60, // 1h
  });
}
