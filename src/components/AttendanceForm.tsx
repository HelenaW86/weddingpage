import { useState, type FormEvent } from "react";
import type { User } from "../auth";

type AttendanceFormProps = {
  user: User;
  onSave: (attendance: boolean | null) => Promise<void>;
};

export function AttendanceForm({ user, onSave }: AttendanceFormProps) {
  const [attendance, setAttendance] = useState<boolean | null>(
    user.wedding_attendance
  );
  const [editing, setEditing] = useState(user.wedding_attendance === null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSaving(true);
    setError(null);

    try {
      await onSave(attendance);
      setSavedMessage(
        attendance === null
          ? user.wedding_attendance === null
            ? "Inget svar har sparats."
            : "Ditt svar har tagits bort."
          : null
      );
      setEditing(attendance === null);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Kunde inte spara svaret"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="participate-form">
      {!editing && user.wedding_attendance === true && (
        <p className="participate-message" role="status">
          Du har tackat <strong>ja</strong> till inbjudan. Vi ser fram emot att träffa dig på bröllopet!
        </p>
      )}
      {!editing && user.wedding_attendance === false && (
        <p className="participate-message" role="status">
          Du har tackat <strong>nej</strong> till inbjudan. Vi hoppas att vi ses vid ett annat tillfälle!
        </p>
      )}
      {!editing ? (
        <button
          className="participate-submit"
          type="button"
          onClick={() => {
            setAttendance(user.wedding_attendance);
            setError(null);
            setSavedMessage(null);
            setEditing(true);
          }}
        >
          Ändra svar
        </button>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-header">
            <p>Vänligen svara på vår inbjudan senast 1 april 2027.</p>
          </div>
          <fieldset className="participate-options" disabled={saving}>
            <legend>Kommer du?</legend>
            <label htmlFor="attendance-yes">
              <input
                id="attendance-yes"
                type="radio"
                name="attendance"
                checked={attendance === true}
                onChange={() => {
                  setAttendance(true);
                  setSavedMessage(null);
                }}
              />
              <strong>Ja</strong>, jag kommer!
            </label>
            <label htmlFor="attendance-no">
              <input
                id="attendance-no"
                type="radio"
                name="attendance"
                checked={attendance === false}
                onChange={() => {
                  setAttendance(false);
                  setSavedMessage(null);
                }}
              />
              <strong>Nej</strong>, jag kan inte komma.
            </label>
            <label htmlFor="attendance-undecided">
              <input
                id="attendance-undecided"
                type="radio"
                name="attendance"
                checked={attendance === null}
                onChange={() => {
                  setAttendance(null);
                  setSavedMessage(null);
                }}
              />
              Jag har inte bestämt mig ännu.
            </label>
          </fieldset>
          <button
            className="participate-submit"
            type="submit"
            disabled={saving}
          >
            {saving ? "Sparar..." : "Spara svar"}
          </button>
          {user.wedding_attendance !== null && (
            <button
              className="participate-cancel"
              type="button"
              disabled={saving}
              onClick={() => {
                setAttendance(user.wedding_attendance);
                setError(null);
                setSavedMessage(null);
                setEditing(false);
              }}
            >
              Avbryt
            </button>
          )}
        </form>
      )}
      {error && (
        <p className="participate-error" role="alert">
          {error}
        </p>
      )}
      {savedMessage && (
        <p className="participate-message" role="status">
          {savedMessage}
        </p>
      )}
    </div>
  );
}
