import { Publisher, OrderCreatedEvent, Subjects } from '@xrctickets/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
