# Movie Theater App — Requirements Engineering Document

## 1. Project Overview

Project name: FlimHall

Technology stack: React, Node.js, Express, PostgreSQL.

Purpose: This app will provide an online platform where customers can browse movies, check screening schedules, select seats, and book movie tickets. Theater staff will be able to manage movies, screenings, and customer bookings.

Main users:
- Customers
- Theater administrators
- Theater staff

Project objective: To develop a reliable, secure, and easy-to-use application for customer ticket booking and theater management.

## 2. Functional Requirements

### Customer Features

FR1: The system shall display available movies with their titles, posters, and release years.

FR2: The system shall display movie details, including descriptions, genres, durations, and age ratings when available.

FR3: The system shall allow customers to search for movies by title.

FR4: The system shall display available screening dates and times for each movie.

FR5: The system shall display available seats for a selected screening.

FR6: The system shall allow customers to select available seats and view the corresponding ticket prices.

FR7: The system shall calculate and display the total ticket price before booking confirmation.

FR8: The system shall allow customers to enter the information required to make a booking.

FR9: The system shall allow customers to confirm a booking and receive a unique booking reference.

FR10: The system shall allow customers to retrieve their booking details using a booking reference and appropriate verification information.

### Theater Management Features

FR11: The system shall allow authorized theater staff to log in using valid credentials.

FR12: The system shall allow authorized staff to add, edit, and remove movie information.

FR13: The system shall allow authorized staff to create, edit, and cancel screenings.

FR14: The system shall allow authorized staff to view customer bookings and their associated screening details.

FR15: The system shall allow authorized staff to manage eligible booking cancellations and update seat availability accordingly.

## 3. Non-Functional Requirements

NFR1 — Performance: The system shall display movie listings within 3 seconds for at least 95% of requests under a load of 100 concurrent users in the agreed test environment.

NFR2 — Security: The system shall require authentication for staff-only functions and enforce server-side authorization checks for administrative operations.

NFR3 — Usability: During usability testing, at least 90% of first-time test users shall be able to find a movie, select a screening, and reach the booking review page within 3 minutes without assistance.

NFR4 — Compatibility: The system shall support the latest two stable versions of Google Chrome, Microsoft Edge, Firefox, and Safari at the time of release.

NFR5 — Booking integrity: The system shall prevent the same seat from being confirmed for two different bookings for the same screening, including when multiple customers attempt to book it concurrently.

## 4. Questions for the Client

Q1: Must customers create accounts, or can they book tickets without registering?

Q2: Will the system support online payments, payment at the theater, or both?

Q3: Will the application support one theater or multiple theater locations?

Q4: What rules should apply to booking cancellations and refunds?

Q5: Should customers receive booking confirmations or reminders by email, SMS, or through the application?

## 5. Assumptions

A1: Customers can browse movie listings and screening schedules without logging in.

A2: Theater staff will provide accurate movie information, screening schedules, and ticket prices.

A3: Each screening will be assigned to one auditorium with a defined seating arrangement.

A4: Every confirmed booking will have a unique booking reference.

A5: Payment integration will be included only if it is confirmed as part of the project later.

## 6. Notes and Unclear Points

1. Customer registration requirements need confirmation.
2. Payment methods and payment processing need clarification.
3. The number of theater locations supported needs confirmation.
4. Cancellation and refund policies need to be defined.
5. The team must agree on how long a temporarily selected seat remains reserved.
6. The requirements need review by the team and supervisor.
7. The final requirements will be updated based on feedback and approved project scope.