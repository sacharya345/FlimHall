const CURRENT_YEAR = new Date().getFullYear();

export default function Footer({ onNavigate }) {
  function goTo(targetView) {
    if (typeof onNavigate === 'function') {
      onNavigate(targetView);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <footer className="site-footer" aria-label="Site footer">
      <div className="footer-grid">
        <div className="footer-col footer-brand-col">
          <div className="brand">
            <span className="brand-mark">F</span>
            <span>
              <strong>FlimHall</strong>
              <small>YOUR NIGHT, YOUR SEAT</small>
            </span>
          </div>
          <p className="footer-about">
            Modern movie theater booking platform for Oulu and Tampere cinemas. Browse showtimes, pick your seats, and
            book tickets online or reserve for counter pickup.
          </p>
        </div>

        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul className="footer-links">
            <li>
              <button type="button" onClick={() => goTo('movies')}>
                Now Showing
              </button>
            </li>
            <li>
              <button type="button" onClick={() => goTo('retrieve')}>
                Find My Booking
              </button>
            </li>
            <li>
              <button type="button" onClick={() => goTo('account')}>
                Customer Account
              </button>
            </li>
            <li>
              <button type="button" onClick={() => goTo('corporate')}>
                B2B &amp; Private Showtimes
              </button>
            </li>
            <li>
              <button type="button" onClick={() => goTo('staff')}>
                Staff Portal
              </button>
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Cinema Locations</h4>
          <ul className="footer-meta-list">
            <li>
              <strong>Oulu Cinema</strong>
              <span>Auditorium 1 (100 seats) · Auditorium 2 (200 seats)</span>
            </li>
            <li>
              <strong>Tampere Cinema</strong>
              <span>Auditorium 1 (100 seats) · Auditorium 2 (200 seats)</span>
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Customer Info &amp; Contact</h4>
          <ul className="footer-meta-list">
            <li>
              <strong>Opening Hours</strong>
              <span>Daily 11:00 – 23:30 (Doors open 15 min before showtime)</span>
            </li>
            <li>
              <strong>Support</strong>
              <span>support@flimhall.fi · +358 8 555 0199</span>
            </li>
            <li>
              <strong>Booking Policy</strong>
              <span>Counter reservations &amp; cancellations close 2h before showtime</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <span>
          © {CURRENT_YEAR} FLIMHALL <i>·</i> THE SHOW STARTS WITH YOU <i>·</i> OAMK PROJECT
        </span>
        <div className="footer-bottom-actions">
          <button type="button" onClick={() => goTo('retrieve')}>
            Retrieve a booking
          </button>
          <button type="button" onClick={() => goTo('movies')}>
            Back to top ↑
          </button>
        </div>
      </div>
    </footer>
  );
}
