
import { Request, Response } from "express";
import { prisma } from "../index";
import { AuthenticatedRequest } from "../types";

const getMessages = async (req: Request, res: Response) => {
    const conversationId = req.params.id
    try {
        const messages = await prisma.message.findMany(
            {
                where: {
                    id: conversationId
                }
            }
        );
        res.json(messages);
    }
    catch (error: any) {
        throw new Error(error.message);
    }
}

const createMessage = async (req: AuthenticatedRequest, res: Response) => {
    try {
        //   const Pusher = require("pusher");
        // const user = req.user;
        const user = {id:"clsw0qelu0000i6nx9s8cygje"};
        const { conversationId, senderId, content } = req.body;
        if (user?.id !== senderId) {
            return { error: "User not authorized!" }
        }

        //   const dummyMessage = {
        //     id:Math.random().toString(36).substring(2),
        //     conversationId: values.conversationId,
        //     content: values.content,
        //     senderId: values.senderId,
        //   }
        //   pusherServer.trigger(dummyMessage.conversationId, "chat", {
        //     message: `${JSON.stringify(dummyMessage)}\n\n`
        //   });

        // creating new message in the database
        const newMessage = await prisma.message.create({
            data: {
                content: content,
                senderId: senderId,
                conversationId: conversationId
            }
        });

        // updating last message of the conversation
        const updateLastMessage = await prisma.conversation.update({
            where: {
                id: conversationId,
            },
            data: {
                lastMessage: newMessage.content,
            }
        })


        res.json(newMessage);
    }
    catch (error: any) {
        throw new Error(error.message);
    }
};

export default {
    getMessages,
    createMessage
}