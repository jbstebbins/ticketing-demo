import { Publisher, Subjects, TicketCreatedEvent } from "common";

export class TickerCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
