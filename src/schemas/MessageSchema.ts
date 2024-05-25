import z from 'zod'
export const MessageSchema = z.object({
    body: z.object({
    conversationId: z.string(),
    senderId: z.string(),
    content: z.string().min(1, {
        message: "Cannot send empty message"
    }),
    })
})