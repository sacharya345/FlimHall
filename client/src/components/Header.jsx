export default function Header() {
  return (
    <header className="topbar">
      <div className="brand-wrap">
        <div className="brand-mark">F</div>
        <div>
          <p className="brand-name">FlimHall</p>
          <span className="brand-tag">Movie booking experience</span>
        </div>
      </div>

      <nav className="nav">
        <a href="#home">Home</a>
        <a href="#shows">Shows</a>
        <a href="#offers">Offers</a>
        <a href="#contact">Contact</a>
      </nav>

      <button className="primary-btn">Book now</button>
    </header>
  );
}
