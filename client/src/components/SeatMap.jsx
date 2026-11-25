import { useState } from 'react';
import {
  analyzeSeatSeparation,
  autoResolveSeatGaps,
  buildAuditoriumRows,
  detectSingleSeatGaps,
  suggestBestSeats
} from '../utils/seatRules';

export default function SeatMap({
  auditoriumName,
  seats = [],
  selectedSeats = [],
  onChangeSelectedSeats,
  wheelchairSpaces = 0,
  onChangeWheelchairSpaces,
  holdSecondsRemaining = 900,
  onNotify
}) {
  const [partySize, setPartySize] = useState(2);
  const [dismissedSeparationKey, setDismissedSeparationKey] = useState('');
  const rows = buildAuditoriumRows(seats);
  const gapSeats = detectSingleSeatGaps(rows, selectedSeats);
  const gapLabels = new Set(gapSeats.map((s) => s.label));
  const separationInfo = analyzeSeatSeparation(rows, selectedSeats);
  const currentSelectionKey = [...selectedSeats].sort().join(',');
  const showSeparationPopup =
    separationInfo.isSeparated && dismissedSeparationKey !== currentSelectionKey;
  const hasAnySelection = selectedSeats.length > 0 || wheelchairSpaces > 0;

  function toggleSeat(seat) {
    if (!seat.available) return;
    const isSelected = selectedSeats.includes(seat.label);
    const next = isSelected
      ? selectedSeats.filter((item) => item !== seat.label)
      : [...selectedSeats, seat.label];
    onChangeSelectedSeats(next);
  }

  function handleSuggestSeats(customCount) {
    const countToUse = typeof customCount === 'number' ? customCount : partySize;
    const suggested = suggestBestSeats(rows, countToUse);
    if (suggested.length) {
      onChangeSelectedSeats(suggested);
      onNotify?.(
        `Guided seat selection: picked ${suggested.length} best side-by-side center ${
          suggested.length === 1 ? 'seat' : 'seats'
        } (${suggested.join(', ')}) with no single-seat gaps.`
      );
    }
  }

  function handleAcceptPopupSuggestion() {
    if (separationInfo.suggestedSeats.length) {
      onChangeSelectedSeats(separationInfo.suggestedSeats);
      onNotify?.(
        `Switched to ${separationInfo.suggestedSeats.length} side-by-side center seats (${separationInfo.suggestedSeats.join(', ')})${
          separationInfo.suggestedRowNumber ? ` in Row ${separationInfo.suggestedRowNumber}` : ''
        }.`
      );
    } else {
      handleSuggestSeats(selectedSeats.length);
    }
  }

  function handleAutoFixGaps() {
    const fixed = autoResolveSeatGaps(rows, selectedSeats);
    onChangeSelectedSeats(fixed);
    onNotify?.('Adjusted your selection so no single empty seat is left between bookings.');
  }

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="auditorium-seat-panel">
      <div className="seat-heading">
        <div>
          <span className="section-kicker">YOUR SEATS</span>
          <h3>{auditoriumName}</h3>
          <small className="seat-rule-sub">
            Snake numbering from screen (10 seats/row) · No Row 13 or Seat #13 · Open wheelchair area in front of Row 1
          </small>
        </div>

        <div className="seat-header-right">
          <div className="seat-guidance-bar">
            <label className="wheelchair-count-label">
              <span>Party size</span>
              <select
                value={partySize}
                onChange={(e) => setPartySize(Number(e.target.value))}
                aria-label="Number of seats to suggest"
              >
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? 'seat' : 'seats'}
                  </option>
                ))}
              </select>
            </label>
            <button type="button" className="button button-secondary" onClick={handleSuggestSeats}>
              ★ Guide me (Suggest best seats)
            </button>
          </div>
          {hasAnySelection && holdSecondsRemaining > 0 && (
            <div className="hold-timer-badge" role="timer" aria-live="polite">
              <span className="live-dot" />
              Hold: <strong>{formatTimer(holdSecondsRemaining)}</strong>
            </div>
          )}
          <span className="screen-label">SCREEN (FRONT)</span>
        </div>
      </div>

      <div
        className={`wheelchair-open-zone ${wheelchairSpaces > 0 ? 'active' : ''}`}
        role="region"
        aria-label="Wheelchair accessible open area in front of Row 1"
      >
        <div className="wheelchair-zone-copy">
          <span className="wheelchair-zone-kicker">
            ♿ WHEELCHAIR ACCESSIBLE OPEN AREA (IN FRONT OF ROW 1) · 10 OPEN SPACES · 20% OFF
          </span>
          <p>
            Open floor space in front of the first row with capacity for up to <strong>10 wheelchairs</strong>. Guests
            using a wheelchair do not need to book a seat number and receive a <strong>20% accessibility discount</strong>{' '}
            — simply book your open space pass below, arrive with your wheelchair, and enjoy the movie.
          </p>
        </div>

        <div className="wheelchair-zone-controls">
          <label className="wheelchair-count-label">
            <span>Open Wheelchair Space Passes (Max 10 · 20% OFF)</span>
            <select
              value={wheelchairSpaces}
              onChange={(e) => onChangeWheelchairSpaces?.(Number(e.target.value))}
              aria-label="Number of wheelchair open space passes"
            >
              <option value={0}>0 passes (Not selected)</option>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((count) => (
                <option key={count} value={count}>
                  {count} {count === 1 ? 'Wheelchair Open Space' : 'Wheelchair Open Spaces'} (No seat number · 20% OFF)
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            className={wheelchairSpaces > 0 ? 'button button-primary' : 'button button-secondary'}
            onClick={() => onChangeWheelchairSpaces?.(wheelchairSpaces > 0 ? 0 : 1)}
          >
            {wheelchairSpaces > 0
              ? `✓ ${wheelchairSpaces}/10 Open Space Booked (20% OFF)`
              : '+ Book Wheelchair Open Space (20% OFF)'}
          </button>
        </div>
      </div>

      {showSeparationPopup && (
        <div
          className="seat-separation-popup"
          role="dialog"
          aria-modal="false"
          aria-label="Separated seats recommendation popup"
        >
          <div className="seat-separation-header">
            <div>
              <span className="seat-separation-badge">★ SEAT GUIDANCE WARNING · OPTIONAL RECOMMENDATION</span>
              <h4>Your selected seats are not next to each other!</h4>
            </div>
            <button
              type="button"
              className="icon-button"
              onClick={() => setDismissedSeparationKey(currentSelectionKey)}
              aria-label="Keep current seats and close warning"
            >
              ×
            </button>
          </div>
          <p className="seat-separation-copy">
            {separationInfo.reason} You are free to book these separate seats if you prefer, or click below to switch
            your group to the <strong>best side-by-side center seats</strong> in one row:
          </p>
          {separationInfo.suggestedSeats.length > 0 && (
            <div className="seat-separation-recommend-box">
              <span>
                Recommended Best Together ({separationInfo.suggestedSeats.length} adjacent seats
                {separationInfo.suggestedRowNumber ? ` in Row ${separationInfo.suggestedRowNumber}` : ''}):
              </span>
              <strong>{separationInfo.suggestedSeats.join(', ')}</strong>
            </div>
          )}
          <div className="seat-separation-actions">
            <button
              type="button"
              className="button button-primary"
              onClick={handleAcceptPopupSuggestion}
            >
              ★ Switch to Best Side-by-Side Seats ({separationInfo.suggestedSeats.join(', ')})
            </button>
            <button
              type="button"
              className="button button-secondary"
              onClick={() => setDismissedSeparationKey(currentSelectionKey)}
            >
              Keep My Separate Seats ({selectedSeats.join(', ')})
            </button>
          </div>
        </div>
      )}

      {gapSeats.length > 0 && (
        <div className="orphan-seat-alert" role="alert">
          <span>
            <strong>1-Seat Gap Notice (Optional Guidance):</strong> Your selection leaves a single empty seat (Row{' '}
            {gapSeats.map((s) => `${s.displayRow} Seat #${s.snakeNumber}`).join(', ')}). We recommend choosing adjacent
            seats, though you may still proceed.
          </span>
          <button type="button" className="button button-secondary" onClick={handleAutoFixGaps}>
            Auto-choose adjacent seats
          </button>
        </div>
      )}

      <div className="auditorium-rows" role="group" aria-label="Select available seats">
        {rows.map((row) => (
          <div
            key={row.rowIndex}
            className={`auditorium-row ${row.displayRow === 14 ? 'skipped-row-13' : ''}`}
          >
            <div className="row-tag">
              <strong>Row {row.displayRow}</strong>
              <small>{row.direction}</small>
            </div>

            <div className="seat-map">
              {row.seats.map((seat) => {
                const isSelected = selectedSeats.includes(seat.label);
                const isGap = gapLabels.has(seat.label);
                return (
                  <button
                    type="button"
                    key={seat.label}
                    disabled={!seat.available}
                    aria-pressed={isSelected}
                    aria-label={`Row ${seat.displayRow}, Seat ${seat.snakeNumber} (${seat.label})${
                      seat.available ? '' : ', unavailable'
                    }`}
                    title={`Row ${seat.displayRow} · Seat #${seat.snakeNumber} (${seat.label})`}
                    className={[
                      'seat',
                      seat.available ? '' : 'unavailable',
                      isSelected ? 'selected' : '',
                      isGap ? 'gap-seat' : ''
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() => toggleSeat(seat)}
                  >
                    <span className="seat-num">{seat.snakeNumber}</span>
                    <small className="seat-label-sub">{seat.label}</small>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="auditorium-rear-entrances">
        <span>🚪↗ BACK ENTRANCE (LEFT)</span>
        <span>REAR OF AUDITORIUM</span>
        <span>↖🚪 BACK ENTRANCE (RIGHT)</span>
      </div>

      <div className="seat-legend">
        <span>
          <i className="legend-dot available-dot" /> Available
        </span>
        <span>
          <i className="legend-dot selected-dot" /> Selected
        </span>
        <span>
          <i className="legend-dot wheelchair-dot" /> ♿ Open Wheelchair Space (In front of Row 1)
        </span>
        <span>
          <i className="legend-dot taken-dot" /> Taken
        </span>
      </div>
    </div>
  );
}
