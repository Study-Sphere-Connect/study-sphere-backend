import { Request, Response } from "express";
import { prisma } from "../index";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from "../types";

const signUp = async (req: Request, res: Response) => {
    const { name, email, password, role } = req.body;

    const saltRounds = 10;

    try {
        const userExists = await prisma.user.findUnique({
            where: {
                email,
            },
        });
        
        if (userExists) {
            throw new Error("User already exists");
        };
        
        const encryptedPassword = await bcrypt.hash(password, saltRounds);

        const user = await prisma.user.create({
        data: {
            name,
            email,
            password: encryptedPassword,
            role
        },
        });
    
        res.status(201).json(user);
    } catch (err: any) {
        throw new Error(err.message);
    }
};

const signIn = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    
    try {
        const user = await prisma.user.findUnique({
        where: {
            email,
        },
        });
    
        if (!user) {
            throw new Error("User not found");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password as string);
        
        if (!isPasswordValid) {
            throw new Error("Invalid Password");
        }

        const { password: userPassword, ...userInfo } = user;

        const token = jwt.sign(userInfo, process.env.JWT_SECRET!);
    
        res.status(200).json(token);
    } catch (err: any) {
        throw new Error(err.message);
    }
};

const getUserInfo = async (req: AuthenticatedRequest, res: Response) => {
    const user = req.user;

    if(!user) {
        throw new Error("User not found");
    }

    res.status(200).json(user);

};

const getUserById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const user = await prisma.user.findUnique({
            where: {
                id: id,
            },
        });

        if (!user) {
            throw new Error("User not found");
        }

        res.status(200).json(user);
    } catch (err: any) {
        throw new Error(err.message);
    }
}

export default {
  signUp,
  signIn,
  getUserInfo,
  getUserById
};


