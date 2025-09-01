import { JWTPayload } from "./auth.js";

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}