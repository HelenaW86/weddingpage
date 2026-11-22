
import { useState } from 'react';
import { useAuth } from '../auth';

type NavigationProps = {
  showAuth: (show: boolean) => void;
};

export const Navigation = ({ showAuth }: NavigationProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const { user, logout } = useAuth();

  const closeMenu = () => setMenuOpen(false);

  const handleAuthClick = async () => {
    closeMenu();
    setAuthError(null);

    if (!user) {
      showAuth(true);
      return;
    }

    setLoggingOut(true);

    try {
      await logout();
    } catch (error) {
      setAuthError(
        error instanceof Error ? error.message : "Kunde inte logga ut"
      );
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <header className="site-header">
      <nav className="navigation" aria-label="Huvudnavigation">
        <a className="navigation-brand" href="#top" onClick={closeMenu}>
          Anders <span>&</span> Helena
        </a>

        <button
          className="navigation-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="navigation-links"
          aria-label={menuOpen ? 'Stäng menyn' : 'Öppna menyn'}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span />
          <span />
          <span />
        </button>

        <div
          className={`navigation-links${menuOpen ? ' is-open' : ''}`}
          id="navigation-links"
        >
          <a href="#top" onClick={closeMenu}>Hem</a>
          <a href="#rsvp" onClick={closeMenu}>OSA</a>
          <a href="#boende" onClick={closeMenu}>Boende</a>
          <a href="#schema" onClick={closeMenu}>Schema</a>
          {user && (
            <span className="navigation-greeting">Hej, {user.username}!</span>
          )}
          <button
            className="navigation-login"
            type="button"
            onClick={handleAuthClick}
            disabled={loggingOut}
          >
            {loggingOut ? "Loggar ut..." : user ? "Logga ut" : "Logga in"}
          </button>
          {authError && (
            <span className="navigation-auth-error" role="alert">
              {authError}
            </span>
          )}
        </div>
      </nav>
    </header>
  );
};