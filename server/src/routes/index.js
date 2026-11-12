import { Router } from 'express';
import { getHealth } from '../controllers/healthController.js';
import { login } from '../controllers/authController.js';
import {
  getMovie,
  getSeats,
  listGenres,
  listMovies,
  listScreenings
} from '../controllers/movieController.js';
import { createBooking, retrieveBooking } from '../controllers/bookingController.js';
import {
  cancelBooking,
  cancelScreening,
  createMovie,
  createScreening,
  deleteMovie,
  listAdminMovies,
  listAdminScreenings,
  listAuditoriums,
  listBookings,
  updateMovie,
  updateScreening
} from '../controllers/adminController.js';
import { requireStaff } from '../middleware/auth.js';

const router = Router();

router.get('/health', getHealth);
router.post('/auth/login', login);

router.get('/movies/genres', listGenres);
router.get('/movies', listMovies);
router.get('/movies/:id/screenings', listScreenings);
router.get('/movies/:id', getMovie);
router.get('/screenings/:id/seats', getSeats);

router.post('/bookings', createBooking);
router.get('/bookings/:reference', retrieveBooking);

router.use('/admin', requireStaff);
router.get('/admin/movies', listAdminMovies);
router.post('/admin/movies', createMovie);
router.put('/admin/movies/:id', updateMovie);
router.delete('/admin/movies/:id', deleteMovie);
router.get('/admin/auditoriums', listAuditoriums);
router.get('/admin/screenings', listAdminScreenings);
router.post('/admin/screenings', createScreening);
router.put('/admin/screenings/:id', updateScreening);
router.post('/admin/screenings/:id/cancel', cancelScreening);
router.get('/admin/bookings', listBookings);
router.post('/admin/bookings/:id/cancel', cancelBooking);

export default router;
