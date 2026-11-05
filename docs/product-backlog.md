# Movie Theater App — Product Backlog

## 1. Customer Features

### US01 — Browse Movies
User story: As a customer, I want to browse available movies so that I can find a movie to watch.

Priority: Must

Acceptance criteria:
- The system displays available movies.
- Each movie displays its title and poster when available.
- Selecting a movie opens its details.

### US02 — View Movie Details
User story: As a customer, I want to view movie details so that I can decide whether to watch a movie.

Priority: Must

Acceptance criteria:
- The system displays the movie description, genre, duration, and age rating when available.
- Movie details correspond to the selected movie.

### US03 — Search Movies
User story: As a customer, I want to search for movies by title so that I can find a particular movie.

Priority: Should

Acceptance criteria:
- The customer can enter a movie title.
- The system displays matching movies.
- The system displays a message when no movies match the search.

### US04 — View Screening Schedule
User story: As a customer, I want to view available screening dates and times so that I can choose a suitable screening.

Priority: Must

Acceptance criteria:
- The system displays screenings for the selected movie.
- Each screening displays its date, time, and auditorium when appropriate.
- Cancelled or unavailable screenings cannot be booked.

### US05 — View Available Seats
User story: As a customer, I want to view available seats so that I can choose where to sit.

Priority: Must

Acceptance criteria:
- The system displays the seating arrangement for the selected screening.
- Available and unavailable seats are distinguishable.
- The system validates seat availability before confirming a booking.

### US06 — Select Seats
User story: As a customer, I want to select available seats so that I can reserve places for my movie screening.

Priority: Must

Acceptance criteria:
- The customer can select available seats.
- The selected seats are clearly identified.
- The system displays the total price for the selected seats.
- The system prevents conflicting confirmed bookings.

### US07 — Confirm Booking
User story: As a customer, I want to confirm my ticket booking so that I can reserve seats for a screening.

Priority: Must

Acceptance criteria:
- The customer can review the screening, seats, and total price.
- The system validates seat availability when confirming the booking.
- A successful booking receives a unique reference.
- The system displays a confirmation message.

### US08 — Retrieve Booking
User story: As a customer, I want to retrieve my booking details so that I can check my reservation later.

Priority: Should

Acceptance criteria:
- The customer can provide a booking reference and required verification information.
- The system displays the corresponding booking when verification succeeds.
- The system does not reveal booking information to unauthorized users.

## 2. Theater Management Features

### US09 — Staff Login
User story: As a staff member, I want to log in securely so that I can access authorized management functions.

Priority: Must

Acceptance criteria:
- Staff can log in with valid credentials.
- Invalid credentials are rejected.
- Staff-only API endpoints enforce authentication and authorization.

### US10 — Manage Movies
User story: As an administrator, I want to add, edit, and remove movie information so that the movie catalogue remains up to date.

Priority: Must

Acceptance criteria:
- Authorized staff can add a movie.
- Authorized staff can edit movie details.
- Authorized staff can remove a movie when permitted by the system's rules.
- Invalid movie data is rejected.

### US11 — Manage Screenings
User story: As an administrator, I want to manage movie screenings so that customers can see accurate schedules.

Priority: Must

Acceptance criteria:
- Authorized staff can create and edit screenings.
- Each screening is associated with a movie and auditorium.
- The system validates screening dates, times, and auditorium conflicts.
- Cancellation of a screening is handled according to the agreed policy.

### US12 — View Bookings
User story: As a staff member, I want to view bookings so that I can manage reservations.

Priority: Must

Acceptance criteria:
- Authorized staff can view bookings for a screening.
- Booking details include the screening, seats, booking reference, and status.
- Unauthorized users cannot access staff booking information.

### US13 — Cancel Eligible Bookings
User story: As an authorized staff member, I want to cancel eligible bookings so that cancellations follow theater policy.

Priority: Should

Acceptance criteria:
- The system checks whether a booking is eligible for cancellation.
- The booking status is updated after a successful cancellation.
- Seat availability is updated consistently.
- The cancellation is recorded for future reference.

## 3. Additional Features

### US14 — Email Confirmation
User story: As a customer, I want to receive a booking confirmation by email so that I have a record of my reservation.

Priority: Could

Acceptance criteria:
- A confirmation email is sent after a successful booking if email notifications are included in the project scope.
- The email contains the booking reference and screening details.
- Email delivery failures are handled without creating duplicate bookings.

### US15 — Filter Movies
User story: As a customer, I want to filter movies by genre so that I can find movies that interest me.

Priority: Could

Acceptance criteria:
- The customer can select a genre.
- The system displays movies matching that genre.
- The customer can clear the filter.

## 4. Prioritization

Must have: Essential features required for the initial working version.

Should have: Important features that can be completed after the core booking process works.

Could have: Additional features that may be implemented if time permits.

The priorities are preliminary and must be agreed upon by the project team and supervisor.

## 5. Backlog Management

- Create a GitHub Issue for each user story.
- Assign a unique ID to each issue.
- Add labels for priority and development area.
- Track work using a GitHub Project board.
- Update acceptance criteria when requirements change.
- Review priorities with the supervisor before finalizing the development plan.