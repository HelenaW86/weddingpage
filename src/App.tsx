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
        {/* <section className="info-section">
          <h2 className='agbalumo-regular'>Praktisk information</h2>
          <p>Datum: 5 Juni 2027</p>
          <p>Plats: <a href="https://www.balingsholm.se">Balingsholms Herrgård </a></p>
        </section> */}
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
                Logga in för att svara på inbjudan
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
                <div
          style={{
            position: 'relative',
            minHeight: '44rem',
            backgroundImage: 'url("https://www.balingsholm.se/wp-content/uploads/2023/09/stockholm-brollop-herrgard-1-scaled.webp")',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
          }}
        >
        {/* <section className="schema-section" id="schema" style={{position:'absolute'}}>
          <h2 className='agbalumo-regular'>Dagens Schema</h2>
          <ul>
            <li>Ceremoni: 14:30</li>
            <li>Tårta, bubbel, mingel & foto: 15:00</li>
            <li>Middag: 17:00</li>
            <li>Fest: 21:00</li>
            <li>Vickning: 23:00</li>
            <li>Sista låten: 02:00</li>
          </ul>
        </section> */}
                <section className="schema-section" id="schema">
          <h2 className='agbalumo-regular'>Dagens Schema</h2>
          <ul style={{listStyleType:'none', paddingLeft:0, marginTop:'1rem'}}>
            <li>14.30 Ceremonin börjar</li>
            <li>15.00 Tårta & mingel</li>
            <li>17.00 Middag</li>
            <li>21.00 Festen drar igång</li>
            <li>23.00 Vickning</li>
            <li>02.00 Sista låten</li>
          </ul>
        </section>
        <section id="boende" className='rsvp-section'>
          <div className='rsvp-container'>
            <div className='rsvp-info'>
          <h2 className='agbalumo-regular'>Boende</h2>
          <p>Vi har reserverat rum på Balingsholms Herrgård för våra gäster. Vänligen boka ditt rum senast 1 april 2027.</p>
          <a href="https://www.balingsholm.se/hotell/">Boka boende här</a>
          </div>
          </div>
        </section>
         </div>
         <footer className='footer'>
          <h2>Kontakta oss</h2>
          <div style={{display:'flex', flexDirection:'row', gap:'0.5rem'}}> <p>Anders:</p> <a href="tel:+46732173757">073 217 37 57</a></div>
         <div  style={{display:'flex', flexDirection:'row', gap:'0.5rem'}}>  <p>Helena:</p> <a href="tel:+46762212103">076 221 21 03</a></div>
        
         </footer>
      </main>
    </>
  )
}

export default App
