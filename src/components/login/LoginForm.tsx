
import { useState, type FormEvent } from "react";
import { useAuth } from "../../auth";

interface LoginFormProps {
  onSwitch: () => void;
  onSuccess: () => void;
}

export default function LoginForm({
  onSwitch,
  onSuccess
}: LoginFormProps) {
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);

    try {
      await login(
        String(formData.get("email") ?? ""),
        String(formData.get("password") ?? "")
      );
      onSuccess();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Inloggningen misslyckades"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h2>Välkommen!</h2>
      <p>Logga in för att kunna dela dina bilder & svara på inbjudan.</p>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="E-postadress"
          autoComplete="email"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Lösenord"
          autoComplete="current-password"
          required
        />

        {error && <p className="auth-error" role="alert">{error}</p>}

        <button type="submit" disabled={submitting}>
          {submitting ? "Loggar in..." : "Logga in"}
        </button>
      </form>

      <p>
        Har du inget konto?{" "}
        <button className="link-button" type="button" onClick={onSwitch}>
          Skapa konto
        </button>
      </p>
    </div>
  );
}
