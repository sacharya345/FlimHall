import { useCallback, useEffect, useRef, useState } from 'react';
import { apiRequest } from '../services/api';

const emptyMovie = {
  title: '',
  description: '',
  genre: '',
  duration_min: '',
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

function MovieCard({ movie, onSelect }) {
  return (
    <article className="movie-card">
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
        <p>{movie.genre} <span aria-hidden="true">·</span> {movie.duration_min} min</p>
        <button className="text-button" onClick={() => onSelect(movie.id)}>
          Movie details and showtimes <span aria-hidden="true">→</span>
        </button>
      </div>
    </article>
  );
}

export default function HomePage() {
  const [view, setView] = useState('movies');
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [screenings, setScreenings] = useState([]);
  const [selectedScreening, setSelectedScreening] = useState(null);
  const [seatData, setSeatData] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [customer, setCustomer] = useState({ name: '', email: '' });
  const [bookingResult, setBookingResult] = useState(null);
  const [bookingLookup, setBookingLookup] = useState({ reference: '', email: '' });
  const [retrievedBooking, setRetrievedBooking] = useState(null);
  const [staffToken, setStaffToken] = useState(() => sessionStorage.getItem('flimhall-staff-token') || '');
  const [login, setLogin] = useState({ email: '', password: '' });
  const [adminMovies, setAdminMovies] = useState([]);
  const [adminScreenings, setAdminScreenings] = useState([]);
  const [auditoriums, setAuditoriums] = useState([]);
  const [adminBookings, setAdminBookings] = useState([]);
  const [movieForm, setMovieForm] = useState(emptyMovie);
  const [editingMovieId, setEditingMovieId] = useState(null);
  const [screeningForm, setScreeningForm] = useState(emptyScreening);
  const [editingScreeningId, setEditingScreeningId] = useState(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loadingMovies, setLoadingMovies] = useState(true);
  const movieRequestId = useRef(0);
  const selectedMovieId = selectedMovie?.id;
  const selectedScreeningId = selectedScreening?.id;

  const loadAdminData = useCallback(async () => {
    if (!staffToken) return;
    try {
      const [movieList, screeningList, auditoriumList, bookingList] = await fetchAdminData(staffToken);
      setAdminMovies(movieList);
      setAdminScreenings(screeningList);
      setAuditoriums(auditoriumList);
      setAdminBookings(bookingList);
    } catch (requestError) {
      setError(requestError.message);
    }
  }, [staffToken]);

  const loadMovies = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set('search', search.trim());
      if (genre) params.set('genre', genre);
      const [movieList, genreList] = await Promise.all([
        apiRequest(`/movies${params.size ? `?${params}` : ''}`),
        apiRequest('/movies/genres')
      ]);
      setMovies(movieList);
      setGenres(genreList);
      setError('');
    } catch (requestError) {
      setError(requestError.message);
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
    let active = true;
    async function loadDashboard() {
      try {
        const [movieList, screeningList, auditoriumList, bookingList] = await fetchAdminData(staffToken);
        if (active) {
          setAdminMovies(movieList);
          setAdminScreenings(screeningList);
          setAuditoriums(auditoriumList);
          setAdminBookings(bookingList);
        }
      } catch (requestError) {
        if (active) setError(requestError.message);
      }
    }
    loadDashboard();
    return () => { active = false; };
  }, [staffToken]);

  useEffect(() => {
    if (!selectedScreeningId) return undefined;
    let active = true;
    apiRequest(`/screenings/${selectedScreeningId}/seats`).then((result) => {
      if (active) setSeatData(result);
    }).catch((requestError) => {
      if (active) setError(requestError.message);
    });
    return () => { active = false; };
  }, [selectedScreeningId]);

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
    setSelectedMovie(movie);
    setSelectedScreening(null);
    setSeatData(null);
    setBookingResult(null);
    setScreenings([]);
    try {
      const [details, schedule] = await Promise.all([
        apiRequest(`/movies/${movie.id}`),
        apiRequest(`/movies/${movie.id}/screenings`)
      ]);
      if (requestId !== movieRequestId.current) return;
      setSelectedMovie(details);
      setScreenings(schedule);
    } catch (requestError) {
      if (requestId === movieRequestId.current) reportError(requestError);
    }
  }

  async function submitBooking(event) {
    event.preventDefault();
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
      setBookingResult(result);
      setSelectedSeats([]);
      setNotice(result.message);
      setError('');
    } catch (requestError) {
      reportError(requestError);
    }
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
      setRetrievedBooking(null);
      reportError(requestError);
    }
  }

  async function staffLogin(event) {
    event.preventDefault();
    try {
      const result = await apiRequest('/auth/login', { method: 'POST', body: login });
      sessionStorage.setItem('flimhall-staff-token', result.token);
      setStaffToken(result.token);
      setLogin({ email: '', password: '' });
      setError('');
      setNotice(`Signed in as ${result.staff.email}.`);
    } catch (requestError) {
      reportError(requestError);
    }
  }

  async function saveMovie(event) {
    event.preventDefault();
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
    try {
      const result = await apiRequest(`/admin/bookings/${bookingId}/cancel`, {
        method: 'POST',
        token: staffToken
      });
      setNotice(result.message);
      setError('');
      await loadAdminData();
    } catch (requestError) {
      reportError(requestError);
    }
  }

  function signOut() {
    sessionStorage.removeItem('flimhall-staff-token');
    setStaffToken('');
    setNotice('Staff session ended.');
  }

  return (
    <main className="site-shell">
      <header className="topbar">
        <a className="brand" href="#home" onClick={() => setView('movies')}>
          <span className="brand-mark">F</span>
          <span><strong>FlimHall</strong><small>YOUR NIGHT, YOUR SEAT</small></span>
        </a>
        <nav className="nav" aria-label="Main navigation">
          <button className={view === 'movies' ? 'nav-link active' : 'nav-link'} onClick={() => setView('movies')}>Movies</button>
          <button className={view === 'retrieve' ? 'nav-link active' : 'nav-link'} onClick={() => setView('retrieve')}>Find booking</button>
          <button className={view === 'staff' ? 'nav-link active' : 'nav-link'} onClick={() => setView('staff')}>Staff</button>
        </nav>
        <a className="header-cta" href="#movie-list" onClick={() => setView('movies')}>Book tickets <span aria-hidden="true">↗</span></a>
      </header>

      <div className="message-region" aria-live="polite">
        {error && <div className="message error-message">{error}<button onClick={() => setError('')} aria-label="Dismiss error">×</button></div>}
        {notice && <div className="message success-message">{notice}<button onClick={() => setNotice('')} aria-label="Dismiss message">×</button></div>}
      </div>

      {view === 'movies' && (
        <>
          <section className="hero" id="home">
            <div className="hero-content">
              <span className="eyebrow"><span className="live-dot" /> THE BIG SCREEN IS CALLING</span>
              <h1>Make tonight<br />a <em>movie night.</em></h1>
              <p>Find your next favorite, pick the perfect seats, and settle in. Your cinema experience starts here.</p>
              <a className="button button-primary" href="#movie-list">Explore movies <span aria-hidden="true">↓</span></a>
            </div>
            <div className="hero-art" aria-hidden="true">
              <div className="film-frame"><span>FLIMHALL</span><strong>GOOD<br />STORIES<br /><i>LIVE HERE.</i></strong><small>EST. TONIGHT · SCREEN 01</small></div>
              <span className="hero-orbit orbit-one" /><span className="hero-orbit orbit-two" />
            </div>
            <div className="hero-foot"><span>01 — PICK A FILM</span><span>02 — CHOOSE YOUR SEAT</span><span>03 — ENJOY THE SHOW</span></div>
          </section>

          <section className="movie-section" id="movie-list">
            <div className="section-heading">
              <div><span className="section-kicker">NOW SHOWING</span><h2>Find your film.</h2></div>
              <span className="movie-count">{movies.length} {movies.length === 1 ? 'movie' : 'movies'} to explore</span>
            </div>
            <div className="filters">
              <label className="search-field">
                <span aria-hidden="true">⌕</span>
                <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by movie title" aria-label="Search movies by title" />
              </label>
              <label className="genre-field">
                <span className="sr-only">Filter by genre</span>
                <select value={genre} onChange={(event) => setGenre(event.target.value)}>
                  <option value="">All genres</option>
                  {genres.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>
            </div>
            {loadingMovies ? <p className="empty-state">Loading movies…</p> : movies.length ? (
              <div className="movie-grid">
                {movies.map((movie) => <MovieCard key={movie.id} movie={movie} onSelect={() => selectMovie(movie)} />)}
              </div>
            ) : <p className="empty-state">No movies match your search. Try another title or genre.</p>}
          </section>

          {selectedMovie && (
            <section className="details-section" id="movie-details">
              <div className="details-header">
                <div>
                  <span className="section-kicker">MOVIE DETAILS</span>
                  <h2>{selectedMovie.title}</h2>
                  <p>{selectedMovie.genre} <span aria-hidden="true">·</span> {selectedMovie.duration_min} min <span aria-hidden="true">·</span> {selectedMovie.age_rating}</p>
                </div>
                <button className="icon-button" onClick={() => {
                  movieRequestId.current += 1;
                  setSelectedMovie(null);
                  setSelectedScreening(null);
                  setSeatData(null);
                }} aria-label="Close movie details">×</button>
              </div>
              {selectedMovie.description && <p className="movie-description">{selectedMovie.description}</p>}
              <h3 className="subheading">Choose a screening</h3>
              {screenings.length ? (
                <div className="screening-list">
                  {screenings.map((screening) => (
                    <button
                      className={`screening-option ${selectedScreening?.id === screening.id ? 'chosen' : ''}`}
                      key={screening.id}
                      onClick={() => {
                        setSelectedScreening(screening);
                        setSeatData(null);
                        setSelectedSeats([]);
                        setBookingResult(null);
                      }}
                    >
                      <span>{formatDate(screening.starts_at)}</span>
                      <small>{screening.auditorium} · {screening.available_seats} seats left</small>
                      <strong>${Number(screening.base_price).toFixed(2)}</strong>
                    </button>
                  ))}
                </div>
              ) : <p className="empty-state">No upcoming screenings are available for this movie.</p>}

              {selectedScreening && seatData && !bookingResult && (
                <div className="booking-panel">
                  <div className="seat-heading">
                    <div><span className="section-kicker">YOUR SEATS</span><h3>{seatData.screening.auditorium}</h3></div>
                    <span className="screen-label">SCREEN</span>
                  </div>
                  <div className="seat-map" role="group" aria-label="Select available seats">
                    {seatData.seats.map((seat) => (
                      <button
                        key={seat.label}
                        disabled={!seat.available}
                        aria-pressed={selectedSeats.includes(seat.label)}
                        aria-label={`Seat ${seat.label}${seat.available ? '' : ', unavailable'}`}
                        className={`seat ${seat.available ? '' : 'unavailable'} ${selectedSeats.includes(seat.label) ? 'selected' : ''}`}
                        onClick={() => setSelectedSeats((current) => current.includes(seat.label)
                          ? current.filter((value) => value !== seat.label)
                          : [...current, seat.label])}
                      >{seat.label}</button>
                    ))}
                  </div>
                  <div className="seat-legend"><span><i className="legend-dot available-dot" /> Available</span><span><i className="legend-dot selected-dot" /> Selected</span><span><i className="legend-dot taken-dot" /> Taken</span></div>
                  <form className="booking-form" onSubmit={submitBooking}>
                    <label>Your name<input required maxLength="120" value={customer.name} onChange={(event) => setCustomer({ ...customer, name: event.target.value })} /></label>
                    <label>Email for your confirmation<input required type="email" value={customer.email} onChange={(event) => setCustomer({ ...customer, email: event.target.value })} /></label>
                    <div className="booking-total">
                      <span>{selectedSeats.length ? selectedSeats.join(', ') : 'Select your seats'} · {selectedSeats.length} {selectedSeats.length === 1 ? 'ticket' : 'tickets'}</span>
                      <strong>${(selectedSeats.length * Number(seatData.screening.base_price)).toFixed(2)}</strong>
                    </div>
                    <button className="button button-primary" disabled={!selectedSeats.length}>Confirm booking</button>
                  </form>
                </div>
              )}
              {bookingResult && (
                <div className="booking-receipt">
                  <span className="receipt-check">✓</span>
                  <div><span className="section-kicker">BOOKING CONFIRMED</span><h3>Your seats are waiting.</h3>
                    <p>Reference: <strong>{bookingResult.booking.booking_ref}</strong></p>
                    <p>{bookingResult.booking.movie_title} · {bookingResult.booking.seats.join(', ')} · ${Number(bookingResult.booking.total_price).toFixed(2)}</p>
                    <p className={bookingResult.emailStatus === 'sent' ? 'email-sent' : 'email-warning'}>
                      {bookingResult.emailStatus === 'sent' ? 'Confirmation email sent.' : 'Booking is saved, but email delivery is not configured or failed. Keep your reference.'}
                    </p>
                  </div>
                </div>
              )}
            </section>
          )}
          <footer className="site-footer"><span>FLIMHALL <i>·</i> THE SHOW STARTS WITH YOU</span><button onClick={() => setView('retrieve')}>Retrieve a booking</button></footer>
        </>
      )}

      {view === 'retrieve' && (
        <section className="workspace-section">
          <span className="section-kicker">YOUR RESERVATION</span>
          <h1>Find your booking.</h1>
          <p className="workspace-intro">Enter the reference from your confirmation and the email used to book.</p>
          <form className="stack-form retrieve-form" onSubmit={retrieveBooking}>
            <label>Booking reference<input required placeholder="FH-A1B2C3D4E5" value={bookingLookup.reference} onChange={(event) => setBookingLookup({ ...bookingLookup, reference: event.target.value })} /></label>
            <label>Booking email<input required type="email" value={bookingLookup.email} onChange={(event) => setBookingLookup({ ...bookingLookup, email: event.target.value })} /></label>
            <button className="button button-primary">Retrieve booking</button>
          </form>
          {retrievedBooking && (
            <article className="result-card">
              <span className="section-kicker">BOOKING {retrievedBooking.status.toUpperCase()}</span>
              <h2>{retrievedBooking.movie_title}</h2>
              <p>{formatDate(retrievedBooking.starts_at)} · {retrievedBooking.auditorium}</p>
              <p>Seats: {retrievedBooking.seats.join(', ')} · Total: ${Number(retrievedBooking.total_price).toFixed(2)}</p>
              <p>Reference: <strong>{retrievedBooking.booking_ref}</strong></p>
            </article>
          )}
        </section>
      )}

      {view === 'staff' && (
        <section className="workspace-section staff-workspace">
          {!staffToken ? (
            <>
              <span className="section-kicker">STAFF ACCESS</span>
              <h1>Welcome back.</h1>
              <p className="workspace-intro">Sign in to manage movies, screenings, and customer bookings.</p>
              <form className="stack-form retrieve-form" onSubmit={staffLogin}>
                <label>Staff email<input required type="email" autoComplete="username" value={login.email} onChange={(event) => setLogin({ ...login, email: event.target.value })} /></label>
                <label>Password<input required type="password" autoComplete="current-password" value={login.password} onChange={(event) => setLogin({ ...login, password: event.target.value })} /></label>
                <button className="button button-primary">Sign in</button>
              </form>
              <p className="muted-note">Staff access is provisioned using the server’s ADMIN_EMAIL and ADMIN_PASSWORD settings.</p>
            </>
          ) : (
            <>
              <div className="staff-heading">
                <div><span className="section-kicker">THEATER MANAGEMENT</span><h1>Staff dashboard.</h1></div>
                <button className="button button-secondary" onClick={signOut}>Sign out</button>
              </div>

              <div className="admin-grid">
                <section className="admin-card">
                  <span className="section-kicker">{editingMovieId ? 'EDIT MOVIE' : 'MOVIE CATALOGUE'}</span>
                  <h2>{editingMovieId ? 'Update movie' : 'Add a movie'}</h2>
                  <form className="stack-form" onSubmit={saveMovie}>
                    <label>Title<input required maxLength="180" value={movieForm.title} onChange={(event) => setMovieForm({ ...movieForm, title: event.target.value })} /></label>
                    <label>Description<textarea maxLength="5000" rows="3" value={movieForm.description} onChange={(event) => setMovieForm({ ...movieForm, description: event.target.value })} /></label>
                    <div className="form-row">
                      <label>Genre<input required value={movieForm.genre} onChange={(event) => setMovieForm({ ...movieForm, genre: event.target.value })} /></label>
                      <label>Duration (min)<input required type="number" min="1" max="600" value={movieForm.duration_min} onChange={(event) => setMovieForm({ ...movieForm, duration_min: event.target.value })} /></label>
                    </div>
                    <div className="form-row">
                      <label>Age rating<input required placeholder="PG-13" value={movieForm.age_rating} onChange={(event) => setMovieForm({ ...movieForm, age_rating: event.target.value })} /></label>
                      <label>Poster URL<input type="url" placeholder="https://" value={movieForm.poster_url} onChange={(event) => setMovieForm({ ...movieForm, poster_url: event.target.value })} /></label>
                    </div>
                    <div className="form-actions"><button className="button button-primary">{editingMovieId ? 'Save changes' : 'Add movie'}</button>
                      {editingMovieId && <button type="button" className="button button-secondary" onClick={() => { setEditingMovieId(null); setMovieForm(emptyMovie); }}>Stop editing</button>}</div>
                  </form>
                  <div className="admin-list">
                    {adminMovies.map((movie) => (
                      <div className="admin-list-row" key={movie.id}>
                        <span><strong>{movie.title}</strong><small>{movie.genre} · {movie.duration_min} min</small></span>
                        <span className="row-actions">
                          <button className="text-button" onClick={() => { setEditingMovieId(movie.id); setMovieForm({ ...movie, duration_min: String(movie.duration_min), poster_url: movie.poster_url || '' }); }}>Edit</button>
                          <button className="text-button danger-text" onClick={() => removeMovie(movie.id)}>Delete</button>
                        </span>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="admin-card">
                  <span className="section-kicker">{editingScreeningId ? 'EDIT SCREENING' : 'SHOWTIMES'}</span>
                  <h2>{editingScreeningId ? 'Update screening' : 'Schedule a screening'}</h2>
                  <form className="stack-form" onSubmit={saveScreening}>
                    <label>Movie<select required value={screeningForm.movie_id} onChange={(event) => setScreeningForm({ ...screeningForm, movie_id: event.target.value })}>
                      <option value="">Select a movie</option>{adminMovies.map((movie) => <option key={movie.id} value={movie.id}>{movie.title}</option>)}
                    </select></label>
                    <label>Auditorium<select required value={screeningForm.auditorium_id} onChange={(event) => setScreeningForm({ ...screeningForm, auditorium_id: event.target.value })}>
                      <option value="">Select a screen</option>{auditoriums.map((room) => <option key={room.id} value={room.id}>{room.name}</option>)}
                    </select></label>
                    <div className="form-row">
                      <label>Date and time<input required type="datetime-local" value={screeningForm.starts_at} onChange={(event) => setScreeningForm({ ...screeningForm, starts_at: event.target.value })} /></label>
                      <label>Ticket price ($)<input required type="number" min="0.01" step="0.01" value={screeningForm.base_price} onChange={(event) => setScreeningForm({ ...screeningForm, base_price: event.target.value })} /></label>
                    </div>
                    <div className="form-actions"><button className="button button-primary">{editingScreeningId ? 'Save changes' : 'Create screening'}</button>
                      {editingScreeningId && <button type="button" className="button button-secondary" onClick={() => { setEditingScreeningId(null); setScreeningForm(emptyScreening); }}>Stop editing</button>}</div>
                  </form>
                  <div className="admin-list">
                    {adminScreenings.map((screening) => (
                      <div className="admin-list-row" key={screening.id}>
                        <span><strong>{screening.movie_title}</strong><small>{formatDate(screening.starts_at)} · {screening.auditorium} · {screening.status}</small></span>
                        {screening.status === 'scheduled' && (
                          <span className="row-actions">
                            <button className="text-button" onClick={() => {
                              setEditingScreeningId(screening.id);
                              setScreeningForm({
                                movie_id: String(screening.movie_id),
                                auditorium_id: String(screening.auditorium_id),
                                starts_at: toLocalDateTime(screening.starts_at),
                                base_price: String(screening.base_price)
                              });
                            }}>Edit</button>
                            <button className="text-button danger-text" onClick={() => cancelScreening(screening.id)}>Cancel</button>
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </section>

                <section className="admin-card bookings-card">
                  <span className="section-kicker">RESERVATIONS</span>
                  <h2>Customer bookings <span className="subtle-count">{adminBookings.length}</span></h2>
                  {adminBookings.length ? <div className="admin-list">
                    {adminBookings.map((booking) => {
                      return (
                        <div className="admin-list-row booking-row" key={booking.id}>
                          <span><strong>{booking.booking_ref} · {booking.customer_name}</strong>
                            <small>{booking.customer_email} · {booking.movie_title} · {booking.seats.join(', ')}</small>
                            <small>{formatDate(booking.starts_at)} · ${Number(booking.total_price).toFixed(2)} · {booking.status}</small>
                          </span>
                          {booking.status === 'confirmed' && <button className="text-button danger-text" onClick={() => cancelBooking(booking.id)}>Cancel booking</button>}
                        </div>
                      );
                    })}
                  </div> : <p className="empty-state">No bookings yet.</p>}
                </section>
              </div>
            </>
          )}
        </section>
      )}
    </main>
  );
}
