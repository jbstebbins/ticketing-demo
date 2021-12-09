import { Publisher, Subjects, TicketUpdateEvent } from "common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdateEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
