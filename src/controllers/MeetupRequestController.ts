import { Request, Response } from "express";
import { prisma } from "../index";

const createMeetupRequest = async (req: Request, res: Response) => {
    const { menteeId, mentorId, dateTime, message } = req.body;

    if (menteeId === mentorId) {
        throw new Error("Mentee and mentor cannot be the same person");
    }

    try {
        const mentee = await prisma.user.findUnique({
            where: {
                id: menteeId
            }
        });
    
        if (!mentee) {
            throw new Error("Mentee not found");
        }
    
        if(mentee.role !== "MENTEE") {
            throw new Error("Mentee must have a role of 'mentee'");
        }
    
        const mentor = await prisma.user.findUnique({
            where: {
                id: mentorId
            }
        });
    
        if (!mentor) {
            throw new Error("Mentor not found");
        }
    
        if(mentor.role !== "MENTOR") {
            throw new Error("Mentor must have a role of 'mentor'");
        }
    
        const existingMeetupRequest = await prisma.meetupRequest.findFirst({
            where: {
                menteeId: menteeId,
                mentorId: mentorId
            }
        });
    
        if (existingMeetupRequest) {
            throw new Error("Meetup request already exists");
        }

        const meetupRequest = await prisma.meetupRequest.create({
            data: {
                menteeId,
                mentorId,
                dateTime,
                message
            }
        });

        res.json(meetupRequest);
    } catch (error: any) {
        throw new Error(error.message);
    }
};

const updateMeetupRequest = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const meetupRequest = await prisma.meetupRequest.findUnique({
            where: {
                id: id
            }
        });

        if (!meetupRequest) {
            throw new Error("Meetup request not found");
        }

        if (status !== "ACCEPTED" && status !== "REJECTED") {
            throw new Error("Status must be either 'ACCEPTED' or 'REJECTED'");
        }

        const updatedMeetupRequest = await prisma.meetupRequest.update({
            where: {
                id: id
            },
            data: {
                status
            }
        });

        res.json(updatedMeetupRequest);
    } catch (error: any) {
        throw new Error(error.message);
    }
}

export default {
    createMeetupRequest,
    updateMeetupRequest
};