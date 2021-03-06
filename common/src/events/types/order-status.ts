export enum OrderStatus {
    // When order has been created, but the 
    //ticket is trying to order has not been reserved
    Created = 'created',

    // The ticket the order is tyring to reserve has already
    // ben reserverd, or when the user has cancelled the order
    // The order has expired before payment
    Cancelled = 'cancelled',

    // The order has successfully reserved the ticket
    AwaitingPayment = 'awaiting:payment',

    // The order has reserved the ticket and the user 
    // has provided payment successfully
    Complete = 'complete'
}