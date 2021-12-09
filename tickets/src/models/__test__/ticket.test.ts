import { Ticket } from '../ticket';


// done callback is used to make sure jest knows the test is done
it('implements optimistic concurrency control', async (done) => {
    // create an instance of a ticket
    const ticket = Ticket.build({
        title: 'My Title',
        price: 55,
        userId: '92929'
    });
    
    // Save the ticket to the database
    await ticket.save();

    // fetch the ticket twic
    const firstInstance = await Ticket.findById(ticket.id);
    const secondInstance = await Ticket.findById(ticket.id);

    // make two separate changes to the tickets we fetched
    firstInstance!.set({ price: 22 });
    secondInstance!.set({ price: 10 });

    // save the first fetched ticket
    await firstInstance!.save();

    // save the second fectched ticket
    
    try {
        await secondInstance!.save();
    } catch (err) {
        return done();        
    }

    throw new Error('Should not reach this point');

});

it('increments the version number on multiple saves', async () => {
    const ticket = Ticket.build({
        title: 'My Title',
        price: 55,
        userId: '92929'
    });

    await ticket.save();
    expect(ticket.version).toEqual(0);
    await ticket.save();
    expect(ticket.version).toEqual(1);
    await ticket.save();
    expect(ticket.version).toEqual(2);


})