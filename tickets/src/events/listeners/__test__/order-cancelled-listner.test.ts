import { OrderCancelledListener } from './../order-cancelled-listener';
import { Message } from 'node-nats-streaming';
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/ticket";
import { OrderCancelledEvent, OrderStatus } from "common";
import mongoose from "mongoose";



const setup = async () => {
    // create an instance of the listener
    const listener = new OrderCancelledListener(natsWrapper.client);

    const orderId = mongoose.Types.ObjectId().toHexString();
    // create and save a ticket
    const ticket = Ticket.build({
        title: 'Somthing',
        price: 53,
        userId: 'skdfj'
    });
    ticket.set({ orderId });
    await ticket.save();

    // create fake data event
    const data: OrderCancelledEvent['data'] = {
        id: mongoose.Types.ObjectId().toHexString(),
        version: 0,
        ticket: {
            id: ticket.id
        }
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listener, ticket, data, msg, orderId };
}

it('updates the ticket, publishes an event and acks the message', async () => {
    const { listener, ticket, data, msg, orderId } = await setup();

    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);
    expect(updatedTicket!.orderId).not.toBeDefined();
    expect(msg.ack).toHaveBeenCalled();
    expect(natsWrapper.client.publish).toHaveBeenCalled();


})