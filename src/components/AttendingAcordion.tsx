import { useState, type SyntheticEvent } from "react";

type Attendee = {
  id: string;
  username: string;
};

type AttendeesResponse = {
  users?: Attendee[];
  message?: string;
};

export function AttendingAccordion() {
  const [users, setUsers] = useState<Attendee[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleToggle = async (event: SyntheticEvent<HTMLDetailsElement>) => {
    if (!event.currentTarget.open || loaded || loading) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/attending", {
        credentials: "include"
      });

      let data: AttendeesResponse;
      try {
        data = await response.json() as AttendeesResponse;
      } catch {
        throw new Error(
          `Kunde inte läsa gästlistan (HTTP ${response.status}).`
        );
      }

      if (!response.ok) {
        throw new Error(data.message || "Kunde inte hämta gästlistan");
      }

      if (!Array.isArray(data.users)) {
        throw new Error("Servern returnerade ingen gästlista");
      }

      setUsers(data.users);
      setLoaded(true);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Kunde inte hämta gästlistan"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <details onToggle={handleToggle}>
      <summary>Se vilka som tackat ja</summary>
      {loading ? (
        <p>Hämtar gästlistan...</p>
      ) : error ? (
        <p role="alert">{error}</p>
      ) : users.length > 0 ? (
        <ul>
          {users.map((attendee) => (
            <li key={attendee.id}>{attendee.username}</li>
          ))}
        </ul>
      ) : loaded ? (
        <p>Inga andra gäster har tackat ja ännu.</p>
      ) : null}
    </details>
  );
}
