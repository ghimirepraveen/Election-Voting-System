import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const verifyRole = (roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        throw new Error("Not authorized");
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        id: string;
        role: string;
      };
      if (!roles.includes(decoded.role)) {
        throw new Error("Not authorized");
      }

      req.body.user = decoded;

      next();
    } catch (error) {
      res.status(401).json({ error: "Not authorized" });
    }
  };
};

export { verifyRole };
