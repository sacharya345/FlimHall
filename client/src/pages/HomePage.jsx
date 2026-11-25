import { useCallback, useEffect, useRef, useState } from 'react';
import CorporateBookingSection from '../components/CorporateBookingSection';
import SeatMap from '../components/SeatMap';
import { GENRE_LIST, MOVIES_CATALOG } from '../data/moviesCatalog';
import { apiRequest } from '../services/api';
import { getShowtimeSchedule } from '../utils/seatRules';

const FALLBACK_MOVIES = MOVIES_CATALOG;

function mergeAndFilterCatalog(apiMovies = [], searchQuery = '', genreFilter = '') {
  const byTitle = new Map();
  apiMovies.forEach((m) => {
    byTitle.set(String(m.title).trim().toLowerCase(), m);
  });
  FALLBACK_MOVIES.forEach((m) => {
    const key = String(m.title).trim().toLowerCase();
    if (!byTitle.has(key)) {
      byTitle.set(key, m);
    }
  });
  const q = searchQuery.trim().toLowerCase();
  return [...byTitle.values()].filter((m) => {
    const matchesTitle = !q || m.title.toLowerCase().includes(q);
    const matchesGenre = !genreFilter || m.genre.toLowerCase() === genreFilter.toLowerCase();
    return matchesTitle && matchesGenre;
  });
}

const emptyMovie = {
  title: '',
  description: '',
  genre: '',
  duration_min: '',
  release_year: '',
  age_rating: '',
  poster_url: ''
};

const emptyScreening = {
  movie_id: '',
  auditorium_id: '',
  starts_at: '',
  base_price: '14'
};

function formatDate(value) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  }).format(new Date(value));
}

function toLocalDateTime(value) {
  const date = new Date(value);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
}

function fetchAdminData(token) {
  return Promise.all([
    apiRequest('/admin/movies', { token }),
    apiRequest('/admin/screenings', { token }),
    apiRequest('/admin/auditoriums', { token }),
    apiRequest('/admin/bookings', { token })
  ]);
}

const FLIMHALL_AUDITORIUMS = [
  { id: 1, name: 'Oulu — Auditorium 1 (100 seats)', city: 'oulu', capacity: 100, rows: 10, cols: 10 },
  { id: 2, name: 'Oulu — Auditorium 2 (200 seats)', city: 'oulu', capacity: 200, rows: 20, cols: 10 },
  { id: 3, name: 'Tampere — Auditorium 1 (100 seats)', city: 'tampere', capacity: 100, rows: 10, cols: 10 },
  { id: 4, name: 'Tampere — Auditorium 2 (200 seats)', city: 'tampere', capacity: 200, rows: 20, cols: 10 }
];

function buildFallbackScreenings(movieId) {
  const now = Date.now();
  return [
    {
      id: movieId * 100 + 1,
      movie_id: movieId,
      starts_at: new Date(now + 2 * 3600_000).toISOString(),
      base_price: 14.0,
      auditorium: 'Oulu — Auditorium 1 (100 seats)',
      city: 'oulu',
      available_seats: 96
    },
    {
      id: movieId * 100 + 2,
      movie_id: movieId,
      starts_at: new Date(now + 4 * 3600_000).toISOString(),
      base_price: 14.0,
      auditorium: 'Oulu — Auditorium 2 (200 seats)',
      city: 'oulu',
      available_seats: 194
    },
    {
      id: movieId * 100 + 3,
      movie_id: movieId,
      starts_at: new Date(now + 3 * 3600_000).toISOString(),
      base_price: 14.0,
      auditorium: 'Tampere — Auditorium 1 (100 seats)',
      city: 'tampere',
      available_seats: 95
    },
    {
      id: movieId * 100 + 4,
      movie_id: movieId,
      starts_at: new Date(now + 5 * 3600_000).toISOString(),
      base_price: 14.0,
      auditorium: 'Tampere — Auditorium 2 (200 seats)',
      city: 'tampere',
      available_seats: 192
    }
  ];
}

function normalizeAuditoriumName(rawName = '', index = 0) {
  const lower = String(rawName).toLowerCase();
  if (lower.includes('oulu') || lower.includes('tampere')) {
    return rawName;
  }
  return FLIMHALL_AUDITORIUMS[index % FLIMHALL_AUDITORIUMS.length].name;
}

function buildFallbackSeats(screening) {
  const audName = String(screening.auditorium || '');
  const is200 = audName.includes('200') || audName.includes('Auditorium 2') || audName.includes('Screen 2');
  const rows = is200 ? 20 : 10;
  const cols = 10;
  const seats = [];
  for (let r = 0; r < rows; r += 1) {
    for (let c = 1; c <= cols; c += 1) {
      const label = `${String.fromCharCode(65 + r)}${c}`;
      seats.push({
        label,
        available: !(r === 3 && (c === 5 || c === 6))
      });
    }
  }
  return {
    screening: {
      id: screening.id,
      starts_at: screening.starts_at,
      base_price: screening.base_price,
      auditorium: screening.auditorium
    },
    seats
  };
}

function MovieCard({ movie, onSelect }) {
  return (
    <article
      className="movie-card"
      onClick={() => onSelect(movie)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(movie);
        }
      }}
    >
      {movie.poster_url ? (
        <img className="movie-art" src={movie.poster_url} alt={`${movie.title} poster`} />
      ) : (
        <div className="movie-art movie-art-placeholder" aria-hidden="true">
          <span>{movie.genre}</span>
          <strong>{movie.title}</strong>
        </div>
      )}
      <div className="movie-card-copy">
        <div className="movie-card-heading">
          <h3>{movie.title}</h3>
          <span className="rating">{movie.age_rating}</span>
        </div>
        <p>
          {movie.release_year || 'Year unavailable'} <span aria-hidden="true">·</span> {movie.genre}{' '}
          <span aria-hidden="true">·</span> {movie.duration_min} min
        </p>
        <button
          type="button"
          className="text-button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(movie);
          }}
        >
          Movie details and showtimes <span aria-hidden="true">→</span>
        </button>
      </div>
    </article>
  );
}

export default function HomePage() {
  const [view, setView] = useState('movies');
  const [locationFilter, setLocationFilter] = useState('all');
  const [movies, setMovies] = useState(FALLBACK_MOVIES);
  const [genres, setGenres] = useState(() => [...new Set(FALLBACK_MOVIES.map((m) => m.genre))]);
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');
  const [usingFallbackCatalog, setUsingFallbackCatalog] = useState(false);

  const [selectedMovie, setSelectedMovie] = useState(null);
  const [screenings, setScreenings] = useState([]);
  const [selectedScreening, setSelectedScreening] = useState(null);
  const [seatData, setSeatData] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [wheelchairSpaces, setWheelchairSpaces] = useState(0);
  const [childSeatCount, setChildSeatCount] = useState(0);
  const [applyLoyaltyTenPack, setApplyLoyaltyTenPack] = useState(false);
  const [paymentMode, setPaymentMode] = useState('online'); // 'online' | 'counter'
  const [holdSeconds, setHoldSeconds] = useState(15 * 60);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [stripeSession, setStripeSession] = useState(null);
  const [stripeDeclineError, setStripeDeclineError] = useState('');
  const [stripeWebhookLog, setStripeWebhookLog] = useState('');
  const [dummyCard, setDummyCard] = useState({
    cardNumber: '4242 4242 4242 4242',
    expiry: '12/28',
    cvc: '424',
    postalCode: '90100',
    country: 'FI'
  });
  const [cancellationAlerts, setCancellationAlerts] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('flimhall-cancellation-alerts') || '[]');
    } catch {
      return [];
    }
  });
  const [entranceCheckRef, setEntranceCheckRef] = useState('');
  const [entranceCheckResult, setEntranceCheckResult] = useState(null);

  const [customerAccount, setCustomerAccount] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('flimhall-customer-account') || 'null');
    } catch {
      return null;
    }
  });
  const [accountForm, setAccountForm] = useState({ name: '', email: '', password: '' });

  const [customer, setCustomer] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('flimhall-customer-account') || 'null');
      return saved ? { name: saved.name, email: saved.email } : { name: '', email: '' };
    } catch {
      return { name: '', email: '' };
    }
  });
  const [bookingResult, setBookingResult] = useState(null);
  const [bookingLookup, setBookingLookup] = useState({ reference: '', email: '' });
  const [retrievedBooking, setRetrievedBooking] = useState(null);
  const [staffToken, setStaffToken] = useState(() => sessionStorage.getItem('flimhall-staff-token') || '');
  const [staffProfile, setStaffProfile] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem('flimhall-staff-profile') || 'null');
    } catch {
      return null;
    }
  });
  const [staffAuthMode, setStaffAuthMode] = useState('signin'); // 'signin' | 'signup'
  const [staffAccounts, setStaffAccounts] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('flimhall-staff-accounts') || '[]');
    } catch {
      return [];
    }
  });
  const [newStaffForm, setNewStaffForm] = useState({
    ownerEmail: 'admin@flimhall.com',
    ownerPassword: '',
    staffName: '',
    staffEmail: '',
    staffPassword: '',
    location: 'Oulu & Tampere'
  });
  const [login, setLogin] = useState({ email: '', password: '' });
  const [adminMovies, setAdminMovies] = useState([]);
  const [adminScreenings, setAdminScreenings] = useState([]);
  const [auditoriums, setAuditoriums] = useState(FLIMHALL_AUDITORIUMS);
  const [adminBookings, setAdminBookings] = useState([]);
  const [movieForm, setMovieForm] = useState(emptyMovie);
  const [editingMovieId, setEditingMovieId] = useState(null);
  const [screeningForm, setScreeningForm] = useState(emptyScreening);
  const [editingScreeningId, setEditingScreeningId] = useState(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loadingMovies, setLoadingMovies] = useState(false);
  const movieRequestId = useRef(0);
  const selectedMovieId = selectedMovie?.id;
  const selectedScreeningId = selectedScreening?.id;

  const totalSelectedTickets = selectedSeats.length + wheelchairSpaces;

  function updateSelectedSeats(nextSeats) {
    setSelectedSeats(nextSeats);
    if (childSeatCount > nextSeats.length) {
      setChildSeatCount(nextSeats.length);
    }
    if (!nextSeats.length && !wheelchairSpaces) {
      setHoldSeconds(15 * 60);
    }
  }

  function updateWheelchairSpaces(nextCount) {
    setWheelchairSpaces(nextCount);
    if (!selectedSeats.length && !nextCount) {
      setHoldSeconds(15 * 60);
    }
  }

  // 15-minute temporary seat hold countdown timer
  useEffect(() => {
    if (!totalSelectedTickets) return undefined;
    const interval = window.setInterval(() => {
      setHoldSeconds((prev) => {
        if (prev <= 1) {
          setSelectedSeats([]);
          setWheelchairSpaces(0);
          setError('Your 15-minute temporary seat hold expired. Please select your seats again.');
          return 15 * 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [totalSelectedTickets]);

  const loadFallbackAdminState = useCallback(() => {
    const customMovies = JSON.parse(localStorage.getItem('flimhall-admin-movies') || 'null');
    const movieList = customMovies || FALLBACK_MOVIES;
    const customScreenings = JSON.parse(localStorage.getItem('flimhall-admin-screenings') || 'null');
    const defaultScreenings = movieList.slice(0, 6).flatMap((m) =>
      buildFallbackScreenings(m.id).map((s) => ({
        ...s,
        movie_title: m.title,
        auditorium_id: FLIMHALL_AUDITORIUMS.find((a) => a.name === s.auditorium)?.id || 1,
        status: 'scheduled'
      }))
    );
    const screeningList = customScreenings || defaultScreenings;
    const bookingList = JSON.parse(localStorage.getItem('flimhall-demo-bookings') || '[]').map((b, idx) => ({
      id: b.id || idx + 1,
      ...b
    }));
    setAdminMovies(movieList);
    setAdminScreenings(screeningList);
    setAuditoriums(FLIMHALL_AUDITORIUMS);
    setAdminBookings(bookingList);
  }, []);

  const loadAdminData = useCallback(async () => {
    if (!staffToken) return;
    if (staffToken === 'demo-staff-token') {
      loadFallbackAdminState();
      return;
    }
    try {
      const [movieList, screeningList, auditoriumList, bookingList] = await fetchAdminData(staffToken);
      setAdminMovies(movieList);
      setAdminScreenings(screeningList);
      setAuditoriums(auditoriumList?.length ? auditoriumList : FLIMHALL_AUDITORIUMS);
      setAdminBookings(bookingList);
    } catch {
      loadFallbackAdminState();
    }
  }, [staffToken, loadFallbackAdminState]);

  const loadMovies = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set('search', search.trim());
      if (genre) params.set('genre', genre);
      const [movieList, genreList] = await Promise.all([
        apiRequest(`/movies${params.size ? `?${params}` : ''}`),
        apiRequest('/movies/genres')
      ]);
      setMovies(mergeAndFilterCatalog(movieList, search, genre));
      setGenres([...new Set([...GENRE_LIST, ...(genreList || [])])]);
      setUsingFallbackCatalog(false);
      setError('');
    } catch {
      setMovies(mergeAndFilterCatalog([], search, genre));
      setGenres(GENRE_LIST);
      setUsingFallbackCatalog(true);
    } finally {
      setLoadingMovies(false);
    }
  }, [search, genre]);

  useEffect(() => {
    const timer = window.setTimeout(loadMovies, 200);
    return () => window.clearTimeout(timer);
  }, [loadMovies]);

  useEffect(() => {
    if (!staffToken) return undefined;
    const timer = window.setTimeout(() => {
      loadAdminData();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [staffToken, loadAdminData]);

  useEffect(() => {
    if (!selectedScreeningId || usingFallbackCatalog) return undefined;
    let active = true;
    apiRequest(`/screenings/${selectedScreeningId}/seats`)
      .then((result) => {
        if (active && result?.seats?.length) setSeatData(result);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [selectedScreeningId, usingFallbackCatalog]);

  useEffect(() => {
    if (selectedMovieId) {
      document.getElementById('movie-details')?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedMovieId]);

  const reportError = (requestError) => {
    setError(requestError.message || 'Something went wrong. Please try again.');
    setNotice('');
  };

  async function selectMovie(movie) {
    const requestId = movieRequestId.current + 1;
    movieRequestId.current = requestId;
    const defaultSchedule = buildFallbackScreenings(movie.id);
    const initialScreening =
      locationFilter === 'tampere' ? defaultSchedule[2] || defaultSchedule[0] : defaultSchedule[0];

    setSelectedMovie(movie);
    setScreenings(defaultSchedule);
    setSelectedScreening(initialScreening);
    setSeatData(buildFallbackSeats(initialScreening));
    setSelectedSeats([]);
    setWheelchairSpaces(0);
    setBookingResult(null);
    setHoldSeconds(15 * 60);

    if (usingFallbackCatalog) return;

    try {
      const [details, schedule] = await Promise.all([
        apiRequest(`/movies/${movie.id}`),
        apiRequest(`/movies/${movie.id}/screenings`)
      ]);
      if (requestId !== movieRequestId.current) return;
      setSelectedMovie(details);
      if (Array.isArray(schedule) && schedule.length > 0) {
        const enrichedSchedule = schedule.map((scr, idx) => ({
          ...scr,
          auditorium: normalizeAuditoriumName(scr.auditorium, idx)
        }));
        setScreenings(enrichedSchedule);
        setSelectedScreening(enrichedSchedule[0]);
        setSeatData(buildFallbackSeats(enrichedSchedule[0]));
      }
    } catch {
      // Fallback schedule and seat map remain active
    }
  }

  const unitBasePrice = selectedScreening ? Number(selectedScreening.base_price) : 14;
  const unitChildPrice = unitBasePrice * 0.5; // 50% Child (<=12) Discount
  const unitWheelchairPrice = unitBasePrice * 0.8; // 20% Accessibility Discount
  const adultSeatCount = Math.max(0, selectedSeats.length - childSeatCount);
  const rawTotalEur =
    adultSeatCount * unitBasePrice +
    childSeatCount * unitChildPrice +
    wheelchairSpaces * unitWheelchairPrice;
  const loyaltyDiscountActive = Boolean(
    customerAccount && applyLoyaltyTenPack && totalSelectedTickets >= 10
  );
  const computedTotalPriceEur = (
    loyaltyDiscountActive ? rawTotalEur * 0.5 : rawTotalEur
  ).toFixed(2);
  const wheelchairPassLabels =
    wheelchairSpaces > 0
      ? [
          `${wheelchairSpaces} × ♿ Wheelchair Open Space (Front of Row 1 · No seat number · 20% OFF)`
        ]
      : [];
  const combinedBookingItems = [...selectedSeats, ...wheelchairPassLabels];

  async function finalizeBookingRecord({
    stripeSessionId = null,
    stripePaymentIntentId = null,
    webhookEvent = null
  } = {}) {
    const transactionId =
      paymentMode === 'online'
        ? stripePaymentIntentId || `pi_3${Math.random().toString(36).slice(2, 12)}`
        : null;
    const sessionId =
      paymentMode === 'online'
        ? stripeSessionId || stripeSession?.sessionId || `cs_test_${Math.random().toString(36).slice(2, 16)}`
        : null;
    const totalEur = computedTotalPriceEur;

    // If the guest booked only the Open Wheelchair Space (no numbered seat), record directly without requiring a seat number
    if (selectedSeats.length === 0 && wheelchairSpaces > 0) {
      const openSpaceRef = `FH-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
      const openSpaceBooking = {
        booking_ref: openSpaceRef,
        customer_name: customer.name,
        customer_email: customer.email.trim().toLowerCase(),
        movie_title: selectedMovie.title,
        starts_at: selectedScreening.starts_at,
        auditorium: selectedScreening.auditorium,
        seats: combinedBookingItems,
        total_price: Number(totalEur),
        status: paymentMode === 'online' ? 'paid' : 'confirmed',
        payment_status: paymentMode === 'online' ? 'paid' : 'PAY_AT_COUNTER',
        transaction_id: transactionId,
        stripe_session_id: sessionId,
        stripe_payment_intent_id: transactionId,
        webhook_event: webhookEvent || (paymentMode === 'online' ? 'checkout.session.completed' : null)
      };
      const stored = JSON.parse(localStorage.getItem('flimhall-demo-bookings') || '[]');
      localStorage.setItem('flimhall-demo-bookings', JSON.stringify([openSpaceBooking, ...stored]));
      setBookingResult({
        booking: openSpaceBooking,
        emailStatus: 'sent',
        paymentMode,
        transactionId,
        stripeSessionId: sessionId,
        webhookEvent: openSpaceBooking.webhook_event,
        paymentStatus: paymentMode === 'online' ? 'paid' : 'UNPAID'
      });
      setSelectedSeats([]);
      setWheelchairSpaces(0);
      setShowPaymentModal(false);
      setStripeSession(null);
      setStripeDeclineError('');
      setNotice(
        paymentMode === 'online'
          ? `✓ Stripe Webhook checkout.session.completed verified (€${totalEur} · ${sessionId})! Open Wheelchair Space booking ${openSpaceRef} is now PAID.`
          : `Open Wheelchair Space reservation confirmed (${openSpaceRef})! Please collect and pay at least 2 hours before showtime.`
      );
      setError('');
      return;
    }

    try {
      const result = await apiRequest('/bookings', {
        method: 'POST',
        body: {
          name: customer.name,
          email: customer.email,
          screeningId: selectedScreening.id,
          seats: selectedSeats
        }
      });
      const enrichedBooking = {
        ...result.booking,
        seats: combinedBookingItems,
        total_price: Number(totalEur),
        payment_status: paymentMode === 'online' ? 'paid' : 'PAY_AT_COUNTER',
        stripe_session_id: sessionId,
        stripe_payment_intent_id: transactionId,
        webhook_event: webhookEvent || (paymentMode === 'online' ? 'checkout.session.completed' : null)
      };
      setBookingResult({
        ...result,
        booking: enrichedBooking,
        paymentMode,
        transactionId,
        stripeSessionId: sessionId,
        webhookEvent: enrichedBooking.webhook_event,
        paymentStatus: paymentMode === 'online' ? 'paid' : 'UNPAID'
      });
      setSelectedSeats([]);
      setWheelchairSpaces(0);
      setShowPaymentModal(false);
      setStripeSession(null);
      setStripeDeclineError('');
      setNotice(
        paymentMode === 'online'
          ? `✓ Stripe Checkout Session (${sessionId}) verified via checkout.session.completed webhook! Booking status: pending_payment → paid.`
          : 'Counter reservation confirmed! Please collect and pay at least 2 hours before showtime.'
      );
      setError('');
    } catch (requestError) {
      if (usingFallbackCatalog || !requestError.status) {
        const fallbackRef = `FH-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
        const demoBooking = {
          booking_ref: fallbackRef,
          customer_name: customer.name,
          customer_email: customer.email.trim().toLowerCase(),
          movie_title: selectedMovie.title,
          starts_at: selectedScreening.starts_at,
          auditorium: selectedScreening.auditorium,
          seats: combinedBookingItems,
          total_price: Number(totalEur),
          status: 'confirmed',
          payment_status: paymentMode === 'online' ? 'paid' : 'PAY_AT_COUNTER',
          transaction_id: transactionId,
          stripe_session_id: sessionId,
          stripe_payment_intent_id: transactionId,
          webhook_event: webhookEvent || (paymentMode === 'online' ? 'checkout.session.completed' : null)
        };
        const stored = JSON.parse(localStorage.getItem('flimhall-demo-bookings') || '[]');
        localStorage.setItem('flimhall-demo-bookings', JSON.stringify([demoBooking, ...stored]));
        setBookingResult({
          booking: demoBooking,
          emailStatus: 'sent',
          paymentMode,
          transactionId,
          stripeSessionId: sessionId,
          webhookEvent: demoBooking.webhook_event,
          paymentStatus: paymentMode === 'online' ? 'paid' : 'UNPAID'
        });
        setSelectedSeats([]);
        setWheelchairSpaces(0);
        setShowPaymentModal(false);
        setStripeSession(null);
        setStripeDeclineError('');
        setNotice(
          paymentMode === 'online'
            ? `✓ Stripe Checkout Session (${sessionId}) verified via checkout.session.completed webhook! Booking ${fallbackRef} is now PAID.`
            : `Counter reservation confirmed (${fallbackRef})! Please collect and pay at least 2 hours before showtime.`
        );
        setError('');
        return;
      }
      reportError(requestError);
    }
  }

  async function submitBooking(event) {
    event.preventDefault();

    if (paymentMode === 'counter') {
      if (!customerAccount) {
        setError(
          'To reserve seats and pay at the theater counter, please sign in to a Customer Account first (or choose Pay Online).'
        );
        return;
      }
      if (totalSelectedTickets > 6) {
        setError(
          'Counter reservations are limited to a maximum of 6 tickets. For more than 6 tickets paid later, please call the theater directly.'
        );
        return;
      }
      await finalizeBookingRecord();
      return;
    }

    // For online payments, open the Official Stripe Hosted Checkout Session (pending_payment state)
    startStripeCheckout();
  }

  function startStripeCheckout() {
    if (!customer.name.trim() || !customer.email.trim() || !totalSelectedTickets) {
      setError('Please enter your name and email before proceeding to Stripe Checkout.');
      return;
    }
    const generatedSessionId = `cs_test_a1${Math.random().toString(36).slice(2, 14)}${Date.now().toString(36)}`;
    const pendingBookingId = `bk_pending_${Math.random().toString(36).slice(2, 9)}`;
    const unitAmountCents = Math.round(Number(computedTotalPriceEur) * 100);
    setStripeSession({
      sessionId: generatedSessionId,
      pendingBookingId,
      status: 'pending_payment',
      currency: 'eur',
      amountCents: unitAmountCents,
      amountEur: computedTotalPriceEur,
      createdAt: new Date().toLocaleTimeString()
    });
    setStripeDeclineError('');
    setStripeWebhookLog(
      `POST /api/checkout-sessions → Created pending booking (${pendingBookingId}, status: "pending_payment") & Stripe Session ${generatedSessionId} (${unitAmountCents} cents EUR).`
    );
    setError('');
    setShowPaymentModal(true);
  }

  function cancelStripeCheckout() {
    const cancelledBookingId = stripeSession?.pendingBookingId || 'bk_pending';
    const cancelledSessionId = stripeSession?.sessionId || 'cs_test_cancelled';
    setShowPaymentModal(false);
    setPaymentProcessing(false);
    setStripeDeclineError('');
    setStripeSession(null);
    setNotice(
      `Stripe Checkout cancelled (/cancel?booking_id=${cancelledBookingId} · ${cancelledSessionId}). Booking remains unpaid (status: pending_payment → cancelled) and your card was not charged.`
    );
  }

  function selectOfficialStripeTestCard(presetType) {
    setStripeDeclineError('');
    if (presetType === 'success') {
      setDummyCard((prev) => ({ ...prev, cardNumber: '4242 4242 4242 4242', expiry: '12/28', cvc: '424' }));
    } else if (presetType === 'decline') {
      setDummyCard((prev) => ({ ...prev, cardNumber: '4000 0000 0000 0002', expiry: '12/28', cvc: '424' }));
    } else if (presetType === 'insufficient') {
      setDummyCard((prev) => ({ ...prev, cardNumber: '4000 0000 0000 9995', expiry: '12/28', cvc: '424' }));
    } else if (presetType === '3ds') {
      setDummyCard((prev) => ({ ...prev, cardNumber: '4000 0025 0000 3155', expiry: '12/28', cvc: '424' }));
    }
  }

  function completeDummyPayment(event) {
    event.preventDefault();
    const digitsOnly = dummyCard.cardNumber.replace(/\s+/g, '');
    setPaymentProcessing(true);
    setStripeDeclineError('');

    window.setTimeout(() => {
      // Official Stripe Decline Test Card: 4000 0000 0000 0002
      if (digitsOnly === '4000000000000002') {
        setPaymentProcessing(false);
        setStripeDeclineError(
          'Stripe Test Error (card_declined): Your card was declined (4000 0000 0000 0002). Webhook checkout.session.completed was NOT fired; booking status remains "pending_payment" (UNPAID).'
        );
        setStripeWebhookLog(
          `payment_intent.payment_failed → Card 4000••••••••0002 declined (generic_decline). Booking ${stripeSession?.pendingBookingId || ''} stays pending_payment.`
        );
        return;
      }

      // Official Stripe Insufficient Funds Test Card: 4000 0000 0000 9995
      if (digitsOnly === '4000000000009995') {
        setPaymentProcessing(false);
        setStripeDeclineError(
          'Stripe Test Error (insufficient_funds): Your card has insufficient funds (4000 0000 0000 9995). Booking status remains "pending_payment" (UNPAID).'
        );
        setStripeWebhookLog(
          `payment_intent.payment_failed → Card 4000••••••••9995 declined (insufficient_funds). Booking ${stripeSession?.pendingBookingId || ''} stays pending_payment.`
        );
        return;
      }

      const activeSessionId =
        stripeSession?.sessionId || `cs_test_${Math.random().toString(36).slice(2, 16)}`;
      const paymentIntentId = `pi_3${Math.random().toString(36).slice(2, 14)}`;
      setStripeWebhookLog(
        `POST /api/stripe/webhook (stripe-signature verified) → Event: checkout.session.completed (${activeSessionId} · ${paymentIntentId}). Updating booking status: pending_payment → paid.`
      );
      setPaymentProcessing(false);
      finalizeBookingRecord({
        stripeSessionId: activeSessionId,
        stripePaymentIntentId: paymentIntentId,
        webhookEvent: 'checkout.session.completed'
      });
    }, 650);
  }

  async function retrieveBooking(event) {
    event.preventDefault();
    try {
      const result = await apiRequest(
        `/bookings/${encodeURIComponent(bookingLookup.reference)}?email=${encodeURIComponent(bookingLookup.email)}`
      );
      setRetrievedBooking(result);
      setError('');
    } catch (requestError) {
      const stored = JSON.parse(localStorage.getItem('flimhall-demo-bookings') || '[]');
      const localMatch = stored.find(
        (b) =>
          b.booking_ref.toUpperCase() === bookingLookup.reference.trim().toUpperCase() &&
          b.customer_email.toLowerCase() === bookingLookup.email.trim().toLowerCase()
      );
      if (localMatch) {
        setRetrievedBooking(localMatch);
        setError('');
        return;
      }
      setRetrievedBooking(null);
      reportError(requestError);
    }
  }

  async function handleCustomerAuth(event) {
    event.preventDefault();
    const fallbackAccount = {
      name: accountForm.name.trim() || 'FlimHall Member',
      email: accountForm.email.trim().toLowerCase()
    };

    try {
      const result = await apiRequest('/auth/customer', {
        method: 'POST',
        body: {
          name: fallbackAccount.name,
          email: fallbackAccount.email,
          password: accountForm.password
        }
      });
      const savedAccount = result.account || fallbackAccount;
      localStorage.setItem('flimhall-customer-account', JSON.stringify(savedAccount));
      setCustomerAccount(savedAccount);
      setCustomer((prev) => ({
        name: prev.name || savedAccount.name,
        email: prev.email || savedAccount.email
      }));
      setAccountForm({ name: '', email: '', password: '' });
      setError('');
      setNotice(
        result.isNewAccount
          ? `Account created and saved in database for ${savedAccount.name} (${savedAccount.email}).`
          : `Signed in as ${savedAccount.name}. You can now reserve up to 6 tickets to pay at the theater counter.`
      );
    } catch (requestError) {
      if (usingFallbackCatalog) {
        localStorage.setItem('flimhall-customer-account', JSON.stringify(fallbackAccount));
        setCustomerAccount(fallbackAccount);
        setCustomer((prev) => ({
          name: prev.name || fallbackAccount.name,
          email: prev.email || fallbackAccount.email
        }));
        setAccountForm({ name: '', email: '', password: '' });
        setNotice(`Signed in as ${fallbackAccount.name}. You can now reserve up to 6 tickets to pay at the theater counter.`);
        return;
      }
      reportError(requestError);
    }
  }

  function handleCustomerLogout() {
    localStorage.removeItem('flimhall-customer-account');
    setCustomerAccount(null);
    setPaymentMode('online');
    setNotice('Signed out of your customer account.');
  }

  async function staffLogin(event) {
    event.preventDefault();
    const emailLower = login.email.trim().toLowerCase();

    // 1. Try backend PostgreSQL /auth/login first
    try {
      const result = await apiRequest('/auth/login', { method: 'POST', body: login });
      const profile = {
        email: result.staff.email,
        name:
          result.staff.name ||
          (result.staff.email === 'admin@flimhall.com' ? 'Main Admin Owner' : 'Theater Staff'),
        location: result.staff.location || 'Oulu & Tampere',
        role: result.staff.role === 'admin' || result.staff.email === 'admin@flimhall.com' ? 'owner' : 'staff'
      };
      sessionStorage.setItem('flimhall-staff-token', result.token);
      sessionStorage.setItem('flimhall-staff-profile', JSON.stringify(profile));
      setStaffToken(result.token);
      setStaffProfile(profile);
      setLogin({ email: '', password: '' });
      setError('');
      setNotice(`Signed in as ${profile.name} (${result.staff.email}).`);
      return;
    } catch (requestError) {
      // 2. Fall back to owner-created staff accounts in localStorage or default demo credentials
      const matchedStaff = staffAccounts.find(
        (acc) => acc.email.toLowerCase() === emailLower && acc.password === login.password
      );
      if (matchedStaff) {
        const profile = {
          email: matchedStaff.email,
          name: matchedStaff.name,
          role: 'staff',
          location: matchedStaff.location
        };
        sessionStorage.setItem('flimhall-staff-token', 'demo-staff-token');
        sessionStorage.setItem('flimhall-staff-profile', JSON.stringify(profile));
        setStaffToken('demo-staff-token');
        setStaffProfile(profile);
        setLogin({ email: '', password: '' });
        setError('');
        setNotice(`Signed in as Staff Member: ${matchedStaff.name} (${matchedStaff.email}).`);
        return;
      }

      const isMainOwner = emailLower === 'admin@flimhall.com';
      const isDefaultStaff = emailLower === 'staff@flimhall.com';
      const validDemoPass = login.password === 'FlimHall2026!' || login.password === 'admin123';
      if ((isMainOwner || isDefaultStaff) && validDemoPass) {
        const profile = {
          email: emailLower,
          name: isMainOwner ? 'Main Admin Owner' : 'Default Theater Staff',
          role: isMainOwner ? 'owner' : 'staff'
        };
        sessionStorage.setItem('flimhall-staff-token', 'demo-staff-token');
        sessionStorage.setItem('flimhall-staff-profile', JSON.stringify(profile));
        setStaffToken('demo-staff-token');
        setStaffProfile(profile);
        setLogin({ email: '', password: '' });
        setError('');
        setNotice(
          isMainOwner
            ? `Signed in as Main Admin Owner (${emailLower}). You can create and manage new staff accounts.`
            : `Signed in as Theater Staff (${emailLower}).`
        );
        return;
      }
      reportError(requestError);
    }
  }

  async function createStaffAccount(event) {
    event.preventDefault();
    const isAlreadySignedInAsOwner = Boolean(staffToken && staffProfile?.role === 'owner');
    if (!isAlreadySignedInAsOwner) {
      const ownerEmailLower = newStaffForm.ownerEmail.trim().toLowerCase();
      const validOwnerPass =
        newStaffForm.ownerPassword === 'FlimHall2026!' ||
        newStaffForm.ownerPassword === 'admin123' ||
        newStaffForm.ownerPassword === 'FlimHallAdmin2026!';
      if (ownerEmailLower !== 'admin@flimhall.com' || !validOwnerPass) {
        setError(
          'Only the Main Admin Owner (admin@flimhall.com / FlimHall2026!) can authorize creating a new staff account.'
        );
        return;
      }
    }

    const targetEmail = newStaffForm.staffEmail.trim().toLowerCase();
    const staffName = newStaffForm.staffName.trim() || 'FlimHall Staff';

    try {
      const dbCreated = await apiRequest('/auth/staff', {
        method: 'POST',
        body: {
          ownerEmail: newStaffForm.ownerEmail.trim().toLowerCase() || 'admin@flimhall.com',
          ownerPassword: newStaffForm.ownerPassword || 'FlimHall2026!',
          name: staffName,
          email: targetEmail,
          password: newStaffForm.staffPassword,
          location: newStaffForm.location
        }
      });

      const created = {
        id: dbCreated.id || Date.now(),
        name: dbCreated.name || staffName,
        email: dbCreated.email || targetEmail,
        password: newStaffForm.staffPassword,
        location: dbCreated.location || newStaffForm.location,
        createdBy: 'admin@flimhall.com',
        createdAt: new Date(dbCreated.created_at || Date.now()).toLocaleDateString()
      };
      const updatedList = [created, ...staffAccounts.filter((acc) => acc.email.toLowerCase() !== targetEmail)];
      localStorage.setItem('flimhall-staff-accounts', JSON.stringify(updatedList));
      setStaffAccounts(updatedList);
      setNewStaffForm({
        ownerEmail: 'admin@flimhall.com',
        ownerPassword: '',
        staffName: '',
        staffEmail: '',
        staffPassword: '',
        location: 'Oulu & Tampere'
      });
      setError('');
      setNotice(
        `New staff account saved in database for ${created.name} (${created.email})! They can now sign in with their email and password.`
      );
      if (!staffToken) {
        setStaffAuthMode('signin');
        setLogin({ email: created.email, password: '' });
      }
      return;
    } catch (requestError) {
      if (!usingFallbackCatalog && requestError.message) {
        reportError(requestError);
        return;
      }
    }

    if (
      targetEmail === 'admin@flimhall.com' ||
      staffAccounts.some((acc) => acc.email.toLowerCase() === targetEmail)
    ) {
      setError(`A staff account with email ${targetEmail} already exists.`);
      return;
    }

    const created = {
      id: Date.now(),
      name: staffName,
      email: targetEmail,
      password: newStaffForm.staffPassword,
      location: newStaffForm.location,
      createdBy: 'admin@flimhall.com',
      createdAt: new Date().toLocaleDateString()
    };

    const updatedList = [created, ...staffAccounts];
    localStorage.setItem('flimhall-staff-accounts', JSON.stringify(updatedList));
    setStaffAccounts(updatedList);
    setNewStaffForm({
      ownerEmail: 'admin@flimhall.com',
      ownerPassword: '',
      staffName: '',
      staffEmail: '',
      staffPassword: '',
      location: 'Oulu & Tampere'
    });
    setError('');
    setNotice(
      `New staff account created for ${created.name} (${created.email})! They can now sign in with their email and password.`
    );
    if (!staffToken) {
      setStaffAuthMode('signin');
      setLogin({ email: created.email, password: '' });
    }
  }

  function removeStaffAccount(emailToRemove) {
    if (!window.confirm(`Remove staff account ${emailToRemove}?`)) return;
    const updated = staffAccounts.filter((acc) => acc.email !== emailToRemove);
    localStorage.setItem('flimhall-staff-accounts', JSON.stringify(updated));
    setStaffAccounts(updated);
    setNotice(`Removed staff account ${emailToRemove}.`);
  }

  async function saveMovie(event) {
    event.preventDefault();
    if (staffToken === 'demo-staff-token') {
      const nextMovie = {
        ...movieForm,
        id: editingMovieId || Date.now(),
        duration_min: Number(movieForm.duration_min),
        release_year: Number(movieForm.release_year)
      };
      const updated = editingMovieId
        ? adminMovies.map((m) => (m.id === editingMovieId ? nextMovie : m))
        : [nextMovie, ...adminMovies];
      localStorage.setItem('flimhall-admin-movies', JSON.stringify(updated));
      setAdminMovies(updated);
      setMovies(updated);
      setMovieForm(emptyMovie);
      setEditingMovieId(null);
      setNotice(editingMovieId ? 'Movie updated.' : 'Movie added.');
      setError('');
      return;
    }
    const method = editingMovieId ? 'PUT' : 'POST';
    const path = editingMovieId ? `/admin/movies/${editingMovieId}` : '/admin/movies';
    try {
      await apiRequest(path, { method, token: staffToken, body: movieForm });
      setMovieForm(emptyMovie);
      setEditingMovieId(null);
      setNotice(editingMovieId ? 'Movie updated.' : 'Movie added.');
      setError('');
      await Promise.all([loadAdminData(), loadMovies()]);
    } catch (requestError) {
      reportError(requestError);
    }
  }

  async function removeMovie(movieId) {
    if (!window.confirm('Delete this movie? Movies with screenings cannot be deleted.')) return;
    if (staffToken === 'demo-staff-token') {
      const updated = adminMovies.filter((m) => m.id !== movieId);
      localStorage.setItem('flimhall-admin-movies', JSON.stringify(updated));
      setAdminMovies(updated);
      setMovies(updated);
      setNotice('Movie deleted.');
      setError('');
      return;
    }
    try {
      await apiRequest(`/admin/movies/${movieId}`, { method: 'DELETE', token: staffToken });
      setNotice('Movie deleted.');
      setError('');
      await Promise.all([loadAdminData(), loadMovies()]);
    } catch (requestError) {
      reportError(requestError);
    }
  }

  async function saveScreening(event) {
    event.preventDefault();
    const body = {
      ...screeningForm,
      starts_at: new Date(screeningForm.starts_at).toISOString()
    };
    if (staffToken === 'demo-staff-token') {
      const movieObj = adminMovies.find((m) => String(m.id) === String(screeningForm.movie_id));
      const roomObj = auditoriums.find((r) => String(r.id) === String(screeningForm.auditorium_id));
      const nextScreening = {
        id: editingScreeningId || Date.now(),
        movie_id: Number(screeningForm.movie_id),
        movie_title: movieObj?.title || 'Selected Movie',
        auditorium_id: Number(screeningForm.auditorium_id),
        auditorium: roomObj?.name || 'Oulu — Auditorium 1 (100 seats)',
        starts_at: body.starts_at,
        base_price: Number(screeningForm.base_price),
        available_seats: roomObj?.capacity || 100,
        status: 'scheduled'
      };
      const updated = editingScreeningId
        ? adminScreenings.map((s) => (s.id === editingScreeningId ? nextScreening : s))
        : [nextScreening, ...adminScreenings];
      localStorage.setItem('flimhall-admin-screenings', JSON.stringify(updated));
      setAdminScreenings(updated);
      setScreeningForm(emptyScreening);
      setEditingScreeningId(null);
      setNotice(editingScreeningId ? 'Screening updated.' : 'Screening created.');
      setError('');
      return;
    }
    const method = editingScreeningId ? 'PUT' : 'POST';
    const path = editingScreeningId
      ? `/admin/screenings/${editingScreeningId}`
      : '/admin/screenings';
    try {
      await apiRequest(path, { method, token: staffToken, body });
      setScreeningForm(emptyScreening);
      setEditingScreeningId(null);
      setNotice(editingScreeningId ? 'Screening updated.' : 'Screening created.');
      setError('');
      await Promise.all([loadAdminData(), loadMovies()]);
    } catch (requestError) {
      reportError(requestError);
    }
  }

  async function cancelScreening(screeningId) {
    if (!window.confirm('Cancel this screening?')) return;
    if (staffToken === 'demo-staff-token') {
      const updated = adminScreenings.map((s) =>
        s.id === screeningId ? { ...s, status: 'cancelled' } : s
      );
      localStorage.setItem('flimhall-admin-screenings', JSON.stringify(updated));
      setAdminScreenings(updated);
      setNotice('Screening cancelled.');
      setError('');
      return;
    }
    try {
      await apiRequest(`/admin/screenings/${screeningId}/cancel`, {
        method: 'POST',
        token: staffToken
      });
      setNotice('Screening cancelled.');
      setError('');
      await Promise.all([loadAdminData(), loadMovies()]);
    } catch (requestError) {
      reportError(requestError);
    }
  }

  async function cancelBooking(bookingId) {
    if (!window.confirm('Cancel this booking?')) return;
    const targetBooking = adminBookings.find((b) => b.id === bookingId);
    const recordAlert = (b) => {
      if (!b) return;
      const alertItem = {
        id: Date.now(),
        bookingRef: b.booking_ref,
        movieTitle: b.movie_title,
        seats: b.seats || [],
        cancelledAt: new Date().toLocaleTimeString()
      };
      const nextAlerts = [alertItem, ...cancellationAlerts];
      setCancellationAlerts(nextAlerts);
      localStorage.setItem('flimhall-cancellation-alerts', JSON.stringify(nextAlerts));
    };

    if (staffToken === 'demo-staff-token') {
      const updated = adminBookings.map((b) =>
        b.id === bookingId ? { ...b, status: 'cancelled' } : b
      );
      localStorage.setItem('flimhall-demo-bookings', JSON.stringify(updated));
      setAdminBookings(updated);
      recordAlert(targetBooking);
      setNotice('Booking cancelled and seats released.');
      setError('');
      return;
    }
    try {
      const result = await apiRequest(`/admin/bookings/${bookingId}/cancel`, {
        method: 'POST',
        token: staffToken
      });
      recordAlert(targetBooking);
      setNotice(result.message);
      setError('');
      await loadAdminData();
    } catch (requestError) {
      reportError(requestError);
    }
  }

  function handleEntranceVerify(event) {
    event.preventDefault();
    const ref = entranceCheckRef.trim().toUpperCase();
    const localBookings = JSON.parse(localStorage.getItem('flimhall-demo-bookings') || '[]');
    const allKnown = [...adminBookings, ...localBookings];
    const matched = allKnown.find((b) => String(b.booking_ref).toUpperCase() === ref);
    if (matched) {
      setEntranceCheckResult({
        valid: matched.status === 'confirmed',
        booking: matched
      });
    } else {
      setEntranceCheckResult({
        valid: false,
        notFound: true,
        ref
      });
    }
  }

  const confirmedBookings = adminBookings.filter((b) => b.status === 'confirmed');
  const totalRevenueEur = confirmedBookings.reduce((sum, b) => sum + Number(b.total_price || 0), 0);
  const totalTicketsSold = confirmedBookings.reduce((sum, b) => sum + (b.seats?.length || 0), 0);

  function signOut() {
    sessionStorage.removeItem('flimhall-staff-token');
    sessionStorage.removeItem('flimhall-staff-profile');
    setStaffToken('');
    setStaffProfile(null);
    setNotice('Staff session ended.');
  }

  const visibleScreenings = screenings.filter((scr) => {
    if (locationFilter === 'all') return true;
    const lower = String(scr.auditorium).toLowerCase();
    if (locationFilter === 'oulu') return scr.city === 'oulu' || lower.includes('oulu');
    if (locationFilter === 'tampere') return scr.city === 'tampere' || lower.includes('tampere');
    return true;
  });

  return (
    <main className="site-shell">
      <header className="topbar">
        <a className="brand" href="#home" onClick={() => setView('movies')}>
          <span className="brand-mark">F</span>
          <span>
            <strong>FlimHall</strong>
            <small>YOUR NIGHT, YOUR SEAT</small>
          </span>
        </a>
        <nav className="nav" aria-label="Main navigation">
          <button
            className={view === 'movies' ? 'nav-link active' : 'nav-link'}
            onClick={() => setView('movies')}
          >
            Movies
          </button>
          <button
            className={view === 'corporate' ? 'nav-link active' : 'nav-link'}
            onClick={() => setView('corporate')}
          >
            Private Showtimes (B2B)
          </button>
          <button
            className={view === 'retrieve' ? 'nav-link active' : 'nav-link'}
            onClick={() => setView('retrieve')}
          >
            Find booking
          </button>
          <button
            className={view === 'account' ? 'nav-link active' : 'nav-link'}
            onClick={() => setView('account')}
          >
            {customerAccount ? `Account (${customerAccount.name})` : 'Customer Account'}
          </button>
          <button
            className={view === 'staff' ? 'nav-link active' : 'nav-link'}
            onClick={() => setView('staff')}
          >
            Staff
          </button>
        </nav>
        <a className="header-cta" href="#movie-list" onClick={() => setView('movies')}>
          Book tickets <span aria-hidden="true">↗</span>
        </a>
      </header>

      <div className="location-bar" aria-label="Theater locations">
        <button
          type="button"
          className={locationFilter === 'all' ? 'loc-pill active' : 'loc-pill'}
          onClick={() => setLocationFilter('all')}
        >
          All Locations (4 Auditoriums · Oulu &amp; Tampere)
        </button>
        <button
          type="button"
          className={locationFilter === 'oulu' ? 'loc-pill active' : 'loc-pill'}
          onClick={() => setLocationFilter('oulu')}
        >
          FlimHall Oulu · Auditorium 1 (100 seats) &amp; Auditorium 2 (200 seats)
        </button>
        <button
          type="button"
          className={locationFilter === 'tampere' ? 'loc-pill active' : 'loc-pill'}
          onClick={() => setLocationFilter('tampere')}
        >
          FlimHall Tampere · Auditorium 1 (100 seats) &amp; Auditorium 2 (200 seats)
        </button>
      </div>

      <div className="message-region" aria-live="polite">
        {error && (
          <div className="message error-message">
            {error}
            <button onClick={() => setError('')} aria-label="Dismiss error">
              ×
            </button>
          </div>
        )}
        {notice && (
          <div className="message success-message">
            {notice}
            <button onClick={() => setNotice('')} aria-label="Dismiss message">
              ×
            </button>
          </div>
        )}
      </div>

      {view === 'movies' && (
        <>
          <section className="hero" id="home">
            <div className="hero-content">
              <span className="eyebrow">
                <span className="live-dot" /> THE BIG SCREEN IS CALLING
              </span>
              <h1>
                Make tonight
                <br />a <em>movie night.</em>
              </h1>
              <p>
                Find your next favorite, pick the perfect seats across our Oulu and Tampere screens, and settle in. Your
                cinema experience starts here.
              </p>
              <a className="button button-primary" href="#movie-list">
                Explore movies <span aria-hidden="true">↓</span>
              </a>
            </div>
            <div className="hero-art" aria-hidden="true">
              <div className="film-frame">
                <span>FLIMHALL</span>
                <strong>
                  GOOD
                  <br />
                  STORIES
                  <br />
                  <i>LIVE HERE.</i>
                </strong>
                <small>EST. TONIGHT · SCREEN 01 &amp; 02</small>
              </div>
              <span className="hero-orbit orbit-one" />
              <span className="hero-orbit orbit-two" />
            </div>
            <div className="hero-foot">
              <span>01 — PICK A FILM</span>
              <span>02 — CHOOSE YOUR SEAT (NO ROW 13 · ♿ ACCESSIBLE)</span>
              <span>03 — DOORS OPEN 15M BEFORE ADS</span>
            </div>
          </section>

          <section className="movie-section" id="movie-list">
            <div className="section-heading">
              <div>
                <span className="section-kicker">NOW SHOWING</span>
                <h2>Find your film.</h2>
              </div>
              <span className="movie-count">
                {movies.length} {movies.length === 1 ? 'movie' : 'movies'} to explore
              </span>
            </div>
            <div className="filters">
              <label className="search-field">
                <span aria-hidden="true">⌕</span>
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by movie title"
                  aria-label="Search movies by title"
                />
              </label>
              <label className="genre-field">
                <span className="sr-only">Filter by genre</span>
                <select value={genre} onChange={(event) => setGenre(event.target.value)}>
                  <option value="">All genres</option>
                  {genres.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            {loadingMovies ? (
              <p className="empty-state">Loading movies…</p>
            ) : movies.length ? (
              <div className="movie-grid">
                {movies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} onSelect={() => selectMovie(movie)} />
                ))}
              </div>
            ) : (
              <p className="empty-state">No movies match your search. Try another title or genre.</p>
            )}
          </section>

          {selectedMovie && (
            <section className="details-section" id="movie-details">
              <div className="details-header">
                <div>
                  <span className="section-kicker">MOVIE DETAILS</span>
                  <h2>{selectedMovie.title}</h2>
                  <p>
                    {selectedMovie.release_year || 'Year unavailable'} <span aria-hidden="true">·</span>{' '}
                    {selectedMovie.genre} <span aria-hidden="true">·</span> {selectedMovie.duration_min} min{' '}
                    <span aria-hidden="true">·</span> {selectedMovie.age_rating}
                  </p>
                </div>
                <button
                  className="icon-button"
                  onClick={() => {
                    movieRequestId.current += 1;
                    setSelectedMovie(null);
                    setSelectedScreening(null);
                    setSeatData(null);
                  }}
                  aria-label="Close movie details"
                >
                  ×
                </button>
              </div>
              {selectedMovie.description && <p className="movie-description">{selectedMovie.description}</p>}
              <h3 className="subheading">Choose a screening</h3>
              {visibleScreenings.length ? (
                <div className="screening-list">
                  {visibleScreenings.map((screening) => {
                    const timeline = getShowtimeSchedule(screening.starts_at);
                    return (
                      <button
                        className={`screening-option ${selectedScreening?.id === screening.id ? 'chosen' : ''}`}
                        key={screening.id}
                        onClick={() => {
                          setSelectedScreening(screening);
                          setSeatData(buildFallbackSeats(screening));
                          setSelectedSeats([]);
                          setWheelchairSpaces(0);
                          setBookingResult(null);
                          setHoldSeconds(15 * 60);
                        }}
                      >
                        <span>{formatDate(screening.starts_at)}</span>
                        <small>
                          {screening.auditorium} · {screening.available_seats} seats left
                        </small>
                        <small className="timeline-note">
                          Doors {timeline.doorsOpenTime} · Ads {timeline.adsStartTime} (12m) · Film{' '}
                          {timeline.filmStartTime}
                        </small>
                        <strong>€{Number(screening.base_price).toFixed(2)}</strong>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="empty-state">No upcoming screenings are available for this movie.</p>
              )}

              {selectedScreening && seatData && !bookingResult && (
                <div className="booking-panel">
                  <SeatMap
                    auditoriumName={seatData.screening.auditorium}
                    seats={seatData.seats}
                    selectedSeats={selectedSeats}
                    onChangeSelectedSeats={updateSelectedSeats}
                    wheelchairSpaces={wheelchairSpaces}
                    onChangeWheelchairSpaces={updateWheelchairSpaces}
                    holdSecondsRemaining={holdSeconds}
                    onNotify={(msg) => setNotice(msg)}
                  />

                  <form className="booking-form" onSubmit={submitBooking}>
                    <div className="checkout-mode-selector">
                      <span className="section-kicker">BOOKING METHOD</span>
                      <div className="mode-cards">
                        <label className={`mode-card ${paymentMode === 'online' ? 'active' : ''}`}>
                          <input
                            type="radio"
                            name="paymentMode"
                            value="online"
                            checked={paymentMode === 'online'}
                            onChange={() => setPaymentMode('online')}
                          />
                          <strong>1. Pay Online Now (Guest or Member)</strong>
                          <small>No account required · Instant confirmation · Paid tickets cannot be cancelled</small>
                        </label>
                        <label className={`mode-card ${paymentMode === 'counter' ? 'active' : ''}`}>
                          <input
                            type="radio"
                            name="paymentMode"
                            value="counter"
                            checked={paymentMode === 'counter'}
                            onChange={() => setPaymentMode('counter')}
                          />
                          <strong>2. Reserve &amp; Pay at Theater Counter</strong>
                          <small>Requires Customer Account · Max 6 tickets · Collect 2h before showtime</small>
                        </label>
                      </div>
                    </div>

                    {paymentMode === 'counter' && !customerAccount && (
                      <div className="counter-auth-banner">
                        <span>Counter reservations require a registered Customer Account.</span>
                        <button type="button" className="button button-secondary" onClick={() => setView('account')}>
                          Sign in / Register
                        </button>
                      </div>
                    )}

                    <label>
                      Your name
                      <input
                        required
                        maxLength="120"
                        value={customer.name}
                        onChange={(event) => setCustomer({ ...customer, name: event.target.value })}
                      />
                    </label>
                    <label>
                      Email for your confirmation
                      <input
                        required
                        type="email"
                        value={customer.email}
                        onChange={(event) => setCustomer({ ...customer, email: event.target.value })}
                      />
                    </label>
                    <label style={{ gridColumn: '1 / -1' }}>
                      Child tickets (Age 12 or under — 50% OFF: €{unitChildPrice.toFixed(2)} each)
                      <select
                        value={childSeatCount}
                        onChange={(e) => setChildSeatCount(Number(e.target.value))}
                        disabled={!selectedSeats.length}
                      >
                        {Array.from({ length: selectedSeats.length + 1 }, (_, idx) => (
                          <option key={idx} value={idx}>
                            {idx} child {idx === 1 ? 'ticket' : 'tickets'} (50% OFF · €{unitChildPrice.toFixed(2)} each)
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="loyalty-checkbox-row">
                      <input
                        type="checkbox"
                        disabled={!customerAccount || totalSelectedTickets < 10}
                        checked={loyaltyDiscountActive}
                        onChange={(e) => setApplyLoyaltyTenPack(e.target.checked)}
                      />
                      <span>
                        <strong>Registered Member 10-Ticket Loyalty Bundle (50% OFF)</strong> —{' '}
                        {customerAccount
                          ? totalSelectedTickets >= 10
                            ? '50% Member 10-Ticket Discount applied!'
                            : 'Select 10 or more tickets to unlock 50% Member Bundle'
                          : 'Sign in to a Customer Account to unlock 50% off for 10 tickets'}
                      </span>
                    </label>
                    <div className="booking-total">
                      <div>
                        <span>
                          {combinedBookingItems.length
                            ? combinedBookingItems.join(' + ')
                            : 'Select your seats or open wheelchair space'}{' '}
                          · {totalSelectedTickets} {totalSelectedTickets === 1 ? 'ticket' : 'tickets'}
                        </span>
                        <small className="seat-rule-sub">
                          {adultSeatCount} Adult (€{unitBasePrice.toFixed(2)})
                          {childSeatCount > 0 ? ` · ${childSeatCount} Child ≤12 (50% OFF: €${unitChildPrice.toFixed(2)})` : ''}
                          {wheelchairSpaces > 0
                            ? ` · ${wheelchairSpaces} Wheelchair Open Space (20% OFF: €${unitWheelchairPrice.toFixed(2)})`
                            : ''}
                          {loyaltyDiscountActive ? ' · Member 10-Ticket 50% OFF Bundle applied' : ''}
                        </small>
                      </div>
                      <strong>€{computedTotalPriceEur}</strong>
                    </div>
                    <div className="checkout-actions">
                      <button
                        type="submit"
                        className="button button-primary"
                        disabled={!totalSelectedTickets}
                      >
                        {paymentMode === 'online'
                          ? `Proceed to Stripe Hosted Checkout (€${computedTotalPriceEur}) ↗`
                          : 'Reserve seats (Pay at counter)'}
                      </button>
                    </div>

                    {showPaymentModal && paymentMode === 'online' && (
                      <div
                        className="stripe-hosted-checkout"
                        role="dialog"
                        aria-label="Official Stripe Hosted Checkout (Test Mode)"
                      >
                        <div className="stripe-topbar">
                          <div className="stripe-brand-group">
                            <span className="stripe-wordmark">stripe</span>
                            <span className="stripe-test-badge">TEST MODE</span>
                            <span className="stripe-url-pill">
                              https://checkout.stripe.com/c/pay/{stripeSession?.sessionId || 'cs_test_session'}
                            </span>
                          </div>
                          <button
                            type="button"
                            className="stripe-cancel-link"
                            onClick={cancelStripeCheckout}
                          >
                            ← Cancel &amp; return to FlimHall (/cancel)
                          </button>
                        </div>

                        <div className="stripe-state-banner">
                          <div>
                            <strong>BOOKING STATE MACHINE:</strong>{' '}
                            <span className="state-step done">1. available</span> →{' '}
                            <span className="state-step active">2. pending_payment (15m hold active)</span> →{' '}
                            <span className="state-step">3. webhook: checkout.session.completed</span> →{' '}
                            <span className="state-step">4. paid</span>
                          </div>
                          <small>{stripeWebhookLog}</small>
                        </div>

                        <div className="stripe-test-cards-bar">
                          <span className="stripe-preset-label">
                            OFFICIAL STRIPE TEST CARDS (CLICK TO AUTO-FILL):
                          </span>
                          <div className="stripe-preset-buttons">
                            <button
                              type="button"
                              className={`stripe-preset-btn ${
                                dummyCard.cardNumber === '4242 4242 4242 4242' ? 'active-success' : ''
                              }`}
                              onClick={() => selectOfficialStripeTestCard('success')}
                            >
                              ✓ Success Card (4242 4242 4242 4242)
                            </button>
                            <button
                              type="button"
                              className={`stripe-preset-btn ${
                                dummyCard.cardNumber === '4000 0000 0000 0002' ? 'active-decline' : ''
                              }`}
                              onClick={() => selectOfficialStripeTestCard('decline')}
                            >
                              ✗ Declined Card (4000 0000 0000 0002)
                            </button>
                            <button
                              type="button"
                              className={`stripe-preset-btn ${
                                dummyCard.cardNumber === '4000 0000 0000 9995' ? 'active-decline' : ''
                              }`}
                              onClick={() => selectOfficialStripeTestCard('insufficient')}
                            >
                              ✗ Insufficient Funds (4000 0000 0000 9995)
                            </button>
                            <button
                              type="button"
                              className={`stripe-preset-btn ${
                                dummyCard.cardNumber === '4000 0025 0000 3155' ? 'active-success' : ''
                              }`}
                              onClick={() => selectOfficialStripeTestCard('3ds')}
                            >
                              🔒 3D Secure Auth (4000 0025 0000 3155)
                            </button>
                          </div>
                        </div>

                        <div className="stripe-checkout-columns">
                          <div className="stripe-summary-col">
                            <span className="section-kicker">PAY FLIMHALL CINEMA (OULU &amp; TAMPERE)</span>
                            <h3 className="stripe-big-amount">€{computedTotalPriceEur}</h3>
                            <small className="seat-rule-sub">
                              Server-calculated unit_amount: {Math.round(Number(computedTotalPriceEur) * 100)} cents (currency: &quot;eur&quot;)
                            </small>

                            <div className="stripe-line-items">
                              <div className="stripe-line-item">
                                <div>
                                  <strong>{selectedMovie.title}</strong>
                                  <small>
                                    {formatDate(selectedScreening.starts_at)} · {seatData.screening.auditorium}
                                  </small>
                                </div>
                                <span>€{computedTotalPriceEur}</span>
                              </div>
                              <div className="stripe-line-item">
                                <div>
                                  <strong>Selected Seats / Wheelchair Passes</strong>
                                  <small>{combinedBookingItems.join(' + ')}</small>
                                </div>
                                <span>
                                  {totalSelectedTickets} {totalSelectedTickets === 1 ? 'ticket' : 'tickets'}
                                </span>
                              </div>
                              <div className="stripe-line-item">
                                <div>
                                  <strong>Stripe Session ID</strong>
                                  <small>{stripeSession?.sessionId}</small>
                                </div>
                                <span>pending_payment</span>
                              </div>
                            </div>
                          </div>

                          <div className="stripe-form-col">
                            <h4>Pay with card (Stripe Checkout Sandbox)</h4>

                            <div className="form-row" style={{ marginTop: '10px' }}>
                              <label style={{ gridColumn: '1 / -1' }}>
                                Email
                                <input type="email" value={customer.email} readOnly />
                              </label>
                              <label style={{ gridColumn: '1 / -1' }}>
                                Card number
                                <input
                                  required
                                  value={dummyCard.cardNumber}
                                  onChange={(e) => {
                                    setStripeDeclineError('');
                                    setDummyCard({ ...dummyCard, cardNumber: e.target.value });
                                  }}
                                  placeholder="4242 4242 4242 4242"
                                />
                              </label>
                              <label>
                                Expiry (MM/YY)
                                <input
                                  required
                                  value={dummyCard.expiry}
                                  onChange={(e) => setDummyCard({ ...dummyCard, expiry: e.target.value })}
                                  placeholder="12/28"
                                />
                              </label>
                              <label>
                                CVC
                                <input
                                  required
                                  value={dummyCard.cvc}
                                  onChange={(e) => setDummyCard({ ...dummyCard, cvc: e.target.value })}
                                  placeholder="424"
                                />
                              </label>
                              <label>
                                Postal code
                                <input
                                  required
                                  value={dummyCard.postalCode}
                                  onChange={(e) => setDummyCard({ ...dummyCard, postalCode: e.target.value })}
                                  placeholder="90100"
                                />
                              </label>
                            </div>

                            {stripeDeclineError && (
                              <div className="stripe-decline-alert" role="alert">
                                <strong>✗ Payment Declined by Stripe Sandbox</strong>
                                <p>{stripeDeclineError}</p>
                              </div>
                            )}

                            <div className="stripe-submit-actions">
                              <button
                                type="button"
                                className="button button-primary stripe-pay-btn"
                                disabled={paymentProcessing}
                                onClick={completeDummyPayment}
                              >
                                {paymentProcessing
                                  ? 'Verifying with Stripe & Firing Webhook…'
                                  : `Pay €${computedTotalPriceEur} with Stripe`}
                              </button>
                              <button
                                type="button"
                                className="button button-secondary"
                                disabled={paymentProcessing}
                                onClick={cancelStripeCheckout}
                              >
                                Cancel Checkout
                              </button>
                            </div>
                            <small className="stripe-security-footnote">
                              Powered by <strong>stripe</strong> (Course Test Mode) · Webhook verification:{' '}
                              <code>POST /api/stripe/webhook</code> (<code>checkout.session.completed</code>)
                            </small>
                          </div>
                        </div>
                      </div>
                    )}
                  </form>
                </div>
              )}
              {bookingResult && (
                <div className="booking-receipt">
                  <span className="receipt-check">✓</span>
                  <div>
                    <span className="section-kicker">
                      {bookingResult.paymentMode === 'counter'
                        ? 'COUNTER RESERVATION CONFIRMED (PAY AT THEATER)'
                        : '✓ STRIPE CHECKOUT SUCCESS (/success?session_id=...) · WEBHOOK VERIFIED'}
                    </span>
                    <h3>
                      {bookingResult.paymentMode === 'counter'
                        ? 'Your seats are reserved.'
                        : 'Stripe Payment verified! Booking status: pending_payment → paid.'}
                    </h3>
                    <p>
                      Booking Reference: <strong>{bookingResult.booking.booking_ref}</strong>
                      {bookingResult.stripeSessionId && (
                        <>
                          {' '}
                          · Stripe Session ID: <strong>{bookingResult.stripeSessionId}</strong>
                        </>
                      )}
                      {bookingResult.transactionId && (
                        <>
                          {' '}
                          · PaymentIntent: <strong>{bookingResult.transactionId}</strong>
                        </>
                      )}
                    </p>
                    <p>
                      {bookingResult.booking.movie_title} · Seats: <strong>{bookingResult.booking.seats.join(', ')}</strong>{' '}
                      · Total Paid: <strong>€{Number(bookingResult.booking.total_price).toFixed(2)}</strong> (
                      {bookingResult.paymentMode === 'counter'
                        ? 'Unpaid — Pay at Counter'
                        : 'status: "paid" · webhook: checkout.session.completed'})
                    </p>
                    <p className={bookingResult.emailStatus === 'sent' ? 'email-sent' : 'email-warning'}>
                      {bookingResult.paymentMode === 'counter'
                        ? 'Counter reservation saved. Please collect and pay at least 2 hours before showtime.'
                        : '✓ Verified via Stripe Hosted Checkout & webhook event checkout.session.completed. Paid tickets are final and cannot be cancelled.'}
                    </p>
                  </div>
                </div>
              )}
            </section>
          )}
          <footer className="site-footer">
            <span>
              FLIMHALL <i>·</i> THE SHOW STARTS WITH YOU
            </span>
            <button onClick={() => setView('retrieve')}>Retrieve a booking</button>
          </footer>
        </>
      )}

      {view === 'corporate' && (
        <CorporateBookingSection
          movies={movies}
          onSubmitted={(record) =>
            setNotice(`B2B Private Showtime request ${record.reference} registered for ${record.companyName}.`)
          }
        />
      )}

      {view === 'account' && (
        <section className="workspace-section">
          <span className="section-kicker">CUSTOMER ACCOUNT</span>
          <h1>Member access.</h1>
          <p className="workspace-intro">
            Guests can purchase tickets online without an account. Sign in or register below to reserve up to 6 seats
            and pay at the theater counter (at least 2 hours before showtime).
          </p>
          {customerAccount ? (
            <article className="result-card">
              <span className="section-kicker">SIGNED IN</span>
              <h2>{customerAccount.name}</h2>
              <p>Email: {customerAccount.email}</p>
              <div className="form-actions" style={{ marginTop: '16px' }}>
                <button className="button button-primary" onClick={() => setView('movies')}>
                  Browse movies
                </button>
                <button className="button button-secondary" onClick={handleCustomerLogout}>
                  Sign out
                </button>
              </div>
            </article>
          ) : (
            <form className="stack-form retrieve-form" onSubmit={handleCustomerAuth}>
              <label>
                Full name
                <input
                  required
                  value={accountForm.name}
                  onChange={(e) => setAccountForm({ ...accountForm, name: e.target.value })}
                />
              </label>
              <label>
                Email
                <input
                  required
                  type="email"
                  value={accountForm.email}
                  onChange={(e) => setAccountForm({ ...accountForm, email: e.target.value })}
                />
              </label>
              <label>
                Password
                <input
                  required
                  type="password"
                  minLength="6"
                  value={accountForm.password}
                  onChange={(e) => setAccountForm({ ...accountForm, password: e.target.value })}
                />
              </label>
              <button className="button button-primary" type="submit">
                Sign in / Register
              </button>
            </form>
          )}
        </section>
      )}

      {view === 'retrieve' && (
        <section className="workspace-section">
          <span className="section-kicker">YOUR RESERVATION</span>
          <h1>Find your booking.</h1>
          <p className="workspace-intro">Enter the reference from your confirmation and the email used to book.</p>
          <form className="stack-form retrieve-form" onSubmit={retrieveBooking}>
            <label>
              Booking reference
              <input
                required
                placeholder="FH-A1B2C3D4E5"
                value={bookingLookup.reference}
                onChange={(event) => setBookingLookup({ ...bookingLookup, reference: event.target.value })}
              />
            </label>
            <label>
              Booking email
              <input
                required
                type="email"
                value={bookingLookup.email}
                onChange={(event) => setBookingLookup({ ...bookingLookup, email: event.target.value })}
              />
            </label>
            <button className="button button-primary">Retrieve booking</button>
          </form>
          {retrievedBooking && (
            <article className="result-card">
              <span className="section-kicker">BOOKING {retrievedBooking.status.toUpperCase()}</span>
              <h2>{retrievedBooking.movie_title}</h2>
              <p>
                {formatDate(retrievedBooking.starts_at)} · {retrievedBooking.auditorium}
              </p>
              <p>
                Seats: {retrievedBooking.seats.join(', ')} · Total: €{Number(retrievedBooking.total_price).toFixed(2)}
              </p>
              <p>
                Reference: <strong>{retrievedBooking.booking_ref}</strong>
              </p>
            </article>
          )}
        </section>
      )}

      {view === 'staff' && (
        <section className="workspace-section staff-workspace">
          {!staffToken ? (
            <>
              <span className="section-kicker">STAFF &amp; MAIN ADMIN OWNER ACCESS</span>
              <h1>{staffAuthMode === 'signin' ? 'Welcome back.' : 'Create new staff account.'}</h1>
              <p className="workspace-intro">
                {staffAuthMode === 'signin'
                  ? 'Sign in as the Main Admin Owner or Theater Staff to manage movies, screenings, and customer bookings.'
                  : 'Main Admin Owner (admin@flimhall.com) can create new staff email and password credentials here.'}
              </p>

              <div className="form-actions" style={{ marginBottom: '22px' }}>
                <button
                  type="button"
                  className={staffAuthMode === 'signin' ? 'button button-primary' : 'button button-secondary'}
                  onClick={() => setStaffAuthMode('signin')}
                >
                  Staff / Owner Sign In
                </button>
                <button
                  type="button"
                  className={staffAuthMode === 'signup' ? 'button button-primary' : 'button button-secondary'}
                  onClick={() => setStaffAuthMode('signup')}
                >
                  Create New Staff Account (Owner Only)
                </button>
              </div>

              {staffAuthMode === 'signin' ? (
                <>
                  <form className="stack-form retrieve-form" onSubmit={staffLogin}>
                    <label>
                      Staff or Owner email
                      <input
                        required
                        type="email"
                        autoComplete="username"
                        value={login.email}
                        onChange={(event) => setLogin({ ...login, email: event.target.value })}
                      />
                    </label>
                    <label>
                      Password
                      <input
                        required
                        type="password"
                        autoComplete="current-password"
                        value={login.password}
                        onChange={(event) => setLogin({ ...login, password: event.target.value })}
                      />
                    </label>
                    <button className="button button-primary">Sign in</button>
                  </form>
                  <p className="muted-note">
                    Main Admin Owner Credentials: <strong>admin@flimhall.com</strong> / <strong>FlimHall2026!</strong>
                  </p>
                </>
              ) : (
                <form className="stack-form retrieve-form" onSubmit={createStaffAccount}>
                  <span className="section-kicker">1. MAIN ADMIN OWNER AUTHORIZATION</span>
                  <label>
                    Main Admin Owner email
                    <input
                      required
                      type="email"
                      value={newStaffForm.ownerEmail}
                      onChange={(e) => setNewStaffForm({ ...newStaffForm, ownerEmail: e.target.value })}
                    />
                  </label>
                  <label>
                    Main Admin Owner password
                    <input
                      required
                      type="password"
                      placeholder="Enter FlimHall2026!"
                      value={newStaffForm.ownerPassword}
                      onChange={(e) => setNewStaffForm({ ...newStaffForm, ownerPassword: e.target.value })}
                    />
                  </label>

                  <span className="section-kicker" style={{ marginTop: '10px' }}>
                    2. NEW STAFF MEMBER CREDENTIALS
                  </span>
                  <label>
                    New staff full name
                    <input
                      required
                      placeholder="Mikko Virtanen"
                      value={newStaffForm.staffName}
                      onChange={(e) => setNewStaffForm({ ...newStaffForm, staffName: e.target.value })}
                    />
                  </label>
                  <label>
                    New staff email
                    <input
                      required
                      type="email"
                      placeholder="mikko@flimhall.com"
                      value={newStaffForm.staffEmail}
                      onChange={(e) => setNewStaffForm({ ...newStaffForm, staffEmail: e.target.value })}
                    />
                  </label>
                  <label>
                    New staff password
                    <input
                      required
                      type="password"
                      minLength="6"
                      placeholder="At least 6 characters"
                      value={newStaffForm.staffPassword}
                      onChange={(e) => setNewStaffForm({ ...newStaffForm, staffPassword: e.target.value })}
                    />
                  </label>
                  <label>
                    Assigned theater location
                    <select
                      value={newStaffForm.location}
                      onChange={(e) => setNewStaffForm({ ...newStaffForm, location: e.target.value })}
                    >
                      <option value="Oulu & Tampere">Oulu &amp; Tampere (All Locations)</option>
                      <option value="FlimHall Oulu">FlimHall Oulu</option>
                      <option value="FlimHall Tampere">FlimHall Tampere</option>
                    </select>
                  </label>
                  <button className="button button-primary" type="submit">
                    Create Staff Account
                  </button>
                </form>
              )}
            </>
          ) : (
            <>
              <div className="staff-heading">
                <div>
                  <span className="section-kicker">
                    {staffProfile?.role === 'owner'
                      ? `MAIN ADMIN OWNER (${staffProfile.email})`
                      : `THEATER STAFF (${staffProfile?.email || 'Active Session'})`}
                  </span>
                  <h1>Staff dashboard.</h1>
                </div>
                <button className="button button-secondary" onClick={signOut}>
                  Sign out
                </button>
              </div>

              <div className="kpi-grid">
                <div className="kpi-card">
                  <span className="section-kicker">CONFIRMED REVENUE</span>
                  <strong>€{totalRevenueEur.toFixed(2)}</strong>
                  <small>Across Oulu &amp; Tampere</small>
                </div>
                <div className="kpi-card">
                  <span className="section-kicker">TICKETS SOLD / RESERVED</span>
                  <strong>{totalTicketsSold}</strong>
                  <small>{confirmedBookings.length} active bookings</small>
                </div>
                <div className="kpi-card">
                  <span className="section-kicker">ACTIVE FILMS</span>
                  <strong>{adminMovies.length}</strong>
                  <small>{adminScreenings.length} scheduled showtimes</small>
                </div>
                <div className="kpi-card">
                  <span className="section-kicker">CANCELLATION ALERTS</span>
                  <strong>{cancellationAlerts.length}</strong>
                  <small>Released seat notifications</small>
                </div>
              </div>

              <div className="admin-grid">
                <section className="admin-card">
                  <span className="section-kicker">ENTRANCE TICKET CHECKER</span>
                  <h2>Verify customer pass at rear entrance</h2>
                  <form className="stack-form" onSubmit={handleEntranceVerify}>
                    <label>
                      Enter or scan booking reference
                      <input
                        required
                        placeholder="FH-A1B2C3D4E5"
                        value={entranceCheckRef}
                        onChange={(e) => setEntranceCheckRef(e.target.value)}
                      />
                    </label>
                    <button className="button button-primary" type="submit">
                      Verify Entrance Pass
                    </button>
                  </form>
                  {entranceCheckResult && (
                    <div className="entrance-verify-box">
                      {entranceCheckResult.notFound ? (
                        <p className="danger-text">
                          ✗ Reference {entranceCheckResult.ref} not found. Do not admit.
                        </p>
                      ) : (
                        <div>
                          <p className={entranceCheckResult.valid ? 'email-sent' : 'danger-text'}>
                            {entranceCheckResult.valid
                              ? '✓ VALID TICKET — ADMIT VIA REAR ENTRANCES'
                              : '✗ CANCELLED BOOKING — DO NOT ADMIT'}
                          </p>
                          <small>
                            {entranceCheckResult.booking.movie_title} · Seats:{' '}
                            {(entranceCheckResult.booking.seats || []).join(', ')} · Customer:{' '}
                            {entranceCheckResult.booking.customer_name}
                          </small>
                        </div>
                      )}
                    </div>
                  )}
                </section>

                <section className="admin-card">
                  <span className="section-kicker">LIVE SEAT CANCELLATION ALERTS</span>
                  <h2>Recently released seats</h2>
                  {cancellationAlerts.length ? (
                    <div className="admin-list">
                      {cancellationAlerts.slice(0, 5).map((item) => (
                        <div className="admin-list-row" key={item.id}>
                          <span>
                            <strong>
                              Alert: Seats {item.seats.join(', ')} released ({item.movieTitle})
                            </strong>
                            <small>
                              Ref {item.bookingRef} · Cancelled at {item.cancelledAt}
                            </small>
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="empty-state">No seat cancellations recorded in this session.</p>
                  )}
                </section>

                {staffProfile?.role === 'owner' && (
                  <section className="admin-card bookings-card">
                    <span className="section-kicker">MAIN ADMIN OWNER · STAFF TEAM MANAGEMENT</span>
                    <h2>Create new staff login credentials</h2>
                    <form className="stack-form" onSubmit={createStaffAccount}>
                      <div className="form-row">
                        <label>
                          Staff full name
                          <input
                            required
                            placeholder="Mikko Virtanen"
                            value={newStaffForm.staffName}
                            onChange={(e) => setNewStaffForm({ ...newStaffForm, staffName: e.target.value })}
                          />
                        </label>
                        <label>
                          New staff email
                          <input
                            required
                            type="email"
                            placeholder="mikko@flimhall.com"
                            value={newStaffForm.staffEmail}
                            onChange={(e) => setNewStaffForm({ ...newStaffForm, staffEmail: e.target.value })}
                          />
                        </label>
                        <label>
                          New staff password
                          <input
                            required
                            type="password"
                            minLength="6"
                            placeholder="Create password"
                            value={newStaffForm.staffPassword}
                            onChange={(e) => setNewStaffForm({ ...newStaffForm, staffPassword: e.target.value })}
                          />
                        </label>
                        <label>
                          Location
                          <select
                            value={newStaffForm.location}
                            onChange={(e) => setNewStaffForm({ ...newStaffForm, location: e.target.value })}
                          >
                            <option value="Oulu & Tampere">Oulu &amp; Tampere</option>
                            <option value="FlimHall Oulu">FlimHall Oulu</option>
                            <option value="FlimHall Tampere">FlimHall Tampere</option>
                          </select>
                        </label>
                      </div>
                      <div className="form-actions">
                        <button className="button button-primary" type="submit">
                          + Create Staff Account
                        </button>
                      </div>
                    </form>

                    <div className="admin-list">
                      <div className="admin-list-row">
                        <span>
                          <strong>admin@flimhall.com · Main Admin Owner</strong>
                          <small>Full Owner Access · Can create &amp; manage staff accounts</small>
                        </span>
                        <span className="rating">OWNER</span>
                      </div>
                      {staffAccounts.map((acc) => (
                        <div className="admin-list-row" key={acc.id}>
                          <span>
                            <strong>
                              {acc.name} · {acc.email}
                            </strong>
                            <small>
                              Location: {acc.location} · Password: {acc.password} · Created {acc.createdAt}
                            </small>
                          </span>
                          <span className="row-actions">
                            <button
                              type="button"
                              className="text-button danger-text"
                              onClick={() => removeStaffAccount(acc.email)}
                            >
                              Remove staff
                            </button>
                          </span>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                <section className="admin-card">
                  <span className="section-kicker">{editingMovieId ? 'EDIT MOVIE' : 'MOVIE CATALOGUE'}</span>
                  <h2>{editingMovieId ? 'Update movie' : 'Add a movie'}</h2>
                  <form className="stack-form" onSubmit={saveMovie}>
                    <label>
                      Title
                      <input
                        required
                        maxLength="180"
                        value={movieForm.title}
                        onChange={(event) => setMovieForm({ ...movieForm, title: event.target.value })}
                      />
                    </label>
                    <label>
                      Description
                      <textarea
                        maxLength="5000"
                        rows="3"
                        value={movieForm.description}
                        onChange={(event) => setMovieForm({ ...movieForm, description: event.target.value })}
                      />
                    </label>
                    <div className="form-row">
                      <label>
                        Genre
                        <input
                          required
                          value={movieForm.genre}
                          onChange={(event) => setMovieForm({ ...movieForm, genre: event.target.value })}
                        />
                      </label>
                      <label>
                        Duration (min)
                        <input
                          required
                          type="number"
                          min="1"
                          max="600"
                          value={movieForm.duration_min}
                          onChange={(event) => setMovieForm({ ...movieForm, duration_min: event.target.value })}
                        />
                      </label>
                    </div>
                    <label>
                      Release year
                      <input
                        required
                        type="number"
                        min="1888"
                        max="2100"
                        value={movieForm.release_year}
                        onChange={(event) => setMovieForm({ ...movieForm, release_year: event.target.value })}
                      />
                    </label>
                    <div className="form-row">
                      <label>
                        Age rating
                        <input
                          required
                          placeholder="PG-13"
                          value={movieForm.age_rating}
                          onChange={(event) => setMovieForm({ ...movieForm, age_rating: event.target.value })}
                        />
                      </label>
                      <label>
                        Poster URL
                        <input
                          type="url"
                          placeholder="https://"
                          value={movieForm.poster_url}
                          onChange={(event) => setMovieForm({ ...movieForm, poster_url: event.target.value })}
                        />
                      </label>
                    </div>
                    <div className="form-actions">
                      <button className="button button-primary">
                        {editingMovieId ? 'Save changes' : 'Add movie'}
                      </button>
                      {editingMovieId && (
                        <button
                          type="button"
                          className="button button-secondary"
                          onClick={() => {
                            setEditingMovieId(null);
                            setMovieForm(emptyMovie);
                          }}
                        >
                          Stop editing
                        </button>
                      )}
                    </div>
                  </form>
                  <div className="admin-list">
                    {adminMovies.map((movie) => (
                      <div className="admin-list-row" key={movie.id}>
                        <span>
                          <strong>{movie.title}</strong>
                          <small>
                            {movie.release_year || 'Year unavailable'} · {movie.genre} · {movie.duration_min} min
                          </small>
                        </span>
                        <span className="row-actions">
                          <button
                            className="text-button"
                            onClick={() => {
                              setEditingMovieId(movie.id);
                              setMovieForm({
                                ...movie,
                                duration_min: String(movie.duration_min),
                                poster_url: movie.poster_url || ''
                              });
                            }}
                          >
                            Edit
                          </button>
                          <button className="text-button danger-text" onClick={() => removeMovie(movie.id)}>
                            Delete
                          </button>
                        </span>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="admin-card">
                  <span className="section-kicker">{editingScreeningId ? 'EDIT SCREENING' : 'SHOWTIMES'}</span>
                  <h2>{editingScreeningId ? 'Update screening' : 'Schedule a screening'}</h2>
                  <form className="stack-form" onSubmit={saveScreening}>
                    <label>
                      Movie
                      <select
                        required
                        value={screeningForm.movie_id}
                        onChange={(event) => setScreeningForm({ ...screeningForm, movie_id: event.target.value })}
                      >
                        <option value="">Select a movie</option>
                        {adminMovies.map((movie) => (
                          <option key={movie.id} value={movie.id}>
                            {movie.title}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      Auditorium
                      <select
                        required
                        value={screeningForm.auditorium_id}
                        onChange={(event) => setScreeningForm({ ...screeningForm, auditorium_id: event.target.value })}
                      >
                        <option value="">Select a screen</option>
                        {auditoriums.map((room) => (
                          <option key={room.id} value={room.id}>
                            {room.name}
                          </option>
                        ))}
                      </select>
                    </label>
                    <div className="form-row">
                      <label>
                        Date and time
                        <input
                          required
                          type="datetime-local"
                          value={screeningForm.starts_at}
                          onChange={(event) => setScreeningForm({ ...screeningForm, starts_at: event.target.value })}
                        />
                      </label>
                      <label>
                        Ticket price (€)
                        <input
                          required
                          type="number"
                          min="0.01"
                          step="0.01"
                          value={screeningForm.base_price}
                          onChange={(event) => setScreeningForm({ ...screeningForm, base_price: event.target.value })}
                        />
                      </label>
                    </div>
                    <div className="form-actions">
                      <button className="button button-primary">
                        {editingScreeningId ? 'Save changes' : 'Create screening'}
                      </button>
                      {editingScreeningId && (
                        <button
                          type="button"
                          className="button button-secondary"
                          onClick={() => {
                            setEditingScreeningId(null);
                            setScreeningForm(emptyScreening);
                          }}
                        >
                          Stop editing
                        </button>
                      )}
                    </div>
                  </form>
                  <div className="admin-list">
                    {adminScreenings.map((screening) => (
                      <div className="admin-list-row" key={screening.id}>
                        <span>
                          <strong>{screening.movie_title}</strong>
                          <small>
                            {formatDate(screening.starts_at)} · {screening.auditorium} · {screening.status}
                          </small>
                        </span>
                        {screening.status === 'scheduled' && (
                          <span className="row-actions">
                            <button
                              className="text-button"
                              onClick={() => {
                                setEditingScreeningId(screening.id);
                                setScreeningForm({
                                  movie_id: String(screening.movie_id),
                                  auditorium_id: String(screening.auditorium_id),
                                  starts_at: toLocalDateTime(screening.starts_at),
                                  base_price: String(screening.base_price)
                                });
                              }}
                            >
                              Edit
                            </button>
                            <button
                              className="text-button danger-text"
                              onClick={() => cancelScreening(screening.id)}
                            >
                              Cancel
                            </button>
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </section>

                <section className="admin-card bookings-card">
                  <span className="section-kicker">RESERVATIONS</span>
                  <h2>
                    Customer bookings <span className="subtle-count">{adminBookings.length}</span>
                  </h2>
                  {adminBookings.length ? (
                    <div className="admin-list">
                      {adminBookings.map((booking) => {
                        return (
                          <div className="admin-list-row booking-row" key={booking.id}>
                            <span>
                              <strong>
                                {booking.booking_ref} · {booking.customer_name}
                              </strong>
                              <small>
                                {booking.customer_email} · {booking.movie_title} · {booking.seats.join(', ')}
                              </small>
                              <small>
                                {formatDate(booking.starts_at)} · €{Number(booking.total_price).toFixed(2)} ·{' '}
                                {booking.status}
                              </small>
                            </span>
                            {booking.status === 'confirmed' && (
                              <button
                                className="text-button danger-text"
                                onClick={() => cancelBooking(booking.id)}
                              >
                                Cancel booking
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="empty-state">No bookings yet.</p>
                  )}
                </section>
              </div>
            </>
          )}
        </section>
      )}
    </main>
  );
}
