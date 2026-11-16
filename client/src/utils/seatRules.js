// FlimHall Auditorium Seat & Showtime Rules:
// - 10 seats per row, snake numbering from the front screen
// - Skip Row 13 and Seat #13
// - Row 1 reserved for wheelchair access
// - Detect 1-seat gaps ("orphan seats") between selected/booked seats
// - Auditorium doors open 15 minutes before ads; 12 minutes of ads before film starts

export function skipNumber13(n) {
  return n >= 13 ? n + 1 : n;
}

export function buildAuditoriumRows(seats = []) {
  const rowGroups = new Map();

  seats.forEach((seat) => {
    const rowLetter = seat.label.match(/^[A-Z]+/)?.[0] || 'A';
    const colNum = Number(seat.label.match(/\d+$/)?.[0] || 1);
    if (!rowGroups.has(rowLetter)) {
      rowGroups.set(rowLetter, []);
    }
    rowGroups.get(rowLetter).push({ ...seat, rowLetter, colNum });
  });

  const sortedRowLetters = [...rowGroups.keys()].sort();
  let runningSeatCounter = 0;

  return sortedRowLetters.map((rowLetter, rowIndex) => {
    const rawRowNumber = rowIndex + 1;
    const displayRow = skipNumber13(rawRowNumber);
    const isWheelchairRow = rawRowNumber === 1;
    const rowSeats = rowGroups.get(rowLetter).sort((a, b) => a.colNum - b.colNum);

    // Snake numbering from screen: odd rows L->R, even rows R<-L
    const isReverseRow = rowIndex % 2 === 1;
    const orderedForSnake = isReverseRow ? [...rowSeats].reverse() : [...rowSeats];

    const snakeMap = new Map();
    orderedForSnake.forEach((s) => {
      runningSeatCounter += 1;
      const snakeNum = skipNumber13(runningSeatCounter);
      snakeMap.set(s.label, snakeNum);
    });

    const enrichedSeats = rowSeats.map((s) => ({
      ...s,
      displayRow,
      snakeNumber: snakeMap.get(s.label),
      isWheelchair: isWheelchairRow,
      direction: isReverseRow ? 'R ← L' : 'L → R'
    }));

    return {
      rowIndex,
      rowLetter,
      displayRow,
      isWheelchairRow,
      direction: isReverseRow ? 'R ← L' : 'L → R',
      seats: enrichedSeats
    };
  });
}

export function detectSingleSeatGaps(rows, selectedLabels = []) {
  const selectedSet = new Set(selectedLabels);
  const gapSeats = [];

  rows.forEach((row) => {
    const seats = row.seats;
    for (let i = 0; i < seats.length; i += 1) {
      const seat = seats[i];
      const isOccupied = !seat.available || selectedSet.has(seat.label);
      if (isOccupied) continue;

      const leftOccupied =
        i > 0 && (!seats[i - 1].available || selectedSet.has(seats[i - 1].label));
      const rightOccupied =
        i < seats.length - 1 &&
        (!seats[i + 1].available || selectedSet.has(seats[i + 1].label));

      const touchesSelected =
        (i > 0 && selectedSet.has(seats[i - 1].label)) ||
        (i < seats.length - 1 && selectedSet.has(seats[i + 1].label));

      if (leftOccupied && rightOccupied && touchesSelected) {
        gapSeats.push(seat);
      }
    }
  });

  return gapSeats;
}

export function autoResolveSeatGaps(rows, selectedLabels = []) {
  const count = selectedLabels.length;
  if (count === 0) return selectedLabels;

  for (const row of rows) {
    const selectedInRow = row.seats.filter((s) => selectedLabels.includes(s.label));
    if (selectedInRow.length > 0) {
      const available = row.seats.filter((s) => s.available);
      for (let i = 0; i <= available.length - count; i += 1) {
        const block = available.slice(i, i + count);
        const consecutive = block.every(
          (s, idx) => idx === 0 || s.colNum === block[idx - 1].colNum + 1
        );
        if (consecutive) {
          const candidate = block.map((s) => s.label);
          if (detectSingleSeatGaps(rows, candidate).length === 0) {
            return candidate;
          }
        }
      }
    }
  }
  return selectedLabels;
}

export function getShowtimeSchedule(startsAtIso) {
  const adsStart = new Date(startsAtIso);
  const doorsOpen = new Date(adsStart.getTime() - 15 * 60_000);
  const filmStart = new Date(adsStart.getTime() + 12 * 60_000);

  const fmt = (d) =>
    new Intl.DateTimeFormat(undefined, {
      hour: '2-digit',
      minute: '2-digit'
    }).format(d);

  return {
    doorsOpenTime: fmt(doorsOpen),
    adsStartTime: fmt(adsStart),
    filmStartTime: fmt(filmStart)
  };
}
