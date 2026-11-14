
import { useState, type FormEvent } from "react";
import { useAuth } from "../../auth";

interface RegisterFormProps {
  onSwitch: () => void;
  onSuccess: () => void;
}

export default function RegisterForm({
  onSwitch,
  onSuccess
}: RegisterFormProps) {
  const { register } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);

    try {
      await register(
        String(formData.get("username") ?? ""),
        String(formData.get("email") ?? ""),
        String(formData.get("password") ?? "")
      );
      onSuccess();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Kunde inte skapa konto"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h2>Skapa konto</h2>
      <p>Skapa ett konto för att dela dina bröllopsbilder och svara på inbjudan.</p>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Användarnamn"
          autoComplete="username"
          required
        />

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
          autoComplete="new-password"
          required
        />

        {error && <p className="auth-error" role="alert">{error}</p>}

        <button type="submit" disabled={submitting}>
          {submitting ? "Skapar konto..." : "Skapa konto"}
        </button>
      </form>

      <p>
        Har du redan ett konto?{" "}
        <button  className="link-button" type="button" onClick={onSwitch}>
          Logga in
        </button>
      </p>
    </div>
  );
}
