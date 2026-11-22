import { useState } from 'react';
import './App.css'
import { Navigation } from './components/Navigation'
import AuthModal from './components/login/AuthModal';
import { AttendanceForm } from './components/AttendanceForm';
import { useAuth } from './auth';
import { AttendingAccordion } from './components/AttendingAcordion';

function App() {
  const [showAuth, setShowAuth] = useState(false);
  const { user, loading, updateAttendance } = useAuth();

  return (
    <>
      <main id="top" style={{ position: 'relative' }}>
        <Navigation showAuth={setShowAuth} />
        {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
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
            <h1 className='petit-formal-script-regular'>Anders & Helenas Bröllop 2027</h1>
            <p>5 Juni 2027 · Balingsholms Herrgård</p>
          </div>
        </section>
        <section className="info-section">
          <h2 className='agbalumo-regular'>Praktisk information</h2>
          <p>Datum: 5 Juni 2027</p>
          <p>Plats: <a href="https://www.balingsholm.se">Balingsholms Herrgård </a></p>
        </section>
        <section id="rsvp" className="participate-section">
          <h2 className='agbalumo-regular'>Svara på inbjudan</h2>
          {loading ? (
            <p>Kontrollerar inloggning...</p>
          ) : !user ? (
            <div className="participate-form">
              <button
                className="participate-submit"
                type="button"
                onClick={() => setShowAuth(true)}
              >
                Logga in för att svara på inbjudan ⭐
              </button>
            </div>
          ) : (
            <>
              <AttendanceForm
                key={user.id}
                user={user}
                onSave={updateAttendance}
              />
              <AttendingAccordion />
            </>
          )}
        </section>
        <section id="boende" className='rsvp-section'>
          
          <div className='rsvp-container'>
             <div className='rsvp-info'>
          <h2 className='agbalumo-regular'>Boende</h2>
          <p>Vi har reserverat rum på Balingsholms Herrgård för våra gäster. Vänligen boka ditt rum senast 1 april 2027.</p>
          <a href="https://www.balingsholm.se/hotell/">Boka boende här</a>
          </div>
          <img className='rsvp-image' src="https://www.balingsholm.se/wp-content/uploads/2023/09/stockholm-brollop-herrgard-1-scaled.webp" alt="Balingsholms Herrgård" />
          </div>
         
        </section>
        <section id="info" style={{position:'absolute'}}>
          <h2 className='agbalumo-regular'>Dagen & Kvällen</h2>
          <ul>
            <li>Ceremoni: 15:00</li>
            <li>Tårta & bubbel: 16:30</li>
            <li>Middag: 18:00</li>
            <li>Fest: 20:00</li>
            <li>Vickning: 23:00</li>
            <li>Natti natt: 02:00</li>
          </ul>
        </section>
      </main>
    </>
  )
}

export default App
