import { useState } from 'react';

const B2B_HALLS = [
  { id: 'oulu-1', label: 'FlimHall Oulu — Auditorium 1 (100 seats)', rateEur: 850, maxGuests: 100 },
  { id: 'oulu-2', label: 'FlimHall Oulu — Auditorium 2 (200 seats)', rateEur: 1450, maxGuests: 200 },
  { id: 'tampere-1', label: 'FlimHall Tampere — Auditorium 1 (100 seats)', rateEur: 850, maxGuests: 100 },
  { id: 'tampere-2', label: 'FlimHall Tampere — Auditorium 2 (200 seats)', rateEur: 1450, maxGuests: 200 }
];

function createB2bRecord(form, selectedHall) {
  const reference = `B2B-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  return {
    id: Date.now(),
    reference,
    ...form,
    hallLabel: selectedHall.label,
    estimatedTotalEur: selectedHall.rateEur,
    status: 'confirmed_request',
    createdAt: new Date().toLocaleString()
  };
}

export default function CorporateBookingSection({ movies = [], onSubmitted }) {
  const [form, setForm] = useState({
    companyName: '',
    businessId: '',
    contactName: '',
    email: '',
    phone: '',
    hallId: 'oulu-1',
    movieTitle: movies[0]?.title || 'Private Corporate Presentation / Film Screening',
    preferredDate: '',
    guestCount: 50,
    notes: ''
  });

  const [requests, setRequests] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('flimhall-b2b-requests') || '[]');
    } catch {
      return [];
    }
  });
  const [latestRequest, setLatestRequest] = useState(null);

  const selectedHall = B2B_HALLS.find((h) => h.id === form.hallId) || B2B_HALLS[0];

  function handleSubmit(event) {
    event.preventDefault();
    const record = createB2bRecord(form, selectedHall);
    const updated = [record, ...requests];
    localStorage.setItem('flimhall-b2b-requests', JSON.stringify(updated));
    setRequests(updated);
    setLatestRequest(record);
    onSubmitted?.(record);
    setForm((prev) => ({
      ...prev,
      companyName: '',
      businessId: '',
      contactName: '',
      email: '',
      phone: '',
      notes: ''
    }));
  }

  return (
    <section className="workspace-section">
      <span className="section-kicker">B2B CORPORATE &amp; PRIVATE AUDITORIUM RENTALS</span>
      <h1>Private Showtimes (B2B).</h1>
      <p className="workspace-intro">
        Companies and organizations can book a private movie screening or corporate auditorium event in Oulu or Tampere
        across our 100-seat and 200-seat halls (includes 10 front-row open wheelchair spaces).
      </p>

      <div className="admin-grid">
        <section className="admin-card">
          <span className="section-kicker">REQUEST A PRIVATE AUDITORIUM SCREENING</span>
          <h2>Company booking details</h2>
          <form className="stack-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <label>
                Company / Organization name
                <input
                  required
                  placeholder="Nordic Tech Oy"
                  value={form.companyName}
                  onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                />
              </label>
              <label>
                Business ID (Y-tunnus)
                <input
                  required
                  placeholder="1234567-8"
                  value={form.businessId}
                  onChange={(e) => setForm({ ...form, businessId: e.target.value })}
                />
              </label>
            </div>

            <div className="form-row">
              <label>
                Contact person
                <input
                  required
                  placeholder="Sami Korhonen"
                  value={form.contactName}
                  onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                />
              </label>
              <label>
                Corporate email
                <input
                  required
                  type="email"
                  placeholder="sami@nordictech.fi"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </label>
            </div>

            <div className="form-row">
              <label>
                Phone number
                <input
                  required
                  placeholder="+358 40 123 4567"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </label>
              <label>
                Preferred date &amp; time
                <input
                  required
                  type="datetime-local"
                  value={form.preferredDate}
                  onChange={(e) => setForm({ ...form, preferredDate: e.target.value })}
                />
              </label>
            </div>

            <label>
              Select Oulu or Tampere Auditorium
              <select
                value={form.hallId}
                onChange={(e) => {
                  const nextHall = B2B_HALLS.find((h) => h.id === e.target.value) || B2B_HALLS[0];
                  setForm({
                    ...form,
                    hallId: e.target.value,
                    guestCount: Math.min(form.guestCount, nextHall.maxGuests)
                  });
                }}
              >
                {B2B_HALLS.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.label} — Private Rate €{h.rateEur}.00
                  </option>
                ))}
              </select>
            </label>

            <div className="form-row">
              <label>
                Selected film
                <select
                  value={form.movieTitle}
                  onChange={(e) => setForm({ ...form, movieTitle: e.target.value })}
                >
                  {movies.map((m) => (
                    <option key={m.id || m.title} value={m.title}>
                      {m.title} ({m.genre})
                    </option>
                  ))}
                  <option value="Custom Company Presentation + Private Film">
                    Custom Company Presentation + Private Film
                  </option>
                </select>
              </label>
              <label>
                Estimated guests (Max {selectedHall.maxGuests})
                <input
                  required
                  type="number"
                  min="10"
                  max={selectedHall.maxGuests}
                  value={form.guestCount}
                  onChange={(e) => setForm({ ...form, guestCount: Number(e.target.value) })}
                />
              </label>
            </div>

            <label>
              Additional notes / AV requirements
              <textarea
                rows="2"
                placeholder="Microphone prior to film start, invoice reference..."
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </label>

            <div className="booking-total">
              <span>
                {selectedHall.label} · Up to {form.guestCount} guests
              </span>
              <strong>€{selectedHall.rateEur.toFixed(2)}</strong>
            </div>

            <button className="button button-primary" type="submit">
              Submit B2B Private Showtime Request (€{selectedHall.rateEur.toFixed(2)})
            </button>
          </form>
        </section>

        <section className="admin-card">
          <span className="section-kicker">CORPORATE BOOKING POLICY &amp; SUBMITTED REQUESTS</span>
          <h2>B2B Private Screening Summary</h2>
          <p className="movie-description" style={{ marginTop: 0 }}>
            • Doors open <strong>15 minutes</strong> before your private event begins.
            <br />• Full auditorium buyout for <strong>100-seat</strong> (€850.00) or <strong>200-seat</strong> (€1,450.00)
            halls in Oulu and Tampere.
            <br />• Includes the open wheelchair area in front of Row 1 (up to 10 wheelchair spaces).
          </p>

          {latestRequest && (
            <div className="booking-receipt" style={{ marginTop: '16px' }}>
              <span className="receipt-check">✓</span>
              <div>
                <span className="section-kicker">B2B PRIVATE SHOWTIME REGISTERED</span>
                <h3>Reference: {latestRequest.reference}</h3>
                <p>
                  Company: <strong>{latestRequest.companyName}</strong> ({latestRequest.businessId})
                </p>
                <p>
                  Hall: <strong>{latestRequest.hallLabel}</strong> · Film: <strong>{latestRequest.movieTitle}</strong>
                </p>
                <p>
                  Guests: {latestRequest.guestCount} · Total B2B Rate:{' '}
                  <strong>€{Number(latestRequest.estimatedTotalEur).toFixed(2)}</strong>
                </p>
              </div>
            </div>
          )}

          <div className="admin-list">
            {requests.length ? (
              requests.map((req) => (
                <div className="admin-list-row" key={req.id}>
                  <span>
                    <strong>
                      {req.reference} · {req.companyName} ({req.guestCount} guests)
                    </strong>
                    <small>
                      {req.hallLabel} · {req.movieTitle} · €{Number(req.estimatedTotalEur).toFixed(2)}
                    </small>
                  </span>
                  <span className="rating">B2B</span>
                </div>
              ))
            ) : (
              <p className="empty-state">No B2B private showtime requests submitted yet.</p>
            )}
          </div>
        </section>
      </div>
    </section>
  );
}
