export interface JWTPayload {
  id: string;
  email: string;
  role: "user" | "admin";
  iat?: number;
  exp?: number;
}
