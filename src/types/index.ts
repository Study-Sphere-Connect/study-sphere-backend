import { Request } from "express";

export interface AuthenticatedRequest extends Request {
    user?: User;
}

export interface User {
    id: string;
    name: string | null;
    email: string | null;
    emailVerified: Date | null;
    image: string | null;
    bio: string | null;
    role: UserRole;
    isTwoFactorEnabled: boolean;
}

enum UserRole {
    MENTOR = "MENTOR",
    MENTEE = "MENTEE",
    ADMIN = "ADMIN"
}