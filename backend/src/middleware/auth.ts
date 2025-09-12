import type { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { JwtPayload, VerifyErrors } from "jsonwebtoken";
import type { JWTPayload } from "../shared/types/auth.js";

const JWT_SECRET = process.env.JWT_SECRET!;

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.jwt;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, JWT_SECRET, (err: VerifyErrors | null, decoded: JwtPayload | string | undefined) => {
    if (err) {
      const name = (err as VerifyErrors)?.name;
      const msg = name === "TokenExpiredError" ? "Session expired" : "Invalid token";
      return res.status(401).json({ message: msg });
    }
    req.user = decoded as JWTPayload;
    next();
  });
};

export function isAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.user?.role === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Forbidden"});
};
