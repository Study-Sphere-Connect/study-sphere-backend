import pusher from "./../pusher/pusher";
import { NextFunction, Request, Response } from "express";
import { prisma } from "../index";
import { AuthenticatedRequest } from "../types";

const getMessages = async (req: Request, res: Response, next:NextFunction) => {
    const conversationId = req.params.id
    console.log(conversationId);
    try {
        const messages = await prisma.message.findMany(
            {
                where: {
                    conversationId: conversationId
                }
            }
        );
        console.log(messages);
        res.json(messages);
    }
    catch (error: any) {
        next(error);
    }
}

const createMessage = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        // const Pusher = require("pusher");
        const user = req.user;
        // const user = {id:"clsw0qelu0000i6nx9s8cygje"};
        const { conversationId, senderId, content } = req.body;
        if (user?.id !== senderId) {
            res.status(401).json({ error: "User not authorized!" });
        }

          const dummyMessage = {
            id:Math.random().toString(36).substring(2),
            conversationId: conversationId,
            content: content,
            senderId: senderId,
          }
          pusher.trigger(dummyMessage.conversationId, "chat", {
            message: JSON.stringify(dummyMessage)
          });

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
        next(error);
    }
};

export default {
    getMessages,
    createMessage
}