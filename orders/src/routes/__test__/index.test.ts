import { OrderStatus } from 'common';
import request from 'supertest';
import { app  } from "../../app";
import mongoose from 'mongoose';
import { Order } from "../../models/order";
import { Ticket } from "../../models/ticket";


const buildTicket = async () => {
    const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'Ticket',
        price: 20
    });
    await ticket.save();

    return ticket;
}

it('find a list of orders for a user', async () => {
    // Create three tickets
    const ticket1 = await buildTicket();
    const ticket2 = await buildTicket();
    const ticket3 = await buildTicket();

    const user1 = global.signin();
    const user2 = global.signin();
    
    // Create one order as user #1
    await request(app)
        .post('/api/orders')
        .set('Cookie', user1)
        .send({ ticketId: ticket1.id })
        .expect(201);


    // Create two orders as user #2
    const { body: orderOne } = await request(app)
        .post('/api/orders')
        .set('Cookie', user2)
        .send({ ticketId: ticket2.id })
        .expect(201);

    const { body: orderTwo } = await request(app)
        .post('/api/orders')
        .set('Cookie', user2)
        .send({ ticketId: ticket3.id })
        .expect(201);

     // Fetch all orders for users #2
    const response = await request(app)
        .get('/api/orders')
        .set('Cookie', user2)
        expect(201);
        
    // Make sure we only got orders for user 2
    expect(response.body.orders.length).toEqual(2);
    expect(response.body.orders[0].id).toEqual(orderOne.id);
    expect(response.body.orders[1].id).toEqual(orderTwo.id);
    expect(response.body.orders[0].ticket.id).toEqual(ticket2.id);
    expect(response.body.orders[1].ticket.id).toEqual(ticket3.id);
    

})