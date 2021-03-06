# ticketing

Small ecommerce like application, for demo purposes, that allows registered users to purchase the available tickets.

Features:

- User registering and authentication.
- Creation of tickets that can be purchased later.
- Reservation system that blocks a ticket from being purchased by another user until expiration time is elapsed.
- Simple payment system by credit card.
- Server side rendered client.
- Small CI/CD pipeline that runs tests on PR and deploys on production on a merge.

The project is based on a microservices structure allowing scalation and designed to withstand heavy concurrency issues while attending the petitions of multiple users. Communication between services is done in an asynchronous way by the means of events/messages handled by a message streaming server.

Architecture:

It uses a Kubernetes cluster with the next services.

- auth: Authentication service responsible for signing up, signing in and signing out users.

- tickets: This service handles all the petitions related with ticket creation, updating and searching.

- orders: Whenever a registered user wants to buy a ticket an order is created and the selected ticket is reserved. Upon the expiration of the time limit to purchase a ticket the order is cancelled and the ticket is unblocked. Registered users can consult their order registry too.

- expiration: A worker service whose only purpose is to keep track of the expiration limit for each order created.

- payments: This service creates a payment and handles the transaction with the Stripe API.

- client: A server side rendered React client using NextJS.

The deployment is automated using Skaffold.

The custom npm packet common:

It is a module with shared code between the services with the sole aim to stablish a standardization of terms, regarding the handling of errors and events, between the different teams in charge of each module. Shared code is divided in three blocks

- errors: Contains the standard definitions of errors launched by the services.

- middlewares: Contains the middlewares for error handling and authentication.

- events: Defines all the events that can be published and listened by the different services as well as the abstract classes for Listener and Publisher, the classes in charge of publishing and receiving the corresponding events.
