import Link from "next/link";
import { KioskShell } from "@/components/checkin/KioskShell";
import { HOUSEHOLD, STATION } from "@/lib/checkin/mock";

/**
 * Kiosk start. Two ways in: type the phone number the church has for you,
 * or scan the family code from the member portal. Keys are big enough for
 * a parent holding a toddler.
 */
export default function CheckinStart() {
  const typed = HOUSEHOLD.phoneLast4;
  return (
    <KioskShell>
      <div className="mx-auto grid w-full max-w-5xl flex-1 items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <section aria-labelledby="checkin-heading">
          <p className="u-eyebrow text-[color:var(--nh-gold)]">
            Welcome · doors open {STATION.opensAt}
          </p>
          <h1
            id="checkin-heading"
            className="u-display-dramatic text-cream mt-4 text-[clamp(2.5rem,6vw,4.5rem)]"
          >
            Check in your children.
          </h1>
          <p className="text-cream/80 mt-4 max-w-[40ch] text-lg">
            Type your phone number, or scan your family code. Tags print right here.
          </p>

          <div className="mt-8 max-w-sm">
            <div
              aria-label="Phone number"
              className="flex h-16 items-center justify-center rounded-[var(--radius-lg)] border border-white/15 bg-white/5 font-mono text-3xl tracking-[0.25em]"
            >
              <span className="text-cream/40">(979) 555-</span>
              <span className="text-cream">{typed}</span>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9", "⌫", "0", "Go"].map((k) => (
                <button
                  key={k}
                  type="button"
                  disabled
                  aria-label={k === "⌫" ? "Delete" : k}
                  className={
                    k === "Go"
                      ? "text-ink h-16 rounded-[var(--radius-lg)] bg-[color:var(--nh-gold)] text-xl font-semibold"
                      : "text-cream h-16 rounded-[var(--radius-lg)] border border-white/15 bg-white/5 font-mono text-2xl"
                  }
                >
                  {k}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section
          aria-labelledby="scan-heading"
          className="rounded-[var(--radius-lg)] border border-white/10 bg-white/[0.04] p-7"
        >
          <p className="u-eyebrow text-[color:var(--nh-gold)]">Or scan</p>
          <h2 id="scan-heading" className="font-display text-cream mt-3 text-2xl">
            Hold your family code up to the camera.
          </h2>
          <div className="mt-6 flex aspect-square max-w-[16rem] items-center justify-center rounded-[var(--radius-lg)] border-2 border-dashed border-white/20">
            <div className="relative h-24 w-24">
              <span
                aria-hidden="true"
                className="absolute top-0 left-0 h-6 w-6 border-t-4 border-l-4 border-[color:var(--nh-gold)]"
              />
              <span
                aria-hidden="true"
                className="absolute top-0 right-0 h-6 w-6 border-t-4 border-r-4 border-[color:var(--nh-gold)]"
              />
              <span
                aria-hidden="true"
                className="absolute bottom-0 left-0 h-6 w-6 border-b-4 border-l-4 border-[color:var(--nh-gold)]"
              />
              <span
                aria-hidden="true"
                className="absolute right-0 bottom-0 h-6 w-6 border-r-4 border-b-4 border-[color:var(--nh-gold)]"
              />
            </div>
          </div>
          <p className="text-cream/60 mt-5 text-sm">
            The code is in the family portal under Family & check-in. Volunteers can look
            you up by name too.
          </p>
          <Link
            href="/checkin/household"
            className="text-ink mt-6 inline-flex h-12 items-center rounded-[var(--radius-sm)] bg-[color:var(--nh-gold)] px-5 text-sm font-semibold"
          >
            Continue as the Sample family →
          </Link>
        </section>
      </div>

      <p className="text-cream/50 mt-10 text-center text-sm">
        New here? A volunteer will get you set up — it takes about two minutes and your
        children are in a room by the first song.
      </p>
    </KioskShell>
  );
}
