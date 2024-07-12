import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { AuthenticatedRequest, User } from "../types";

export const authenticateJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization
    if(!authHeader?.startsWith('Bearer ')) {
        res.status(401);
        throw new Error("Cannot Authorize User, No Token")
    };

    const token = authHeader.split(' ')[1];

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

        const user: User = {
            id: decodedToken.id,
            role: decodedToken.role,
            image: decodedToken.image,
            name: decodedToken.name,
            email: decodedToken.email,
            emailVerified: decodedToken.emailVerified,
            bio: decodedToken.bio,
            isTwoFactorEnabled: decodedToken.isTwoFactorEnabled
        };
        
        req.user = user;
        next();
    } catch (error) {
        throw new Error("Invalid token");
    }
};