// FlimHall Movie Catalog — 10 Famous Movies in Each of the 6 Genres (60 Movies Total)
// Genres: Sci-Fi, Romance, Mystery, Adventure, Comedy, Drama

export const GENRE_LIST = ['Sci-Fi', 'Romance', 'Mystery', 'Adventure', 'Comedy', 'Drama'];

export const MOVIES_CATALOG = [
  {
    "id": 1,
    "title": "Interstellar",
    "description": "A team of explorers travel through a wormhole in space in an attempt to ensure humanity’s survival.",
    "genre": "Sci-Fi",
    "duration_min": 169,
    "release_year": 2014,
    "age_rating": "PG-13",
    "poster_url": "https://m.media-amazon.com/images/M/MV5BYzdjMDAxZGItMjI2My00ODA1LTlkNzItOWFjMDU5ZDJlYWY3XkEyXkFqcGc@._V1_FMjpg_UX800_.jpg"
  },
  {
    "id": 101,
    "title": "Inception",
    "description": "A thief who steals corporate secrets through dream-sharing technology is given the task of planting an idea.",
    "genre": "Sci-Fi",
    "duration_min": 148,
    "release_year": 2010,
    "age_rating": "PG-13",
    "poster_url": "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_FMjpg_UX800_.jpg"
  },
  {
    "id": 102,
    "title": "Dune: Part Two",
    "description": "Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators.",
    "genre": "Sci-Fi",
    "duration_min": 166,
    "release_year": 2024,
    "age_rating": "PG-13",
    "poster_url": "https://m.media-amazon.com/images/M/MV5BNTc0YmQxMjEtODI5MC00NjFiLTlkMWUtOGQ5NjFmYWUyZGJhXkEyXkFqcGc@._V1_FMjpg_UX800_.jpg"
  },
  {
    "id": 103,
    "title": "The Matrix",
    "description": "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war.",
    "genre": "Sci-Fi",
    "duration_min": 136,
    "release_year": 1999,
    "age_rating": "PG-13",
    "poster_url": "https://m.media-amazon.com/images/M/MV5BN2NmN2VhMTQtMDNiOS00NDlhLTliMjgtODE2ZTY0ODQyNDRhXkEyXkFqcGc@._V1_FMjpg_UX800_.jpg"
  },
  {
    "id": 104,
    "title": "Avatar: The Way of Water",
    "description": "Jake Sully lives with his newfound family formed on the extrasolar moon Pandora and protects them from a familiar threat.",
    "genre": "Sci-Fi",
    "duration_min": 192,
    "release_year": 2022,
    "age_rating": "PG-13",
    "poster_url": "https://m.media-amazon.com/images/M/MV5BNWI0Y2NkOWEtMmM2OC00MjQ3LWI1YzItZGQxYzQ3NzI4NWZmXkEyXkFqcGc@._V1_FMjpg_UX800_.jpg"
  },
  {
    "id": 105,
    "title": "Blade Runner 2049",
    "description": "Young Blade Runner K’s discovery of a long-buried secret leads him to track down former Blade Runner Rick Deckard.",
    "genre": "Sci-Fi",
    "duration_min": 164,
    "release_year": 2017,
    "age_rating": "PG-13",
    "poster_url": "https://m.media-amazon.com/images/M/MV5BNzA1Njg4NzYxOV5BMl5BanBnXkFtZTgwODk5NjU3MzI@._V1_FMjpg_UX800_.jpg"
  },
  {
    "id": 106,
    "title": "The Martian",
    "description": "An astronaut becomes stranded on Mars after his team assumes him dead, and must rely on his ingenuity to survive.",
    "genre": "Sci-Fi",
    "duration_min": 144,
    "release_year": 2015,
    "age_rating": "PG-13",
    "poster_url": "https://m.media-amazon.com/images/M/MV5BMTc2MTQ3MDA1Nl5BMl5BanBnXkFtZTgwODA3OTI4NjE@._V1_FMjpg_UX800_.jpg"
  },
  {
    "id": 107,
    "title": "Arrival",
    "description": "A linguist works with the military to communicate with alien lifeforms after twelve mysterious spacecraft appear.",
    "genre": "Sci-Fi",
    "duration_min": 116,
    "release_year": 2016,
    "age_rating": "PG-13",
    "poster_url": "https://m.media-amazon.com/images/M/MV5BMTExMzU0ODcxNDheQTJeQWpwZ15BbWU4MDE1OTI4MzAy._V1_FMjpg_UX800_.jpg"
  },
  {
    "id": 108,
    "title": "Edge of Tomorrow",
    "description": "A soldier fighting aliens gets to relive the same day over and over again, the day restarting every time he dies.",
    "genre": "Sci-Fi",
    "duration_min": 113,
    "release_year": 2014,
    "age_rating": "PG-13",
    "poster_url": "https://m.media-amazon.com/images/M/MV5BMTc5OTk4MTM3M15BMl5BanBnXkFtZTgwODcxNjg3MDE@._V1_FMjpg_UX800_.jpg"
  },
  {
    "id": 109,
    "title": "Guardians of the Galaxy",
    "description": "A group of intergalactic criminals must pull together to stop a fanatical warrior with plans to purge the universe.",
    "genre": "Sci-Fi",
    "duration_min": 121,
    "release_year": 2014,
    "age_rating": "PG-13",
    "poster_url": "https://m.media-amazon.com/images/M/MV5BM2ZmNjQ2MzAtNDlhNi00MmQyLWJhZDMtNmJiMjFlOWY4MzcxXkEyXkFqcGc@._V1_FMjpg_UX800_.jpg"
  },
  {
    "id": 2,
    "title": "Titanic",
    "description": "A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic.",
    "genre": "Romance",
    "duration_min": 194,
    "release_year": 1997,
    "age_rating": "PG-13",
    "poster_url": "https://m.media-amazon.com/images/M/MV5BYzYyN2FiZmUtYWYzMy00MzViLWJkZTMtOGY1ZjgzNWMwN2YxXkEyXkFqcGc@._V1_FMjpg_UX800_.jpg"
  },
  {
    "id": 201,
    "title": "La La Land",
    "description": "While navigating their careers in Los Angeles, a pianist and an actress fall in love while attempting to reconcile their aspirations.",
    "genre": "Romance",
    "duration_min": 128,
    "release_year": 2016,
    "age_rating": "PG-13",
    "poster_url": "https://m.media-amazon.com/images/M/MV5BMDllYjliOTUtMDJjZC00ODIzLWJmNGMtOWI2NzQxMjA2NzdlXkEyXkFqcGc@._V1_FMjpg_UX800_.jpg"
  },
  {
    "id": 202,
    "title": "The Notebook",
    "description": "A poor yet passionate young man falls in love with a rich young woman, giving her a sense of freedom.",
    "genre": "Romance",
    "duration_min": 123,
    "release_year": 2004,
    "age_rating": "PG-13",
    "poster_url": "https://m.media-amazon.com/images/M/MV5BZjE0ZjgzMzYtMTAxYi00NGMzLThmZDktNzFlMzA2MWRmYWQ0XkEyXkFqcGc@._V1_FMjpg_UX800_.jpg"
  },
  {
    "id": 203,
    "title": "Pride & Prejudice",
    "description": "Sparks fly when spirited Elizabeth Bennet meets single, rich, and proud Mr. Darcy in nineteenth-century England.",
    "genre": "Romance",
    "duration_min": 129,
    "release_year": 2005,
    "age_rating": "PG",
    "poster_url": "https://m.media-amazon.com/images/M/MV5BMTA1NDQ3NTcyOTNeQTJeQWpwZ15BbWU3MDA0MzA4MzE@._V1_FMjpg_UX800_.jpg"
  },
  {
    "id": 204,
    "title": "A Star Is Born",
    "description": "A musician helps a young singer find fame as age and alcoholism send his own career into a downward spiral.",
    "genre": "Romance",
    "duration_min": 136,
    "release_year": 2018,
    "age_rating": "PG-13",
    "poster_url": "https://m.media-amazon.com/images/M/MV5BNGUxZTc0NTAtNzQwMy00MmM2LTgzMGYtZWIyY2E1MGFjYmM5XkEyXkFqcGc@._V1_FMjpg_UX800_.jpg"
  },
  {
    "id": 205,
    "title": "About Time",
    "description": "At the age of 21, Tim discovers he can travel in time and change what happens and has happened in his own life.",
    "genre": "Romance",
    "duration_min": 123,
    "release_year": 2013,
    "age_rating": "PG-13",
    "poster_url": "https://m.media-amazon.com/images/M/MV5BMTA1ODUzMDA3NzFeQTJeQWpwZ15BbWU3MDgxMTYxNTk@._V1_FMjpg_UX800_.jpg"
  },
  {
    "id": 206,
    "title": "Me Before You",
    "description": "A girl in a small town forms an unlikely bond with a recently-paralyzed man she is taking care of.",
    "genre": "Romance",
    "duration_min": 110,
    "release_year": 2016,
    "age_rating": "PG-13",
    "poster_url": "https://m.media-amazon.com/images/M/MV5BMTQ2NjE4NDE2NV5BMl5BanBnXkFtZTgwOTcwNDE5NzE@._V1_FMjpg_UX800_.jpg"
  },
  {
    "id": 207,
    "title": "Crazy Rich Asians",
    "description": "This contemporary romantic comedy based on a global bestseller follows native New Yorker Rachel Chu to Singapore.",
    "genre": "Romance",
    "duration_min": 120,
    "release_year": 2018,
    "age_rating": "PG-13",
    "poster_url": "https://m.media-amazon.com/images/M/MV5BMTYxNDMyOTAxN15BMl5BanBnXkFtZTgwMDg1ODYzNTM@._V1_FMjpg_UX800_.jpg"
  },
  {
    "id": 208,
    "title": "The Fault in Our Stars",
    "description": "Two teenage cancer patients begin a life-affirming journey to visit a reclusive author in Amsterdam.",
    "genre": "Romance",
    "duration_min": 126,
    "release_year": 2014,
    "age_rating": "PG-13",
    "poster_url": "https://m.media-amazon.com/images/M/MV5BYTA4ODg5YWUtYmZiYy00Y2M4LWE0NjEtODE5MzhkYmJmZGEwXkEyXkFqcGc@._V1_FMjpg_UX800_.jpg"
  },
  {
    "id": 209,
    "title": "Notting Hill",
    "description": "The life of a simple bookshop owner changes when he meets the most famous film star in the world.",
    "genre": "Romance",
    "duration_min": 124,
    "release_year": 1999,
    "age_rating": "PG-13",
    "poster_url": "https://m.media-amazon.com/images/M/MV5BZjY3YWI5OTMtYTdlNy00ZTZiLWEwYjItN2M1MGVkMDM4ZDExXkEyXkFqcGc@._V1_FMjpg_UX800_.jpg"
  },
  {
    "id": 3,
    "title": "Shutter Island",
    "description": "Teddy Daniels and Chuck Aule, two US marshals, are sent to an asylum on a remote island to investigate a disappearance.",
    "genre": "Mystery",
    "duration_min": 138,
    "release_year": 2010,
    "age_rating": "PG-13",
    "poster_url": "https://m.media-amazon.com/images/M/MV5BN2FjNWExYzEtY2YzOC00YjNlLTllMTQtNmIwM2Q1YzBhOWM1XkEyXkFqcGc@._V1_FMjpg_UX800_.jpg"
  },
  {
    "id": 301,
    "title": "Knives Out",
    "description": "A detective investigates the death of a patriarch of an eccentric, combative family.",
    "genre": "Mystery",
    "duration_min": 130,
    "release_year": 2019,
    "age_rating": "PG-13",
    "poster_url": "https://m.media-amazon.com/images/M/MV5BZDU5ZTRkYmItZjg0Mi00ZTQwLThjMWItNWM3MTMxMzVjZmVjXkEyXkFqcGc@._V1_FMjpg_UX800_.jpg"
  },
  {
    "id": 302,
    "title": "Sherlock Holmes",
    "description": "Detective Sherlock Holmes and his stalwart partner Watson engage in a battle of wits and brawn with a nemesis.",
    "genre": "Mystery",
    "duration_min": 128,
    "release_year": 2009,
    "age_rating": "PG-13",
    "poster_url": "https://m.media-amazon.com/images/M/MV5BMTg0NjEwNjUxM15BMl5BanBnXkFtZTcwMzk0MjQ5Mg@@._V1_FMjpg_UX800_.jpg"
  },
  {
    "id": 303,
    "title": "Gone Girl",
    "description": "With his wife’s disappearance having become the focus of an intense media circus, a man sees the spotlight turned on him.",
    "genre": "Mystery",
    "duration_min": 149,
    "release_year": 2014,
    "age_rating": "PG-13",
    "poster_url": "https://m.media-amazon.com/images/M/MV5BMTk0MDQ3MzAzOV5BMl5BanBnXkFtZTgwNzU1NzE3MjE@._V1_FMjpg_UX800_.jpg"
  },
  {
    "id": 304,
    "title": "The Prestige",
    "description": "After a tragic accident, two stage magicians in 1890s London engage in a battle to create the ultimate illusion.",
    "genre": "Mystery",
    "duration_min": 130,
    "release_year": 2006,
    "age_rating": "PG-13",
    "poster_url": "https://m.media-amazon.com/images/M/MV5BZWU0NWZhYzMtZmNlYy00MjA1LTgyZWEtYmNjNzdjYmRkOTkzXkEyXkFqcGc@._V1_FMjpg_UX800_.jpg"
  },
  {
    "id": 305,
    "title": "Murder on the Orient Express",
    "description": "When a murder occurs on the train on which he’s travelling, celebrated detective Hercule Poirot is recruited to solve the case.",
    "genre": "Mystery",
    "duration_min": 114,
    "release_year": 2017,
    "age_rating": "PG-13",
    "poster_url": "https://m.media-amazon.com/images/M/MV5BNTlkYjBlZTctZjg2YS00NDMzLTlkMTMtNWExMGYyOTliMmEzXkEyXkFqcGc@._V1_FMjpg_UX800_.jpg"
  },
  {
    "id": 306,
    "title": "The Da Vinci Code",
    "description": "A murder inside the Louvre, and clues in Da Vinci paintings, lead to the discovery of a religious mystery.",
    "genre": "Mystery",
    "duration_min": 149,
    "release_year": 2006,
    "age_rating": "PG-13",
    "poster_url": "https://m.media-amazon.com/images/M/MV5BMjIxMjQyMTc3Nl5BMl5BanBnXkFtZTcwMTA1MDUzMw@@._V1_FMjpg_UX800_.jpg"
  },
  {
    "id": 307,
    "title": "Prisoners",
    "description": "When Keller Dover’s daughter and her friend go missing, he takes matters into his own hands as the police pursue multiple leads.",
    "genre": "Mystery",
    "duration_min": 153,
    "release_year": 2013,
    "age_rating": "PG-13",
    "poster_url": "https://m.media-amazon.com/images/M/MV5BMTg0NTIzMjQ1NV5BMl5BanBnXkFtZTcwNDc3MzM5OQ@@._V1_FMjpg_UX800_.jpg"
  },
  {
    "id": 308,
    "title": "Glass Onion",
    "description": "Tech billionaire Miles Bron invites his friends for a getaway on his private Greek island, where a mystery unfolds.",
    "genre": "Mystery",
    "duration_min": 139,
    "release_year": 2022,
    "age_rating": "PG-13",
    "poster_url": "https://m.media-amazon.com/images/M/MV5BMzI2ZDYxZTEtMzVlOC00OTUyLTgyNTAtYWFhNmRhZjAzZWE1XkEyXkFqcGc@._V1_FMjpg_UX800_.jpg"
  },
  {
    "id": 309,
    "title": "The Girl with the Dragon Tattoo",
    "description": "Journalist Mikael Blomkvist is aided in his search for a woman who has been missing for forty years by Lisbeth Salander.",
    "genre": "Mystery",
    "duration_min": 158,
    "release_year": 2011,
    "age_rating": "PG-13",
    "poster_url": "https://m.media-amazon.com/images/M/MV5BMTczNDk4NTQ0OV5BMl5BanBnXkFtZTcwNDAxMDgxNw@@._V1_FMjpg_UX800_.jpg"
  },
  {
    "id": 4,
    "title": "Jurassic Park",
    "description": "A pragmatic paleontologist touring an almost complete theme park on an island in Central America is tasked with protecting two kids.",
    "genre": "Adventure",
    "duration_min": 127,
    "release_year": 1993,
    "age_rating": "PG-13",
    "poster_url": "https://m.media-amazon.com/images/M/MV5BMjM2MDgxMDg0Nl5BMl5BanBnXkFtZTgwNTM2OTM5NDE@._V1_FMjpg_UX800_.jpg"
  },
  {
    "id": 401,
    "title": "Pirates of the Caribbean: The Curse of the Black Pearl",
    "description": "Blacksmith Will Turner teams up with eccentric pirate Captain Jack Sparrow to save his love from Jack’s former pirate allies.",
    "genre": "Adventure",
    "duration_min": 143,
    "release_year": 2003,
    "age_rating": "PG-13",
    "poster_url": "https://m.media-amazon.com/images/M/MV5BNDhlMzEyNzItMTA5Mi00YWRhLThlNTktYTQyMTA0MDIyNDEyXkEyXkFqcGc@._V1_FMjpg_UX800_.jpg"
  },
  {
    "id": 402,
    "title": "Indiana Jones and the Last Crusade",
    "description": "In 1938, after his father goes missing while pursuing the Holy Grail, Indiana Jones finds himself up against Adolf Hitler’semann.",
    "genre": "Adventure",
    "duration_min": 127,
    "release_year": 1989,
    "age_rating": "PG-13",
    "poster_url": "https://m.media-amazon.com/images/M/MV5BNGIxNzQ0YzYtMjNmYi00YjBlLWFjNzEtNGE3ZGFmYTczM2MwXkEyXkFqcGc@._V1_FMjpg_UX800_.jpg"
  },
  {
    "id": 403,
    "title": "The Lord of the Rings: The Fellowship of the Ring",
    "description": "A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring.",
    "genre": "Adventure",
    "duration_min": 178,
    "release_year": 2001,
    "age_rating": "PG-13",
    "poster_url": "https://m.media-amazon.com/images/M/MV5BNzIxMDQ2YTctNDY4MC00ZTRhLTk4ODQtMTVlOWY4NTdiYmMwXkEyXkFqcGc@._V1_FMjpg_UX800_.jpg"
  },
  {
    "id": 404,
    "title": "Jumanji: Welcome to the Jungle",
    "description": "Four teenagers are sucked into a magical video game, and the only way they can escape is to work together to finish the game.",
    "genre": "Adventure",
    "duration_min": 119,
    "release_year": 2017,
    "age_rating": "PG-13",
    "poster_url": "https://m.media-amazon.com/images/M/MV5BZjI5MzdmODctYjA4NS00ZmMxLWJlOWUtOGVhMjA0OGMxMWYzXkEyXkFqcGc@._V1_FMjpg_UX800_.jpg"
  },
  {
    "id": 405,
    "title": "The Mummy",
    "description": "At an archaeological dig in the ancient city of Hamunaptra, an American serving in the French Foreign Legion awakens a mummy.",
    "genre": "Adventure",
    "duration_min": 124,
    "release_year": 1999,
    "age_rating": "PG-13",
    "poster_url": "https://m.media-amazon.com/images/M/MV5BMTY4YWE0OGMtNjU0Yi00YzIwLTk3NTktM2ZiYWQwNjM4MmMxXkEyXkFqcGc@._V1_FMjpg_UX800_.jpg"
  },
  {
    "id": 406,
    "title": "Life of Pi",
    "description": "A young man who survives a disaster at sea is hurtled into an epic journey of adventure and discovery with a Bengal tiger.",
    "genre": "Adventure",
    "duration_min": 127,
    "release_year": 2012,
    "age_rating": "PG",
    "poster_url": "https://m.media-amazon.com/images/M/MV5BNTg2OTY2ODg5OF5BMl5BanBnXkFtZTcwODM5MTYxOA@@._V1_FMjpg_UX800_.jpg"
  },
  {
    "id": 407,
    "title": "The Revenant",
    "description": "A frontiersman on a fur trading expedition in the 1820s fights for survival after being mauled by a bear.",
    "genre": "Adventure",
    "duration_min": 156,
    "release_year": 2015,
    "age_rating": "PG-13",
    "poster_url": "https://m.media-amazon.com/images/M/MV5BYTgwNmQzZDctMjNmOS00OTExLTkwM2UtNzJmOTJhODFjOTdlXkEyXkFqcGc@._V1_FMjpg_UX800_.jpg"
  },
  {
    "id": 408,
    "title": "National Treasure",
    "description": "A historian races to find the legendary Templar Treasure before a team of mercenaries.",
    "genre": "Adventure",
    "duration_min": 131,
    "release_year": 2004,
    "age_rating": "PG",
    "poster_url": "https://m.media-amazon.com/images/M/MV5BMTY3NTc4OTYxMF5BMl5BanBnXkFtZTcwMjk5NzUyMw@@._V1_FMjpg_UX800_.jpg"
  },
  {
    "id": 409,
    "title": "Jungle Cruise",
    "description": "Based on Disneyland’s theme park ride where a small riverboat takes a group of travelers through a jungle filled with dangerous animals.",
    "genre": "Adventure",
    "duration_min": 127,
    "release_year": 2021,
    "age_rating": "PG-13",
    "poster_url": "https://m.media-amazon.com/images/M/MV5BMWU5ZTBkMjQtMzg2Yi00ZmJlLTk4YWEtYTc0ZjU1YzE1NGNkXkEyXkFqcGc@._V1_FMjpg_UX800_.jpg"
  },
  {
    "id": 5,
    "title": "Home Alone",
    "description": "An eight-year-old troublemaker, mistakenly left home alone, must defend his home against a pair of burglars on Christmas Eve.",
    "genre": "Comedy",
    "duration_min": 103,
    "release_year": 1990,
    "age_rating": "PG",
    "poster_url": "https://m.media-amazon.com/images/M/MV5BNzNmNmQ2ZDEtMTc1MS00NjNiLThlMGUtZmQxNTg1Nzg5NWMzXkEyXkFqcGc@._V1_FMjpg_UX800_.jpg"
  },
  {
    "id": 501,
    "title": "The Hangover",
    "description": "Three buddies wake up from a bachelor party in Las Vegas, with no memory of the previous night and the bachelor missing.",
    "genre": "Comedy",
    "duration_min": 100,
    "release_year": 2009,
    "age_rating": "PG-13",
    "poster_url": "https://m.media-amazon.com/images/M/MV5BNDI2MzBhNzgtOWYyOS00NDM2LWE0OGYtOGQ0M2FjMTI2NTllXkEyXkFqcGc@._V1_FMjpg_UX800_.jpg"
  },
  {
    "id": 502,
    "title": "Superbad",
    "description": "Two co-dependent high school seniors are forced to deal with separation anxiety after their plan to stage a party goes awry.",
    "genre": "Comedy",
    "duration_min": 113,
    "release_year": 2007,
    "age_rating": "PG-13",
    "poster_url": "https://m.media-amazon.com/images/M/MV5BNjk0MzdlZGEtNTRkOC00ZDRiLWJkYjAtMzUzYTRiNzk1YTViXkEyXkFqcGc@._V1_FMjpg_UX800_.jpg"
  },
  {
    "id": 503,
    "title": "The Grand Budapest Hotel",
    "description": "A writer encounters the owner of an aging high-class hotel, who tells him of his early years serving as a lobby boy.",
    "genre": "Comedy",
    "duration_min": 99,
    "release_year": 2014,
    "age_rating": "PG-13",
    "poster_url": "https://m.media-amazon.com/images/M/MV5BMzM5NjUxOTEyMl5BMl5BanBnXkFtZTgwNjEyMDM0MDE@._V1_FMjpg_UX800_.jpg"
  },
  {
    "id": 504,
    "title": "Mrs. Doubtfire",
    "description": "After a bitter divorce, an actor disguises himself as a female housekeeper to spend time with his children.",
    "genre": "Comedy",
    "duration_min": 125,
    "release_year": 1993,
    "age_rating": "PG-13",
    "poster_url": "https://m.media-amazon.com/images/M/MV5BY2E2MDc5ZGEtOTNlZS00Mjg4LThlNzUtMDY2Zjc4ZTViNWY0XkEyXkFqcGc@._V1_FMjpg_UX800_.jpg"
  },
  {
    "id": 505,
    "title": "Night at the Museum",
    "description": "A newly recruited night security guard at the Museum of Natural History discovers that an ancient curse causes the animals to come to life.",
    "genre": "Comedy",
    "duration_min": 108,
    "release_year": 2006,
    "age_rating": "PG",
    "poster_url": "https://m.media-amazon.com/images/M/MV5BNGMyYjYyZDAtNzRiZC00ZjRkLTkwYjktODkxODQzNTFiMTVmXkEyXkFqcGc@._V1_FMjpg_UX800_.jpg"
  },
  {
    "id": 506,
    "title": "School of Rock",
    "description": "After being kicked out of his rock band, Dewey Finn becomes a substitute teacher of an uptight elementary private school.",
    "genre": "Comedy",
    "duration_min": 109,
    "release_year": 2003,
    "age_rating": "PG-13",
    "poster_url": "https://m.media-amazon.com/images/M/MV5BOTg2NDU4Mjg2NV5BMl5BanBnXkFtZTgwNjQ0MDIyMDI@._V1_FMjpg_UX800_.jpg"
  },
  {
    "id": 507,
    "title": "The Intern",
    "description": "Seventy-year-old widower Ben Whittaker has discovered that retirement isn’t all it’s cracked up to be and becomes a senior intern.",
    "genre": "Comedy",
    "duration_min": 121,
    "release_year": 2015,
    "age_rating": "PG-13",
    "poster_url": "https://m.media-amazon.com/images/M/MV5BMTUyNjE5NjI5OF5BMl5BanBnXkFtZTgwNzYzMzU3NjE@._V1_FMjpg_UX800_.jpg"
  },
  {
    "id": 508,
    "title": "Game Night",
    "description": "A group of friends who meet regularly for game nights find themselves entangled in a real-life mystery.",
    "genre": "Comedy",
    "duration_min": 100,
    "release_year": 2018,
    "age_rating": "PG-13",
    "poster_url": "https://m.media-amazon.com/images/M/MV5BMjI3ODkzNDk5MF5BMl5BanBnXkFtZTgwNTEyNjY2NDM@._V1_FMjpg_UX800_.jpg"
  },
  {
    "id": 509,
    "title": "Free Guy",
    "description": "When a bank teller discovers he’s actually a background player in an open-world video game, he decides to become the hero.",
    "genre": "Comedy",
    "duration_min": 115,
    "release_year": 2021,
    "age_rating": "PG-13",
    "poster_url": "https://m.media-amazon.com/images/M/MV5BN2I0MGMxYjUtZTZiMS00MzMxLTkzNWYtMDUyZmUwY2ViYTljXkEyXkFqcGc@._V1_FMjpg_UX800_.jpg"
  },
  {
    "id": 6,
    "title": "The Shawshank Redemption",
    "description": "Over the course of several years, two convicts form a friendship, seeking consolation and, eventually, redemption through basic compassion.",
    "genre": "Drama",
    "duration_min": 142,
    "release_year": 1994,
    "age_rating": "PG-13",
    "poster_url": "https://m.media-amazon.com/images/M/MV5BMDAyY2FhYjctNDc5OS00MDNlLThiMGUtY2UxYWVkNGY2ZjljXkEyXkFqcGc@._V1_FMjpg_UX800_.jpg"
  },
  {
    "id": 601,
    "title": "Oppenheimer",
    "description": "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
    "genre": "Drama",
    "duration_min": 180,
    "release_year": 2023,
    "age_rating": "PG-13",
    "poster_url": "https://m.media-amazon.com/images/M/MV5BN2JkMDc5MGQtZjg3YS00NmFiLWIyZmQtZTJmNTM5MjVmYTQ4XkEyXkFqcGc@._V1_FMjpg_UX800_.jpg"
  },
  {
    "id": 602,
    "title": "Forrest Gump",
    "description": "The history of the United States from the 1950s to the 70s unfolds from the perspective of an Alabama man with an IQ of 75.",
    "genre": "Drama",
    "duration_min": 142,
    "release_year": 1994,
    "age_rating": "PG-13",
    "poster_url": "https://m.media-amazon.com/images/M/MV5BNDYwNzVjMTItZmU5YS00YjQ5LTljYjgtMjY2NDVmYWMyNWFmXkEyXkFqcGc@._V1_FMjpg_UX800_.jpg"
  },
  {
    "id": 603,
    "title": "The Pursuit of Happyness",
    "description": "A struggling salesman takes custody of his son as he’s poised to begin a life-changing professional career.",
    "genre": "Drama",
    "duration_min": 117,
    "release_year": 2006,
    "age_rating": "PG-13",
    "poster_url": "https://m.media-amazon.com/images/M/MV5BMTQ5NjQ0NDI3NF5BMl5BanBnXkFtZTcwNDI0MjEzMw@@._V1_FMjpg_UX800_.jpg"
  },
  {
    "id": 604,
    "title": "The Green Mile",
    "description": "A tale set on death row where gentle giant John Coffey possesses the mysterious power to heal people’s ailments.",
    "genre": "Drama",
    "duration_min": 189,
    "release_year": 1999,
    "age_rating": "PG-13",
    "poster_url": "https://m.media-amazon.com/images/M/MV5BMTUxMzQyNjA5MF5BMl5BanBnXkFtZTYwOTU2NTY3._V1_FMjpg_UX800_.jpg"
  },
  {
    "id": 605,
    "title": "A Beautiful Mind",
    "description": "After John Nash, a brilliant but asocial mathematician, accepts secret work in cryptography, his life takes a turn.",
    "genre": "Drama",
    "duration_min": 135,
    "release_year": 2001,
    "age_rating": "PG-13",
    "poster_url": "https://m.media-amazon.com/images/M/MV5BYjgzNjFkMmItOGJhNi00NWM3LWJlYTUtNDExMGQ3ZTI3NjJkXkEyXkFqcGc@._V1_FMjpg_UX800_.jpg"
  },
  {
    "id": 606,
    "title": "Whiplash",
    "description": "A promising young drummer enrolls at a cut-throat music conservatory where his dreams of greatness are mentored by an instructor.",
    "genre": "Drama",
    "duration_min": 106,
    "release_year": 2014,
    "age_rating": "PG-13",
    "poster_url": "https://m.media-amazon.com/images/M/MV5BMDFjOWFkYzktYzhhMC00NmYyLTkwY2EtYjViMDhmNzg0OGFkXkEyXkFqcGc@._V1_FMjpg_UX800_.jpg"
  },
  {
    "id": 607,
    "title": "Good Will Hunting",
    "description": "Will Hunting, a janitor at M.I.T., has a gift for mathematics, but needs help from a psychologist to find direction in his life.",
    "genre": "Drama",
    "duration_min": 126,
    "release_year": 1997,
    "age_rating": "PG-13",
    "poster_url": "https://m.media-amazon.com/images/M/MV5BNDdjZGQ5YzEtNTc2My00Mjc0LWFlMTctYzkwMzZlNzdiZWYzXkEyXkFqcGc@._V1_FMjpg_UX800_.jpg"
  },
  {
    "id": 608,
    "title": "The Truman Show",
    "description": "An insurance salesman discovers his whole life is actually a reality TV show broadcast to the world.",
    "genre": "Drama",
    "duration_min": 103,
    "release_year": 1998,
    "age_rating": "PG",
    "poster_url": "https://m.media-amazon.com/images/M/MV5BNzA3ZjZlNzYtMTdjMy00NjMzLTk5ZGYtMTkyYzNiOGM1YmM3XkEyXkFqcGc@._V1_FMjpg_UX800_.jpg"
  },
  {
    "id": 609,
    "title": "The Social Network",
    "description": "As Harvard student Mark Zuckerberg creates the social networking site that would become known as Facebook, he is sued by the twins.",
    "genre": "Drama",
    "duration_min": 120,
    "release_year": 2010,
    "age_rating": "PG-13",
    "poster_url": "https://m.media-amazon.com/images/M/MV5BMjlkNTE5ZTUtNGEwNy00MGVhLThmZjMtZjU1NDE5Zjk1NDZkXkEyXkFqcGc@._V1_FMjpg_UX800_.jpg"
  }
];
