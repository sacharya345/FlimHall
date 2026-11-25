// FlimHall Auditorium Seat & Showtime Rules:
// - 10 seats per row, snake numbering from the front screen
// - Skip Row 13 and Seat #13
// - Open wheelchair accessible space is located in front of Row 1 (Row 1 is a normal numbered row)
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
      isWheelchair: false,
      direction: isReverseRow ? 'R ← L' : 'L → R'
    }));

    return {
      rowIndex,
      rowLetter,
      displayRow,
      isWheelchairRow: false,
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

export function suggestBestSeats(rows = [], partySize = 2) {
  if (!rows.length || partySize < 1) return [];
  const idealRowIndex = Math.floor(rows.length * 0.45);
  const rankedRows = [...rows].sort(
    (a, b) => Math.abs(a.rowIndex - idealRowIndex) - Math.abs(b.rowIndex - idealRowIndex)
  );

  for (const row of rankedRows) {
    const avail = row.seats.filter((s) => s.available);
    if (avail.length < partySize) continue;
    let bestBlock = null;
    let bestScore = Infinity;

    for (let i = 0; i <= avail.length - partySize; i += 1) {
      const block = avail.slice(i, i + partySize);
      const consecutive = block.every(
        (s, idx) => idx === 0 || s.colNum === block[idx - 1].colNum + 1
      );
      if (!consecutive) continue;
      const labels = block.map((s) => s.label);
      if (detectSingleSeatGaps(rows, labels).length > 0) continue;

      const avgCol = block.reduce((sum, s) => sum + s.colNum, 0) / partySize;
      const centerDist = Math.abs(avgCol - 5.5);
      if (centerDist < bestScore) {
        bestScore = centerDist;
        bestBlock = labels;
      }
    }

    if (bestBlock) return bestBlock;
  }

  const allAvail = rows.flatMap((r) => r.seats.filter((s) => s.available));
  return allAvail.slice(0, partySize).map((s) => s.label);
}

export function analyzeSeatSeparation(rows = [], selectedLabels = []) {
  if (!rows.length || selectedLabels.length < 2) {
    return {
      isSeparated: false,
      distinctRowsCount: selectedLabels.length ? 1 : 0,
      reason: '',
      suggestedSeats: [],
      suggestedRowNumber: null
    };
  }

  const selectedSet = new Set(selectedLabels);
  const selectedSeatObjects = [];
  rows.forEach((row) => {
    row.seats.forEach((seat) => {
      if (selectedSet.has(seat.label)) {
        selectedSeatObjects.push(seat);
      }
    });
  });

  if (selectedSeatObjects.length < 2) {
    return {
      isSeparated: false,
      distinctRowsCount: 1,
      reason: '',
      suggestedSeats: [],
      suggestedRowNumber: null
    };
  }

  const distinctRows = new Set(selectedSeatObjects.map((s) => s.displayRow));
  const distinctRowsCount = distinctRows.size;

  let isContiguousSameRow = false;
  if (distinctRowsCount === 1) {
    const sortedByCol = [...selectedSeatObjects].sort((a, b) => a.colNum - b.colNum);
    isContiguousSameRow = sortedByCol.every(
      (s, idx) => idx === 0 || s.colNum === sortedByCol[idx - 1].colNum + 1
    );
  }

  if (isContiguousSameRow) {
    return {
      isSeparated: false,
      distinctRowsCount: 1,
      reason: '',
      suggestedSeats: [],
      suggestedRowNumber: null
    };
  }

  const suggestedSeats = suggestBestSeats(rows, selectedLabels.length);
  const firstSuggested = rows
    .flatMap((r) => r.seats)
    .find((s) => s.label === suggestedSeats[0]);

  const reason =
    distinctRowsCount > 1
      ? `You selected ${selectedLabels.length} seats across ${distinctRowsCount} different rows (${selectedLabels.join(', ')}).`
      : `Your ${selectedLabels.length} selected seats (${selectedLabels.join(', ')}) are separated in Row ${selectedSeatObjects[0].displayRow} and not side-by-side.`;

  return {
    isSeparated: true,
    distinctRowsCount,
    reason,
    suggestedSeats,
    suggestedRowNumber: firstSuggested?.displayRow || null
  };
}
