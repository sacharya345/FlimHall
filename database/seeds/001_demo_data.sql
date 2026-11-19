-- Seed exactly 40 selected movies on a fresh database.
-- Existing non-NULL posters, movie details, bookings and schedules are preserved.
BEGIN;
INSERT INTO auditoriums (name, seat_rows, seat_columns) VALUES
  ('Oulu Auditorium 1', 10, 10),
  ('Oulu Auditorium 2', 20, 10),
  ('Tampere Auditorium 1', 10, 10),
  ('Tampere Auditorium 2', 20, 10)
ON CONFLICT (name) DO NOTHING;

INSERT INTO movies (title, description, genre, duration_min, age_rating, release_year, poster_url) VALUES
  ('Interstellar', 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity''s survival.', 'Sci-Fi', 169, 'PG-13', 2014, 'https://resizing.flixster.com/bd5A1TM4Xlur_sjlTlQux9HALic=/164x246/v2/https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p10543523_p_v8_as.jpg'),
  ('Inception', 'A thief who steals corporate secrets through dream-sharing technology is given the task of planting an idea.', 'Sci-Fi', 148, 'PG-13', 2010, 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_FMjpg_UX1000_.jpg'),
  ('Dune: Part Two', 'Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators.', 'Sci-Fi', 166, 'PG-13', 2024, 'https://s3.amazonaws.com/nightjarprod/content/uploads/sites/238/2024/01/04112042/cBDoFHJVcZqAonkTyhN9sMEggi5-scaled.jpg'),
  ('The Matrix', 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war.', 'Sci-Fi', 136, 'PG-13', 1999, 'https://static.wikia.nocookie.net/matrix/images/5/56/The_Matrix_digital_release_cover.jpg/revision/latest?cb=20210908111245'),
  ('Avatar: The Way of Water', 'Jake Sully lives with his newfound family formed on the extrasolar moon Pandora and protects them from a familiar threat.', 'Sci-Fi', 192, 'PG-13', 2022, 'https://www.levykauppax.fi/cover/normal/9/98/988274.jpg'),
  ('Blade Runner 2049', 'Young Blade Runner K''s discovery of a long-buried secret leads him to track down former Blade Runner Rick Deckard.', 'Sci-Fi', 164, 'PG-13', 2017, 'https://m.media-amazon.com/images/M/MV5BNzA1Njg4NzYxOV5BMl5BanBnXkFtZTgwODk5NjU3MzI@._V1_.jpg'),
  ('The Martian', 'An astronaut becomes stranded on Mars after his team assumes him dead, and must rely on his ingenuity to survive.', 'Sci-Fi', 144, 'PG-13', 2015, 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRFSI0ocwk_o3nGCeDm4JzVPjDwrxy-ZiN7WCGvcqp7cJt4S6QIJ59XVp2eYsjb0xThtol3ON_NcSUTmVNCyTaM5bTfIjgtnXy31s5riG_u&usqp=CAc'),
  ('Titanic', 'A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic.', 'Romance', 194, 'PG-13', 1997, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRElgYdtpvFPL4yrw_OohhgHbO0rhjGBGN_KDFtZWblAA&s=10'),
  ('La La Land', 'While navigating their careers in Los Angeles, a pianist and an actress fall in love while attempting to reconcile their aspirations.', 'Romance', 128, 'PG-13', 2016, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdI5_qZG4pJ-rIZL-ZAYXtDe_p-Pi_kz_IFM_ERyHiy9spFE5lDqnm68bn&s=10'),
  ('The Notebook', 'A poor yet passionate young man falls in love with a rich young woman, giving her a sense of freedom.', 'Romance', 123, 'PG-13', 2004, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyI5GiDa1j-_EeAGUyDT7vAFUbUCdQz9IhP17RK5cOJg&s=10'),
  ('Pride & Prejudice', 'Sparks fly when spirited Elizabeth Bennet meets single, rich, and proud Mr. Darcy in nineteenth-century England.', 'Romance', 129, 'PG', 2005, 'https://www.worldofbooks.com/cdn/shop/files/0143036238.jpg?v=1750811876&width=493'),
  ('A Star Is Born', 'A musician helps a young singer find fame as age and alcoholism send his own career into a downward spiral.', 'Romance', 136, 'PG-13', 2018, 'https://upload.wikimedia.org/wikipedia/en/3/39/A_Star_is_Born.png?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=original'),
  ('About Time', 'At the age of 21, Tim discovers he can travel in time and change what happens and has happened in his own life.', 'Romance', 123, 'PG-13', 2013, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqOyC1nTrksN3DCAcKK6QVSwwZs_VlHHYYCx3LOLickg&s'),
  ('Me Before You', 'A girl in a small town forms an unlikely bond with a recently-paralyzed man she is taking care of.', 'Romance', 110, 'PG-13', 2016, 'https://m.media-amazon.com/images/M/MV5BZTFjMTAzZmYtM2JiNi00ZDlhLWFiMmMtMWMzM2U4NzkxMjE5XkEyXkFqcGc@._V1_.jpg'),
  ('Shutter Island', 'Teddy Daniels and Chuck Aule, two US marshals, are sent to an asylum on a remote island to investigate a disappearance.', 'Mystery', 138, 'PG-13', 2010, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNvOkg7GiattqZOe4KtAuXzQKuXPxtJDW0Rb97WVJVaeAIxfxWHY_6xfQ&s=10'),
  ('Knives Out', 'A detective investigates the death of a patriarch of an eccentric, combative family.', 'Mystery', 130, 'PG-13', 2019, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSX7O8yreIkrcgMbI99_RUv6390h2QPNglhe8mBFGdw9mjcEZsB8nyLDs0&s=10'),
  ('Sherlock Holmes', 'Detective Sherlock Holmes and his stalwart partner Watson engage in a battle of wits and brawn with a nemesis.', 'Mystery', 128, 'PG-13', 2009, 'https://m.media-amazon.com/images/M/MV5BMTg0NjEwNjUxM15BMl5BanBnXkFtZTcwMzk0MjQ5Mg@@._V1_.jpg'),
  ('Gone Girl', 'With his wife''s disappearance having become the focus of an intense media circus, a man sees the spotlight turned on him.', 'Mystery', 149, 'PG-13', 2014, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwC98bcMXhl6RrnjunQQPi5GefTDzD75RkPi1VKR3hzbUoW4OAYzWNHxg7&s=10'),
  ('The Prestige', 'After a tragic accident, two stage magicians in 1890s London engage in a battle to create the ultimate illusion.', 'Mystery', 130, 'PG-13', 2006, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbZhejma75-bMBlUz_oUA0YsYsa1s26P4oxo_5JnKp1A&s=10'),
  ('Murder on the Orient Express', 'When a murder occurs on the train on which he''s travelling, celebrated detective Hercule Poirot is recruited to solve the case.', 'Mystery', 114, 'PG-13', 2017, 'https://cdn.loaded.com/500x706/media/catalog/product/0/2/023030320203.jpg'),
  ('The Da Vinci Code', 'A murder inside the Louvre, and clues in Da Vinci paintings, lead to the discovery of a religious mystery.', 'Mystery', 149, 'PG-13', 2006, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYuV44pQO815daedrRicc1lC839yMVqZ4jtzEZIoCb5kdtyrJtykHh2wbs&s=10'),
  ('Jurassic Park', 'A pragmatic paleontologist touring an almost complete theme park on an island in Central America is tasked with protecting two kids.', 'Adventure', 127, 'PG-13', 1993, 'https://i-viaplay-com.akamaized.net/viaplay-prod/44/636/1686302783-e898146b9ddc6a1926c37e14e2af0394c5fa5a27_FI.jpg?width=400&height=600'),
  ('Pirates of the Caribbean: The Curse of the Black Pearl', 'Blacksmith Will Turner teams up with eccentric pirate Captain Jack Sparrow to save his love from Jack''s former pirate allies.', 'Adventure', 143, 'PG-13', 2003, 'https://upload.wikimedia.org/wikipedia/en/8/89/Pirates_of_the_Caribbean_-_The_Curse_of_the_Black_Pearl.png'),
  ('Indiana Jones and the Last Crusade', 'In 1938, after his father goes missing while pursuing the Holy Grail, Indiana Jones finds himself up against the Nazis in a race to find the Holy Grail.', 'Adventure', 127, 'PG-13', 1989, 'https://m.media-amazon.com/images/I/81MiDZxR7mL._AC_UF894,1000_QL80_.jpg'),
  ('The Lord of the Rings: The Fellowship of the Ring', 'A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring.', 'Adventure', 178, 'PG-13', 2001, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmCc9ivhL7L9tkGdw32vdtnCBb3c5kQCx3FNNpWSYL0A&s=10'),
  ('Jumanji: Welcome to the Jungle', 'Four teenagers are sucked into a magical video game, and the only way they can escape is to work together to finish the game.', 'Adventure', 119, 'PG-13', 2017, 'https://resizing.flixster.com/_wLjLskr8hkNBaN0dRJDmNUfsCM=/620x336/v2/https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p13499680_v_h9_ak.jpg'),
  ('The Mummy', 'At an archaeological dig in the ancient city of Hamunaptra, an American serving in the French Foreign Legion awakens a mummy.', 'Adventure', 124, 'PG-13', 1999, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQyAEXQbL0Y0doGa1qdtOrJ9s5lKxgcahleW3585elO1tzPam5Xzv6N4cU&s=10'),
  ('Life of Pi', 'A young man who survives a disaster at sea is hurtled into an epic journey of adventure and discovery with a Bengal tiger.', 'Adventure', 127, 'PG', 2012, 'https://m.media-amazon.com/images/M/MV5BNTg2OTY2ODg5OF5BMl5BanBnXkFtZTcwODM5MTYxOA@@._V1_FMjpg_UX1000_.jpg'),
  ('Home Alone', 'An eight-year-old troublemaker, mistakenly left home alone, must defend his home against a pair of burglars on Christmas Eve.', 'Comedy', 103, 'PG', 1990, 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQZqaTRWbAfzl9PZ7dXBbjo-iwqHZQRf0l01lQwkZvRKvO2oQ2JeD2p5ucyxucLL7ysnPxn1I-yV_6dHd2XgA8UuJ4Y1UEv8qtUTTbgA4pAj-7ZGG0HYhBR&usqp=CAc'),
  ('The Hangover', 'Three buddies wake up from a bachelor party in Las Vegas, with no memory of the previous night and the bachelor missing.', 'Comedy', 100, 'PG-13', 2009, 'https://m.media-amazon.com/images/M/MV5BNDI2MzBhNzgtOWYyOS00NDM2LWE0OGYtOGQ0M2FjMTI2NTllXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg'),
  ('Superbad', 'Two co-dependent high school seniors are forced to deal with separation anxiety after their plan to stage a party goes awry.', 'Comedy', 113, 'PG-13', 2007, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNc3QtT63KF7eyzkV2U7j45p9QBn_g51pjJEjq167HfA&s=10'),
  ('The Grand Budapest Hotel', 'A writer encounters the owner of an aging high-class hotel, who tells him of his early years serving as a lobby boy.', 'Comedy', 99, 'PG-13', 2014, 'https://m.media-amazon.com/images/I/91HHTI-Yt4L._AC_UF894,1000_QL80_.jpg'),
  ('Mrs. Doubtfire', 'After a bitter divorce, an actor disguises himself as a female housekeeper to spend time with his children.', 'Comedy', 125, 'PG-13', 1993, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLSI37WzdX_e2hyXKCtPI8CxYTLvayTtPL5LwIT4iB54aRK9gr6EJg2G0&s=10'),
  ('Night at the Museum', 'A newly recruited night security guard at the Museum of Natural History discovers that an ancient curse causes the animals to come to life.', 'Comedy', 108, 'PG', 2006, 'https://m.media-amazon.com/images/I/816af-SX6nL._AC_UF894,1000_QL80_.jpg'),
  ('The Shawshank Redemption', 'Over the course of several years, two convicts form a friendship, seeking consolation and, eventually, redemption through basic compassion.', 'Drama', 142, 'PG-13', 1994, 'https://mediaproxy.tvtropes.org/width/1200/https://static.tvtropes.org/pmwiki/pub/images/6fa79a3251cbf9c1c929aaec71ebb1309c57566a61d490045de285525914f285_ur12002c1600_ri__waifu2x_art_noise1.png'),
  ('Oppenheimer', 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.', 'Drama', 180, 'PG-13', 2023, 'https://thumb.wikimedia.org/wikipedia/en/thumb/4/4a/Oppenheimer_%28film%29.jpg/250px-Oppenheimer_%28film%29.jpg?utm_source=en.wikipedia.org&utm_campaign=parser&utm_content=thumbnail'),
  ('Forrest Gump', 'The history of the United States from the 1950s to the 70s unfolds from the perspective of an Alabama man with an IQ of 75.', 'Drama', 142, 'PG-13', 1994, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwLk7Qft3guxcno3RQUU_rBchL1ymHlUVdj1hzALkApQ&s'),
  ('The Pursuit of Happyness', 'A struggling salesman takes custody of his son as he''s poised to begin a life-changing professional career.', 'Drama', 117, 'PG-13', 2006, 'https://m.media-amazon.com/images/S/pv-target-images/ea3fbd0279409ad583e4275d5bc7f65f5dffa4627dc8107ce6812220a2a857d5.jpg'),
  ('The Green Mile', 'A tale set on death row where gentle giant John Coffey possesses the mysterious power to heal people''s ailments.', 'Drama', 189, 'PG-13', 1999, 'https://m.media-amazon.com/images/M/MV5BMTUxMzQyNjA5MF5BMl5BanBnXkFtZTYwOTU2NTY3._V1_FMjpg_UX1000_.jpg'),
  ('A Beautiful Mind', 'After John Nash, a brilliant but asocial mathematician, accepts secret work in cryptography, his life takes a turn.', 'Drama', 135, 'PG-13', 2001, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwwivG6yetVlRkEkpuCXhX8Ysn0ifZv4o2TsAtY111Pxrk9FPyuyyUFiNV&s=10')
ON CONFLICT (lower(title)) DO UPDATE
SET poster_url = EXCLUDED.poster_url
WHERE movies.poster_url IS NULL;

-- Schedule one screening for each seeded movie without any screenings.
-- Start after existing screenings, using four-hour slots in Helsinki time.
LOCK TABLE screenings IN SHARE ROW EXCLUSIVE MODE;
WITH halls AS (
  SELECT id, row_number() OVER (ORDER BY name) - 1 AS idx
  FROM auditoriums WHERE name IN ('Oulu Auditorium 1','Oulu Auditorium 2','Tampere Auditorium 1','Tampere Auditorium 2')
), pending AS (
  SELECT id, row_number() OVER (ORDER BY id) - 1 AS idx
  FROM movies m WHERE title IN ('Interstellar', 'Inception', 'Dune: Part Two', 'The Matrix', 'Avatar: The Way of Water', 'Blade Runner 2049', 'The Martian', 'Titanic', 'La La Land', 'The Notebook', 'Pride & Prejudice', 'A Star Is Born', 'About Time', 'Me Before You', 'Shutter Island', 'Knives Out', 'Sherlock Holmes', 'Gone Girl', 'The Prestige', 'Murder on the Orient Express', 'The Da Vinci Code', 'Jurassic Park', 'Pirates of the Caribbean: The Curse of the Black Pearl', 'Indiana Jones and the Last Crusade', 'The Lord of the Rings: The Fellowship of the Ring', 'Jumanji: Welcome to the Jungle', 'The Mummy', 'Life of Pi', 'Home Alone', 'The Hangover', 'Superbad', 'The Grand Budapest Hotel', 'Mrs. Doubtfire', 'Night at the Museum', 'The Shawshank Redemption', 'Oppenheimer', 'Forrest Gump', 'The Pursuit of Happyness', 'The Green Mile', 'A Beautiful Mind')
  AND NOT EXISTS (SELECT 1 FROM screenings s WHERE s.movie_id=m.id)
), anchor AS (
  SELECT GREATEST((now() AT TIME ZONE 'Europe/Helsinki')::date,
    COALESCE(MAX((s.starts_at + make_interval(mins => m.duration_min + 15)) AT TIME ZONE 'Europe/Helsinki')::date, (now() AT TIME ZONE 'Europe/Helsinki')::date)) + 1 AS day
  FROM screenings s JOIN movies m ON m.id=s.movie_id
)
INSERT INTO screenings (movie_id, auditorium_id, starts_at, base_price)
SELECT p.id, h.id, ((a.day + (p.idx / 12)::int) + TIME '12:00' + make_interval(hours => ((p.idx / 4) % 3 * 4)::int)) AT TIME ZONE 'Europe/Helsinki', 14.00
FROM pending p JOIN halls h ON h.idx = p.idx % 4 CROSS JOIN anchor a;
COMMIT;
