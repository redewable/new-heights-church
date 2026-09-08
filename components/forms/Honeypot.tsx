/**
 * Honeypot field — a sibling text input named `website` that legitimate
 * humans can't see (aria-hidden + sr-only + tabindex=-1). Bots that scrape
 * the DOM and fill every input get silently rejected in the server action.
 *
 * Paired with `z.string().max(0)` in the form schema: any non-empty value
 * short-circuits to the error branch without touching the database.
 */
export function Honeypot() {
  return (
    <div aria-hidden="true" className="sr-only">
      <label>
        Leave this field empty
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </label>
    </div>
  );
}
