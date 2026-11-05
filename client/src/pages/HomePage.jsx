import { useEffect, useState } from 'react';
import Header from '../components/Header';
import { useApi } from '../hooks/useApi';

export default function HomePage() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const { getHealth } = useApi();

  useEffect(() => {
    async function loadHealth() {
      try {
        const result = await getHealth();
        setHealth(result);
      } catch (error) {
        setHealth({ status: 'offline', service: 'flimhall-api' });
      } finally {
        setLoading(false);
      }
    }

    loadHealth();
  }, [getHealth]);

  return (
    <main className="page-shell" id="home">
      <Header />

      <section className="hero-section">
        <div className="hero-copy">
          <span className="eyebrow">Now showing</span>
          <h1>Book your next favorite movie night.</h1>
          <p>
            Discover trending films, reserve the best seats, and enjoy a seamless
            cinema experience with FlimHall.
          </p>

          <div className="hero-actions">
            <button className="primary-btn">Get tickets</button>
            <button className="secondary-btn">View shows</button>
          </div>

        </div>

        <div className="hero-panel">
          <div className="movie-poster">
            <div className="poster-badge">Featured</div>
            <h3>Midnight City</h3>
            <p>Action • Drama • 2h 14m</p>
          </div>
        </div>
      </section>

      <section className="features-grid" id="shows">
        <article className="feature-card">
          <h3>Premium screening</h3>
          <p>Luxury seating and immersive audio in every show.</p>
        </article>

        <article className="feature-card">
          <h3>Smart booking</h3>
          <p>Reserve seats in seconds with a smooth user flow.</p>
        </article>

        <article className="feature-card">
          <h3>Exclusive offers</h3>
          <p>Save with curated movie nights and loyalty perks.</p>
        </article>
      </section>
    </main>
  );
}
