import { NextFunction, Request, Response } from "express";
import { prisma } from "../index";
import { AuthenticatedRequest } from "../types";

const getConversations = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        if(!user)
            {
                return res.status(401).json({ error: "Unauthorized"})
            }
        console.log(user);
        const conversations = await prisma.conversation.findMany({
            where: {
                OR: [
                    { user_oneId: user?.id },
                    { user_twoId: user?.id },
                ],
            },
            include: {
                user_one: {
                    select: {
                        id: true,
                        image: true,
                        name: true,
                    }
                },
                user_two: {
                    select: {
                        id: true,
                        image: true,
                        name: true,
                    }
                }
            },
        });

        const filteredConversations = conversations.map(conversation => {
            const otherUser = conversation.user_oneId === user.id ? conversation.user_two : conversation.user_one;
            return {
                id: conversation.id,
                lastMessage: conversation.lastMessage,
                status: conversation.status,
                name: otherUser.name,
                profilePhoto: otherUser.image
            };
        });
        console.log(filteredConversations);
        res.json(filteredConversations);
    }
    catch (error: any) {
        next(error);
    }
}


const createConversation = async (req: Request, res: Response) => {
    try {
        const { userOneId, userTwoId } = req.body
        const existingConversation = await prisma.conversation.findFirst({
            where: {
                OR: [
                    { user_oneId: userOneId, user_twoId: userTwoId },
                    { user_oneId: userTwoId, user_twoId: userOneId }
                ]
            }
        });

        if (existingConversation) {
            return existingConversation;
        }

        const conversation = await prisma.conversation.create(
            {
                data: {
                    user_oneId: userOneId,
                    user_twoId: userTwoId,
                    lastMessage: "",
                    status: false
                }
            }
        );
        res.json(conversation);
    }
    catch (error: any) {
        throw new Error(error.message);
    }
}


export default { 
    getConversations,
    createConversation
 };