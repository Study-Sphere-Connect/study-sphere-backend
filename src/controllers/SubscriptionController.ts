import { Request, Response } from "express";
import { prisma } from "../index";
import { AuthenticatedRequest } from "../types";
import Stripe from 'stripe';

export const subscriptionHandler = async (req: Request, res: Response) => {
    const { price } = req.body;
    if(!price){
        return res.status(404).json({ errors: [{ message: "Price is required" }] });
    }
    try {
        const stripe = new Stripe('sk_test_51Oud8NRoFYuuQacW8L7vVopnPCSeor3whbOQxKfsrKjpRzjIpmM2KBUR3EJYHN9E1vKdTas2JDlgFLVOGUbCkI5w00wml4Ph2F', { apiVersion: '2024-04-10' });

        // Create a Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price: price,
                quantity: 1,
            }],
            mode: 'subscription',
            success_url: 'http://localhost:8081',
            cancel_url: 'http://localhost:8081'
        });
        res.json(session)
    }
    catch (error: any) {
        return res.status(404).json({ errors: [{ message: error.message}] });

    }

}


export const createSubscriptionAction = async (req: AuthenticatedRequest, res: Response) => {
    const  user  = req.user;
    const { plan } = req.body;
    if(!plan){
        return res.status(404).json({ errors: [{ message: "Plan is required" }] });


    }
    if (!user) {
        return res.status(404).json({ errors: [{ message: "Unauthorized" }] });

    }

    try {
 
        const post = await prisma.subscription.create({
            data: {
                userId: user.id,
                plan: plan,
                meetings: plan == 'Basic' ? 5 : plan == 'Standard' ? 10 : 20,
                status: 'ACTIVE'
            }
        })
        
        if (!post) {
            return res.status(404).json({ errors: [{ message: "Error while creating subscription" }] });

        }

        res.status(201).json("Subscription created successfully");
    } catch (error: any) {
        return res.status(404).json({ errors: [{ message: error.message }] });

    }

};



export const getSubscriptionByUserAction = async (req: AuthenticatedRequest, res: Response) => {


    const user = req.user;

    if (!user) {
        return res.status(404).json({ errors: [{ message: "Subscription not found" }] });

    }

    if (user.role !== "MENTOR" && user.role !== "MENTEE") {
        return res.status(404).json({ errors: [{ message: "Subscription not found" }] });

    }
    try {
        const subscription = await prisma.subscription.findFirst({
            where: {
                userId: user?.id
            }
        });

        if (!subscription) {
            return res.status(404).json({ errors: [{ message: "Subscription not found" }] });

        }

        res.json(subscription);
    }

    catch (error: any) {
        return res.status(404).json({ errors: [{ message: error.message}] });

    }
};

export const transferToAccount = async (req: Request, res: Response): Promise<Stripe.Transfer> => {
    const {amount, destinationAccountId} = req.body;
    const stripe = new Stripe('sk_test_51Oud8NRoFYuuQacW8L7vVopnPCSeor3whbOQxKfsrKjpRzjIpmM2KBUR3EJYHN9E1vKdTas2JDlgFLVOGUbCkI5w00wml4Ph2F', { apiVersion: '2024-04-10' });
    try {
        // Create a transfer to the destination account
        const transfer = await stripe.transfers.create({
            amount: amount * 100,
            currency: 'usd',
            destination: destinationAccountId,
        });
        return transfer;
    } catch (error: any) {
        throw new Error(error.message);
    }
};



export const decreaseRemainingMeetings = async (req: AuthenticatedRequest, res: Response) => {
    const user = req.user;

    if (!user) {
        throw new Error("Unauthorized");
    }

    if (user.role !== "MENTOR" && user.role !== "MENTEE") {
        throw new Error("Unauthorized");
    }

    try {
        const subscription = await prisma.subscription.findFirst({
            where: {
                userId: user.id
            }
        });

        if (!subscription) {
            return { error: "Subscription not found for the user!" };
        }

        if (subscription.meetings === 0) {
            return { error: "No remaining meetings!" };
        }

        if (subscription.meetings === 1) {
            await prisma.subscription.update({
                where: {
                    userId: user.id
                },
                data: {
                    meetings: {
                        decrement: 1
                    },
                    status: "EXPIRED"
                }
            });
        }
        else {
            await prisma.subscription.update({
                where: {
                    userId: user.id
                },
                data: {
                    meetings: {
                        decrement: 1
                    }
                }
            });
        }


        return { success: "Meetings updated successfully!" };
    } catch (error: any) {
        throw new Error(error.message);
    }
};
export default {
    subscriptionHandler,
    createSubscriptionAction,
    getSubscriptionByUserAction,
    transferToAccount,
    decreaseRemainingMeetings
}