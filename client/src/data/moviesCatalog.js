// FlimHall Movie Catalog — 10 Movies in Each of the 6 Genres (60 Movies Total)
// Genres: Sci-Fi, Romance, Mystery, Adventure, Comedy, Drama

export const GENRE_LIST = ['Sci-Fi', 'Romance', 'Mystery', 'Adventure', 'Comedy', 'Drama'];

export const MOVIES_CATALOG = [
  // =========================================================================
  // 1. SCI-FI (10 Movies)
  // =========================================================================
  {
    id: 1,
    title: 'The Last Horizon',
    description: 'A deep-space crew races to bring a lost station home before its orbit decays.',
    genre: 'Sci-Fi',
    duration_min: 128,
    release_year: 2026,
    age_rating: 'PG-13',
    poster_url: ''
  },
  {
    id: 101,
    title: 'Neon Protocol',
    description: 'In a rain-drenched cybernetic metropolis, an AI ethics investigator uncovers a rogue memory network.',
    genre: 'Sci-Fi',
    duration_min: 134,
    release_year: 2026,
    age_rating: 'PG-13',
    poster_url: ''
  },
  {
    id: 102,
    title: 'Echoes of Titan',
    description: 'First-wave colonists on Saturn’s largest moon detect a rhythmic signal beneath the methane lakes.',
    genre: 'Sci-Fi',
    duration_min: 142,
    release_year: 2025,
    age_rating: 'PG-13',
    poster_url: ''
  },
  {
    id: 103,
    title: 'Solaris Drift',
    description: 'A solar-sail cargo pilot must navigate a coronal mass ejection to deliver medical supplies to Mars.',
    genre: 'Sci-Fi',
    duration_min: 118,
    release_year: 2025,
    age_rating: 'PG',
    poster_url: ''
  },
  {
    id: 104,
    title: 'Chronos Gate',
    description: 'Physicists testing a quantum relay accidentally open a four-hour window into next week.',
    genre: 'Sci-Fi',
    duration_min: 125,
    release_year: 2024,
    age_rating: 'PG-13',
    poster_url: ''
  },
  {
    id: 105,
    title: 'Orbital Zero',
    description: 'Cut off from mission control, three astronauts aboard a lunar shipyard must rebuild their life support.',
    genre: 'Sci-Fi',
    duration_min: 115,
    release_year: 2024,
    age_rating: 'PG-13',
    poster_url: ''
  },
  {
    id: 106,
    title: 'Synthetic Dawn',
    description: 'An android botanist tending the last greenhouse in the Arctic circle begins dreaming of spring.',
    genre: 'Sci-Fi',
    duration_min: 112,
    release_year: 2023,
    age_rating: 'PG',
    poster_url: ''
  },
  {
    id: 107,
    title: 'Starlight Nomad',
    description: 'A generation ship crossing the Perseus Arm faces a generational vote on whether to settle an ocean world.',
    genre: 'Sci-Fi',
    duration_min: 139,
    release_year: 2023,
    age_rating: 'PG-13',
    poster_url: ''
  },
  {
    id: 108,
    title: 'The Kepler Signal',
    description: 'Radio astronomers in northern Finland decode an mathematical blueprint broadcast from Kepler-186f.',
    genre: 'Sci-Fi',
    duration_min: 129,
    release_year: 2022,
    age_rating: 'PG-13',
    poster_url: ''
  },
  {
    id: 109,
    title: 'Gravity Well',
    description: 'A salvage tug captain risks everything to tow a derelict research vessel away from a singularity.',
    genre: 'Sci-Fi',
    duration_min: 122,
    release_year: 2021,
    age_rating: 'PG-13',
    poster_url: ''
  },

  // =========================================================================
  // 2. ROMANCE (10 Movies)
  // =========================================================================
  {
    id: 2,
    title: 'Midnight in Bloom',
    description: 'Two strangers find a new beginning during one unforgettable city night.',
    genre: 'Romance',
    duration_min: 104,
    release_year: 2025,
    age_rating: 'PG-13',
    poster_url: ''
  },
  {
    id: 201,
    title: 'Letters from Helsinki',
    description: 'An architect and a cellist exchange handwritten notes left inside a vintage library book.',
    genre: 'Romance',
    duration_min: 109,
    release_year: 2026,
    age_rating: 'PG',
    poster_url: ''
  },
  {
    id: 202,
    title: 'Autumn by the Bay',
    description: 'Returning home to restore a coastal lighthouse, a painter reconnects with her childhood rival.',
    genre: 'Romance',
    duration_min: 106,
    release_year: 2025,
    age_rating: 'PG',
    poster_url: ''
  },
  {
    id: 203,
    title: 'Cafe Aurora',
    description: 'Two night-shift bakers in Oulu compete for the same corner storefront while falling for each other.',
    genre: 'Romance',
    duration_min: 99,
    release_year: 2025,
    age_rating: 'PG',
    poster_url: ''
  },
  {
    id: 204,
    title: 'The Last Train to Tampere',
    description: 'When a snowstorm delays the night express, two commuters share headphones and life plans.',
    genre: 'Romance',
    duration_min: 102,
    release_year: 2024,
    age_rating: 'PG-13',
    poster_url: ''
  },
  {
    id: 205,
    title: 'Paper Lanterns',
    description: 'A wedding photographer and a florist team up to save a rained-out midsummer festival.',
    genre: 'Romance',
    duration_min: 108,
    release_year: 2024,
    age_rating: 'PG',
    poster_url: ''
  },
  {
    id: 206,
    title: 'Second Encore',
    description: 'Former duet partners reunite ten years later for a one-night charity concert.',
    genre: 'Romance',
    duration_min: 114,
    release_year: 2023,
    age_rating: 'PG-13',
    poster_url: ''
  },
  {
    id: 207,
    title: 'Summer on the Archipelago',
    description: 'A marine tour guide and a visiting botanist spend three sun-filled weeks mapping island wildflowers.',
    genre: 'Romance',
    duration_min: 105,
    release_year: 2023,
    age_rating: 'PG',
    poster_url: ''
  },
  {
    id: 208,
    title: 'Velvet Sky',
    description: 'Two amateur stargazers meet every Friday on a rooftop observatory waiting for the northern lights.',
    genre: 'Romance',
    duration_min: 101,
    release_year: 2022,
    age_rating: 'PG',
    poster_url: ''
  },
  {
    id: 209,
    title: 'When the Snow Melts',
    description: 'A bookshop owner and a travel writer make a pact to test each other’s bucket lists before spring.',
    genre: 'Romance',
    duration_min: 111,
    release_year: 2021,
    age_rating: 'PG-13',
    poster_url: ''
  },

  // =========================================================================
  // 3. MYSTERY (10 Movies)
  // =========================================================================
  {
    id: 3,
    title: 'The Clockwork Case',
    description: 'A sharp detective follows a trail of impossible clues through a changing city.',
    genre: 'Mystery',
    duration_min: 116,
    release_year: 2024,
    age_rating: 'PG-13',
    poster_url: ''
  },
  {
    id: 301,
    title: 'Glass Harbor',
    description: 'When a historic sailing ship appears in harbor with no crew aboard, a port inspector investigates.',
    genre: 'Mystery',
    duration_min: 123,
    release_year: 2026,
    age_rating: 'PG-13',
    poster_url: ''
  },
  {
    id: 302,
    title: 'The Thirteenth Portrait',
    description: 'An art restorer discovers a hidden map painted beneath a century-old manor portrait.',
    genre: 'Mystery',
    duration_min: 119,
    release_year: 2025,
    age_rating: 'PG-13',
    poster_url: ''
  },
  {
    id: 303,
    title: 'Cipher in the Snow',
    description: 'A cryptographer is called to a remote Lapland weather station after the crew vanishes mid-transmission.',
    genre: 'Mystery',
    duration_min: 127,
    release_year: 2025,
    age_rating: 'PG-13',
    poster_url: ''
  },
  {
    id: 304,
    title: 'The Silent Conservatory',
    description: 'A priceless Stradivarius violin disappears from a locked concert hall during intermission.',
    genre: 'Mystery',
    duration_min: 113,
    release_year: 2024,
    age_rating: 'PG',
    poster_url: ''
  },
  {
    id: 305,
    title: 'Shadows of Old Mill',
    description: 'A journalist reopening a thirty-year-old cold case finds that every witness tells the exact same lie.',
    genre: 'Mystery',
    duration_min: 124,
    release_year: 2024,
    age_rating: 'PG-13',
    poster_url: ''
  },
  {
    id: 306,
    title: 'The Amber Key',
    description: 'Six heirs gather at a lakeside estate where the will is hidden behind a series of mechanical riddles.',
    genre: 'Mystery',
    duration_min: 117,
    release_year: 2023,
    age_rating: 'PG-13',
    poster_url: ''
  },
  {
    id: 307,
    title: 'Midnight Alibi',
    description: 'A theater director must prove his lead actor’s innocence before the final curtain falls.',
    genre: 'Mystery',
    duration_min: 110,
    release_year: 2023,
    age_rating: 'PG-13',
    poster_url: ''
  },
  {
    id: 308,
    title: 'Room 404',
    description: 'A grand hotel archivist uncovers a guest ledger recording visitors who never checked out.',
    genre: 'Mystery',
    duration_min: 115,
    release_year: 2022,
    age_rating: 'PG-13',
    poster_url: ''
  },
  {
    id: 309,
    title: 'The Fog over Näsi',
    description: 'Two detectives piece together a disappearance linked to an old industrial steam tunnel.',
    genre: 'Mystery',
    duration_min: 121,
    release_year: 2021,
    age_rating: 'PG-13',
    poster_url: ''
  },

  // =========================================================================
  // 4. ADVENTURE (10 Movies)
  // =========================================================================
  {
    id: 4,
    title: 'Wildwood',
    description: 'A family discovers that the forest beyond their town is full of unexpected magic.',
    genre: 'Adventure',
    duration_min: 110,
    release_year: 2023,
    age_rating: 'PG',
    poster_url: ''
  },
  {
    id: 401,
    title: 'Beyond the Northern Ridge',
    description: 'Two mountaineers and a rescue dog traverse an uncharted glacier to locate a downed mail plane.',
    genre: 'Adventure',
    duration_min: 126,
    release_year: 2026,
    age_rating: 'PG',
    poster_url: ''
  },
  {
    id: 402,
    title: 'Compass of the Wind',
    description: 'A young cartographer sets sail across treacherous straits using an ancient brass astrolabe.',
    genre: 'Adventure',
    duration_min: 120,
    release_year: 2025,
    age_rating: 'PG',
    poster_url: ''
  },
  {
    id: 403,
    title: 'The Sunken Citadel',
    description: 'Deep-sea divers exploring a Mediterranean trench uncover a preserved bronze-age amphitheater.',
    genre: 'Adventure',
    duration_min: 118,
    release_year: 2025,
    age_rating: 'PG-13',
    poster_url: ''
  },
  {
    id: 404,
    title: 'Skyward Caravan',
    description: 'A crew of airship couriers races across desert canyons to deliver a royal treaty before sundown.',
    genre: 'Adventure',
    duration_min: 114,
    release_year: 2024,
    age_rating: 'PG',
    poster_url: ''
  },
  {
    id: 405,
    title: 'Emerald Rapids',
    description: 'Four cousins on a summer kayak expedition follow a forgotten river map to a hidden waterfall cavern.',
    genre: 'Adventure',
    duration_min: 106,
    release_year: 2024,
    age_rating: 'PG',
    poster_url: ''
  },
  {
    id: 406,
    title: 'Guardians of the Taiga',
    description: 'A wildlife photographer and a ranger track a rare white lynx across the northern wilderness.',
    genre: 'Adventure',
    duration_min: 112,
    release_year: 2023,
    age_rating: 'PG',
    poster_url: ''
  },
  {
    id: 407,
    title: 'The Lost Astrolabe',
    description: 'An archaeology student decodes Viking runestones leading to a hidden fjord sanctuary.',
    genre: 'Adventure',
    duration_min: 122,
    release_year: 2023,
    age_rating: 'PG-13',
    poster_url: ''
  },
  {
    id: 408,
    title: 'Storm Chasers of Bothnia',
    description: 'A father-daughter sailing crew braves an autumn gale to guide a stranded ferry to safety.',
    genre: 'Adventure',
    duration_min: 115,
    release_year: 2022,
    age_rating: 'PG-13',
    poster_url: ''
  },
  {
    id: 409,
    title: 'Trail of the Sunstone',
    description: 'Three siblings follow their grandfather’s expedition journal across volcanic highlands.',
    genre: 'Adventure',
    duration_min: 109,
    release_year: 2021,
    age_rating: 'PG',
    poster_url: ''
  },

  // =========================================================================
  // 5. COMEDY (10 Movies)
  // =========================================================================
  {
    id: 5,
    title: 'Laugh Track',
    description: 'An aspiring comic gets one week to turn a tiny club into a big break.',
    genre: 'Comedy',
    duration_min: 97,
    release_year: 2022,
    age_rating: 'PG-13',
    poster_url: ''
  },
  {
    id: 501,
    title: 'Sauna Diplomacy',
    description: 'A small-town mayor accidentally hosts an international trade summit inside a floating public sauna.',
    genre: 'Comedy',
    duration_min: 98,
    release_year: 2026,
    age_rating: 'PG',
    poster_url: ''
  },
  {
    id: 502,
    title: 'The Wrong Luggage',
    description: 'Two travelers swap identical suitcases at the airport—one filled with wedding rings, the other with cheese.',
    genre: 'Comedy',
    duration_min: 95,
    release_year: 2025,
    age_rating: 'PG',
    poster_url: ''
  },
  {
    id: 503,
    title: 'Startup in the Garage',
    description: 'Three retired engineers build a smart snowplow that becomes an accidental social media sensation.',
    genre: 'Comedy',
    duration_min: 101,
    release_year: 2025,
    age_rating: 'PG',
    poster_url: ''
  },
  {
    id: 504,
    title: 'Dinner at Eight-Ish',
    description: 'An overly ambitious home chef tries to cook a seven-course meal while the power goes out.',
    genre: 'Comedy',
    duration_min: 94,
    release_year: 2024,
    age_rating: 'PG-13',
    poster_url: ''
  },
  {
    id: 505,
    title: 'Choir Chaos',
    description: 'A heavy-metal drummer is volunteered to conduct his neighborhood’s traditional spring choir.',
    genre: 'Comedy',
    duration_min: 103,
    release_year: 2024,
    age_rating: 'PG',
    poster_url: ''
  },
  {
    id: 506,
    title: 'House Sitters',
    description: 'Two broke university friends agree to pet-sit a mansion, unaware the owner has three parrots and an alpaca.',
    genre: 'Comedy',
    duration_min: 96,
    release_year: 2023,
    age_rating: 'PG',
    poster_url: ''
  },
  {
    id: 507,
    title: 'Midnight Karaoke',
    description: 'A shy accountant enters a national karaoke tournament to win back his family’s vintage jukebox.',
    genre: 'Comedy',
    duration_min: 99,
    release_year: 2023,
    age_rating: 'PG-13',
    poster_url: ''
  },
  {
    id: 508,
    title: 'The Substitute Coach',
    description: 'A drama teacher takes over a struggling curling team two weeks before the regional championship.',
    genre: 'Comedy',
    duration_min: 102,
    release_year: 2022,
    age_rating: 'PG',
    poster_url: ''
  },
  {
    id: 509,
    title: 'Parking Inspector #1',
    description: 'An ultra-by-the-book traffic warden teams up with a chaotic scooter courier to find a stolen statue.',
    genre: 'Comedy',
    duration_min: 93,
    release_year: 2021,
    age_rating: 'PG',
    poster_url: ''
  },

  // =========================================================================
  // 6. DRAMA (10 Movies)
  // =========================================================================
  {
    id: 6,
    title: 'Deep Blue',
    description: 'A marine biologist uncovers a mystery in the deepest part of the ocean.',
    genre: 'Drama',
    duration_min: 121,
    release_year: 2021,
    age_rating: 'PG-13',
    poster_url: ''
  },
  {
    id: 601,
    title: 'The Winter Violin',
    description: 'A master luthier in his final year of work takes on a headstrong apprentice from the city.',
    genre: 'Drama',
    duration_min: 128,
    release_year: 2026,
    age_rating: 'PG',
    poster_url: ''
  },
  {
    id: 602,
    title: 'Northern Lights & Iron',
    description: 'Three generations of a shipyard family navigate the closing of their coastal drydock.',
    genre: 'Drama',
    duration_min: 132,
    release_year: 2025,
    age_rating: 'PG-13',
    poster_url: ''
  },
  {
    id: 603,
    title: 'The Glassblower’s Daughter',
    description: 'A young artisan fights to keep her family’s traditional glass studio alive during an economic downturn.',
    genre: 'Drama',
    duration_min: 119,
    release_year: 2025,
    age_rating: 'PG-13',
    poster_url: ''
  },
  {
    id: 604,
    title: 'Quiet Harbor',
    description: 'A retired ferry captain forms an unlikely friendship with a newcomer learning to read Finnish.',
    genre: 'Drama',
    duration_min: 115,
    release_year: 2024,
    age_rating: 'PG',
    poster_url: ''
  },
  {
    id: 605,
    title: 'First Snow in October',
    description: 'Two estranged brothers reunite in Oulu to pack up their childhood home over one weekend.',
    genre: 'Drama',
    duration_min: 117,
    release_year: 2024,
    age_rating: 'PG-13',
    poster_url: ''
  },
  {
    id: 606,
    title: 'The Orchestra of Small Things',
    description: 'A community music teacher rallies parents and students when their school auditorium faces demolition.',
    genre: 'Drama',
    duration_min: 124,
    release_year: 2023,
    age_rating: 'PG',
    poster_url: ''
  },
  {
    id: 607,
    title: 'Paper Mill Road',
    description: 'An investigative reporter returns to her industrial hometown to write the story of its transformation.',
    genre: 'Drama',
    duration_min: 126,
    release_year: 2023,
    age_rating: 'PG-13',
    poster_url: ''
  },
  {
    id: 608,
    title: 'After the Applause',
    description: 'A celebrated theater actress steps away from the stage to mentor young playwrights.',
    genre: 'Drama',
    duration_min: 118,
    release_year: 2022,
    age_rating: 'PG-13',
    poster_url: ''
  },
  {
    id: 609,
    title: 'Birch & Stone',
    description: 'A carpenter building a summer cottage by hand reflects on the decades that shaped his family.',
    genre: 'Drama',
    duration_min: 120,
    release_year: 2021,
    age_rating: 'PG',
    poster_url: ''
  }
];
