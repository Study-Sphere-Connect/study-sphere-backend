import { Request, Response } from "express";
import { prisma } from "../index";
import { AuthenticatedRequest } from "../types";

const getConversations = async (req: AuthenticatedRequest, res: Response) => {
    try {
        // const user = req.user;
        const user = {id:"clsw0qelu0000i6nx9s8cygje"};
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
                },
                messages: {
                    select: {
                        content: true,
                        id: true,
                        senderId: true,
                        conversationId: true,
                        createdAt: true
                    },
                    orderBy: {
                        createdAt: 'asc',
                    },
                }
            },
        });
        res.json(conversations);
    }
    catch (error: any) {
        throw new Error(error.message);
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