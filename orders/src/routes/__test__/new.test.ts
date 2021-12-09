import { OrderStatus } from 'common';
import request from 'supertest';
import { app  } from "../../app";
import mongoose from 'mongoose';
import { Order } from "../../models/order";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";

it('returns an error if ticket doesnt exist', async () => {
    const ticketId = mongoose.Types.ObjectId();

    await request (app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({ ticketId })
        .expect(404);
});

it('returns an error if the ticket is already reserved', async () => {
    const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'tjkadklfa',
        price: 100
    });
    await ticket.save();

    const order = Order.build({
        userId: 'jkaldfjds',
        status: OrderStatus.Created,
        expiresAt: new Date(),
        ticket
    });
    await order.save();

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({ ticketId: ticket.id })
        .expect(400);

});

it('reserves as ticket', async () => {
    const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'Ticket 1',
        price: 35
    });
    await ticket.save();

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({ ticketId: ticket.id })
        .expect(201);

    // Could imporve this by looking at the reponse

});

it('emits a created event', async () => {
    const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'Ticket 1',
        price: 35
    });
    await ticket.save();

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({ ticketId: ticket.id })
        .expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});

