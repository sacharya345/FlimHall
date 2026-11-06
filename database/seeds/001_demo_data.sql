INSERT INTO auditoriums (name, seat_rows, seat_columns)
VALUES ('Screen 1', 8, 10), ('Screen 2', 8, 10)
ON CONFLICT (name) DO NOTHING;

INSERT INTO movies (title, description, genre, duration_min, age_rating)
VALUES
  ('The Last Horizon', 'A deep-space crew races to bring a lost station home before its orbit decays.', 'Sci-Fi', 128, 'PG-13'),
  ('Midnight in Bloom', 'Two strangers find a new beginning during one unforgettable city night.', 'Romance', 104, 'PG-13'),
  ('The Clockwork Case', 'A sharp detective follows a trail of impossible clues through a changing city.', 'Mystery', 116, 'PG-13'),
  ('Wildwood', 'A family discovers that the forest beyond their town is full of unexpected magic.', 'Adventure', 110, 'PG'),
  ('Laugh Track', 'An aspiring comic gets one week to turn a tiny club into a big break.', 'Comedy', 97, 'PG-13'),
  ('Deep Blue', 'A marine biologist uncovers a mystery in the deepest part of the ocean.', 'Drama', 121, 'PG-13')
ON CONFLICT (lower(title)) DO NOTHING;

WITH slots(slot_index, show_time) AS (
  VALUES (0, TIME '12:00'), (1, TIME '16:00'), (2, TIME '20:00')
),
dates(day_offset) AS (
  SELECT generate_series(0, 6)
),
movie_order AS (
  SELECT m.id AS movie_id,
         row_number() OVER (ORDER BY m.id) - 1 AS movie_index
  FROM movies m
),
schedule AS (
  SELECT movie_order.movie_id, a.id AS auditorium_id,
         ((current_date + dates.day_offset)::timestamp + slots.show_time) AS starts_at
  FROM movie_order
  CROSS JOIN dates
  JOIN slots ON slots.slot_index = movie_order.movie_index % 3
  JOIN auditoriums a ON a.id = (
    SELECT id FROM auditoriums ORDER BY id
    OFFSET (movie_order.movie_index / 3) LIMIT 1
  )
)
INSERT INTO screenings (movie_id, auditorium_id, starts_at, base_price)
SELECT schedule.movie_id, schedule.auditorium_id, schedule.starts_at, 14.00
FROM schedule
WHERE schedule.starts_at > now()
  AND NOT EXISTS (
    SELECT 1 FROM screenings existing
    WHERE existing.movie_id = schedule.movie_id
      AND existing.auditorium_id = schedule.auditorium_id
      AND existing.starts_at = schedule.starts_at
  );
