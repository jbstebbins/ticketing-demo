import { ExpirationCompleteListener } from "../expiration-complete-listener";
import { Message } from 'node-nats-streaming';
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/ticket";
import mongoose from "mongoose";
import { ExpirationCompleteEvent, OrderStatus } from "common";
import { Order } from "../../../models/order";

const setup = async () => {
    // create a listener
    const listener = new ExpirationCompleteListener(natsWrapper.client);

    // create and save a ticket
    const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'Test',
        price: 120
    });
    await ticket.save();

    const order = Order.build({
        status: OrderStatus.Created,
        userId: 'dkaljfds',
        expiresAt: new Date(),
        ticket: ticket.id
    })
    await order.save();

    // creat a fake data object
    const data: ExpirationCompleteEvent['data'] = {
        orderId: order.id
    };

    // create a fake msg object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    // return all of this stuff
    return { listener, ticket, order, data, msg };
};

it('updates order status to cancelled', async () => {
    const { listener, order, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const updatedOrder = await Order.findById(order.id);
    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
})

it('emit an order cancelled event', async () => {
    const { listener, order, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();

    const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
    expect(eventData.id).toEqual(order.id);

})

it('ack the message', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
})