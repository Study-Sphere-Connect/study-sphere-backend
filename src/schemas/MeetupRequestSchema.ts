import z from 'zod'

export const MeetupRequestSchema = z.object({
    menteeId: z.string(),
    mentorId: z.string(),
    dateTime: z.string().refine((dateTime) => {
        const parsedDate = Date.parse(dateTime);
        return !isNaN(parsedDate) && parsedDate > Date.now();
    }, {
        message: "Invalid date or date should be in the future."
    }),
    message: z.string().optional()
});