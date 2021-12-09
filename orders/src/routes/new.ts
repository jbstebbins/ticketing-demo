import mongoose from 'mongoose';
import express, { Request, Response } from "express";
import { requireAuth, validateRequest, NotFoundError, OrderStatus, BadRequestError } from "common";
import { body } from "express-validator";
import { Ticket } from "../models/ticket";
import { Order } from "../models/order";
import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";
import { natsWrapper } from "../nats-wrapper";



const router = express.Router();

const EXPIRATION_WINDOWS_SECONDS = 1 * 60;

router.post('/api/orders',requireAuth, [
    body('ticketId')
        .not()
        .isEmpty()
        .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
        .withMessage('Ticket')
], validateRequest, async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    // Find the ticket user is trying to order in the DB
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
        throw new NotFoundError();
    }

    // Make sure the ticket is not alrady reserved
    // Run query to look at all orders.  Find an order where 
    // the ticket is the ticket we just found **AND** the order status is **not** cancelled.
    // If we find an order from that means the ticket **is** reserved
    const isReserved = await ticket.isReserved();

    if (isReserved) {
        throw new BadRequestError('Ticket is already reserved');
    }

    // Calculate an expiration date for the order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOWS_SECONDS);

    // Build the order and save to DB
    const order = Order.build({
        userId: req.currentUser!.id,
        status: OrderStatus.Created,
        expiresAt: expiration,
        ticket
    });

    await order.save();

    // Publish and order event

    new OrderCreatedPublisher(natsWrapper.client).publish({
        id: order.id,
        status: order.status,
        userId: order.userId,
        expiresAt: order.expiresAt.toISOString(),
        version: order.version,
        ticket: {
            id: ticket.id,
            price: ticket.price
        }
    });

    res.status(201).send(order);
});

export { router as newOrderRouter };