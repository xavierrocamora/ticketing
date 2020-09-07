import { connect } from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import { TicketCreatedListener } from './events/ticket-created-listener';

console.clear();

const stan = connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('Listener connected to NATS');

  // allow NATS server to know client shutdown
  // so that it doesn't need to await for it
  // to connect again
  stan.on('close', () => {
    console.log('NATS connection closed!');
    process.exit();
  });

  new TicketCreatedListener(stan).listen();
});

// allow time to close the connection
// each time the program must shutdown
// before the process is killed
// might not work in windows OS
process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());
