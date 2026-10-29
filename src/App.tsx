import './App.css'

function App() {
  return (
    <>
      <main>
        <section className="video-section">
          <video
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          >
          <source
            src="https://www.balingsholm.se/wp-content/uploads/2023/08/Konferens-Brollop-Herrgard-Stockholm-film.mp4"
            type="video/mp4"
          />
          </video>

            <div className="video-overlay"></div>

          <div className="video-content">
            <h1>Helena & Anders Bröllop 2027</h1>
            <p>7 maj 2027 · Balingsholms Herrgård</p>
          </div>
        </section>
        <section>
          <h2>Praktisk information</h2>
          <p>Datum: 7 maj 2027</p>
          <p>Plats: <a href="https://www.balingsholm.se">Balingsholms Herrgård </a></p>
          <p>Schema: Ceremoni kl. 15:00, middag kl. 18:00</p>
        </section>
      </main>
    </>
  )
}

export default App
