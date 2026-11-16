import {
  autoResolveSeatGaps,
  buildAuditoriumRows,
  detectSingleSeatGaps
} from '../utils/seatRules';

export default function SeatMap({
  auditoriumName,
  seats = [],
  selectedSeats = [],
  onChangeSelectedSeats,
  holdSecondsRemaining = 900,
  onNotify
}) {
  const rows = buildAuditoriumRows(seats);
  const gapSeats = detectSingleSeatGaps(rows, selectedSeats);
  const gapLabels = new Set(gapSeats.map((s) => s.label));

  function toggleSeat(seat) {
    if (!seat.available) return;
    const isSelected = selectedSeats.includes(seat.label);
    const next = isSelected
      ? selectedSeats.filter((item) => item !== seat.label)
      : [...selectedSeats, seat.label];
    onChangeSelectedSeats(next);
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
            Snake numbering from screen (10 seats/row) · No Row 13 or Seat #13 · Row 1 reserved for ♿ Wheelchair access
          </small>
        </div>

        <div className="seat-header-right">
          {selectedSeats.length > 0 && holdSecondsRemaining > 0 && (
            <div className="hold-timer-badge" role="timer" aria-live="polite">
              <span className="live-dot" />
              Hold: <strong>{formatTimer(holdSecondsRemaining)}</strong>
            </div>
          )}
          <span className="screen-label">SCREEN (FRONT)</span>
        </div>
      </div>

      {gapSeats.length > 0 && (
        <div className="orphan-seat-alert" role="alert">
          <span>
            <strong>1-Seat Gap Warning:</strong> Please do not leave a single empty seat between seats (Row{' '}
            {gapSeats.map((s) => `${s.displayRow} Seat #${s.snakeNumber}`).join(', ')}).
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
            className={`auditorium-row ${row.isWheelchairRow ? 'wheelchair-row' : ''} ${
              row.displayRow === 14 ? 'skipped-row-13' : ''
            }`}
          >
            <div className="row-tag">
              <strong>Row {row.displayRow}</strong>
              <small>{row.isWheelchairRow ? '♿ Accessible' : row.direction}</small>
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
                      seat.isWheelchair ? ', Wheelchair accessible' : ''
                    }${seat.available ? '' : ', unavailable'}`}
                    title={`Row ${seat.displayRow} · Seat #${seat.snakeNumber} (${seat.label})`}
                    className={[
                      'seat',
                      seat.available ? '' : 'unavailable',
                      isSelected ? 'selected' : '',
                      seat.isWheelchair ? 'wheelchair-seat' : '',
                      isGap ? 'gap-seat' : ''
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() => toggleSeat(seat)}
                  >
                    <span className="seat-num">
                      {seat.isWheelchair ? `♿${seat.snakeNumber}` : seat.snakeNumber}
                    </span>
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
          <i className="legend-dot wheelchair-dot" /> ♿ Wheelchair (Row 1)
        </span>
        <span>
          <i className="legend-dot taken-dot" /> Taken
        </span>
      </div>
    </div>
  );
}
