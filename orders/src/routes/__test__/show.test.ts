import { OrderStatus } from 'common';
import request from 'supertest';
import { app  } from "../../app";
import mongoose from 'mongoose';
import { Order } from "../../models/order";
import { Ticket } from "../../models/ticket";

it('Fetches an order', async () => {
    // Create a ticket
    const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'Ticket',
        price: 20
    });
    await ticket.save();
    
    const user = global.signin();
    // make request to build an order with this ticket
    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201);

    // make a request to fetch an order
    const { body: fectchedOrder } =  await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(200);

    expect(fectchedOrder.order.id).toEqual(order.id);

});

it('returns an error is one user tries to fetch another users order', async () => {
    // Create a ticket
    const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'Ticket',
        price: 20
    });
    await ticket.save();
    
    const user = global.signin();
    // make request to build an order with this ticket
    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201);

    // make a request to fetch an order
    await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', global.signin())
        .send()
        .expect(401);

});