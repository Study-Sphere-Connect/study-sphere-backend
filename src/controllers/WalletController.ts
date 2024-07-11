import { Request, Response, NextFunction } from "express";
import { prisma } from "../index";
import { AuthenticatedRequest } from "../types"; // Ensure this includes user information
import { UserRole } from "@prisma/client";

const fetchWalletInfo = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(401).json({ error: "User not found!" });
        }

        if (user.role !== UserRole.MENTOR) {
            return res.status(403).json({ error: "User not authorized!" });
        }

        const wallet = await prisma.wallet.findUnique({
            where: {
                userId: user.id,
            },
            select: {
                balance: true,
                currency: true,
            },
        });

        if (!wallet) {
            return res.status(404).json({ error: "Wallet not found!" });
        }

        return res.json(wallet);
    } catch (error) {
        console.error("Database error while fetching wallet info", error);
        return res.status(500).json({ error: "Wallet not found!" });
    }
};

const createWallet = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(401).json({ error: "User not found!" });
        }

        if (user.role !== UserRole.MENTEE && user.role !== UserRole.MENTOR) {
            return res.status(403).json({ error: "User not authorized!" });
        }

        let wallet = await prisma.wallet.findUnique({
            where: {
                userId: user.id,
            },
            select: {
                balance: true,
                currency: true,
            },
        });

        if (wallet) {
            return res.json(wallet);
        }

        wallet = await prisma.wallet.create({
            data: {
                userId: user.id,
            },
            select: {
                balance: true,
                currency: true,
            },
        });

        if (!wallet) {
            return res.status(500).json({ error: "Something went wrong!" });
        }

        return res.json(wallet);
    } catch (error) {
        console.error("Error creating wallet", error);
        return res.status(500).json({ error: "Something went wrong!" });
    }
};

export default { createWallet, fetchWalletInfo };
