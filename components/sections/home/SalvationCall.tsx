import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { AscendingBars } from "@/components/brand/AscendingBars";
import { PrayerDisclosure } from "@/components/sections/PrayerDisclosure";
import { CHURCH } from "@/lib/constants/church";

/**
 * The call to salvation. Not softened for a public site: it is heaven or
 * hell, and no one is promised tomorrow. Accept, believe, confess — Romans
 * 10. Scarlet-led (the Harvest pillar: the blood). Three ways to respond:
 * tell us, learn the prayer, or call the house and pray with someone now.
 */
export function SalvationCall() {
  return (
    <section
      aria-labelledby="salvation-heading"
      className="bg-cream relative border-t-4 border-[color:var(--nh-scarlet)] py-24 md:py-32"
    >
      <Container size="md" className="relative">
        <div className="flex items-center gap-3 text-[color:var(--nh-scarlet-ink)]">
          <AscendingBars
            size={22}
            highlight="harvest"
            className="text-ink"
            aria-label=""
          />
          <span className="u-eyebrow">The altar is open · Heaven or hell</span>
        </div>

        <h2
          id="salvation-heading"
          className="u-display-dramatic text-ink mt-6 text-[clamp(2.5rem,6vw,5rem)]"
        >
          Make Him Lord. <span className="text-[color:var(--nh-scarlet)]">Today.</span>
        </h2>

        {/* Phones: the same call, compartmentalized — one line, three tiles, the plea. */}
        <div className="text-ink mt-7 md:hidden">
          <p className="text-lg leading-snug">
            It is heaven or hell. There is no third option. No one is promised tomorrow.
          </p>
          <ol className="mt-5 grid grid-cols-3 gap-2">
            {[
              ["Accept", "that Jesus Christ died for your sins and rose again"],
              ["Believe", "it in your heart"],
              ["Confess", "with your mouth that Jesus is Lord"],
            ].map(([word, rest], i) => (
              <li
                key={word}
                className="bg-paper rounded-[var(--radius)] border border-[color:var(--nh-border)] p-3"
              >
                <span
                  aria-hidden="true"
                  className="u-numeral block text-lg text-[color:var(--nh-scarlet)]"
                >
                  {["I", "II", "III"][i]}
                </span>
                <span className="font-display text-ink mt-1 block text-lg leading-tight">
                  {word}
                </span>
                <span className="text-stone mt-1 block text-xs leading-snug">{rest}</span>
              </li>
            ))}
          </ol>
          <p className="u-display-soft text-ink mt-6 text-2xl leading-snug">
            We implore you: make a decision today to make God Almighty the Lord of your
            life.
          </p>
        </div>

        <div className="text-ink mt-8 hidden max-w-[58ch] space-y-5 text-lg leading-relaxed md:block md:text-xl">
          <p>
            It is heaven or hell. There is no third option. No one is promised tomorrow,
            and no man knows the day or the hour of the return of the Lord.
          </p>
          <p>
            You do not have to know everything to be saved. You have to{" "}
            <strong className="font-semibold">accept</strong>,{" "}
            <strong className="font-semibold">believe</strong>, and{" "}
            <strong className="font-semibold">confess</strong>: accept that Jesus Christ
            died for your sins and rose again, believe it in your heart, and confess with
            your mouth that Jesus is Lord.
          </p>
          <p className="u-display-soft text-ink text-2xl leading-snug md:text-3xl">
            We implore you: make a decision today to make God Almighty the Lord of your
            life.
          </p>
        </div>

        <p className="u-eyebrow mt-8 text-[color:var(--nh-scarlet-ink)]">
          Romans 10:9–10 · 2 Corinthians 5:20 · Hebrews 9:27 · Matthew 24:36
        </p>

        <PrayerDisclosure
          className="mt-9"
          before={
            <Button variant="scarlet" size="lg" href="/connect/decision">
              I&rsquo;m making Jesus Lord
            </Button>
          }
        />

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-[color:var(--nh-border)] pt-6">
          <Button variant="ghost" size="md" href={CHURCH.contact.phoneHref}>
            <PhoneIcon />
            <span className="hidden sm:inline">Call to pray with someone · </span>
            <span className="sm:hidden">Call · </span>
            {CHURCH.contact.phone}
          </Button>
          <a
            href="/connect/prayer"
            className="text-stone hover:text-ink text-sm font-semibold underline-offset-4 hover:underline"
          >
            Or send a prayer request
          </a>
        </div>
        <p className="text-stone mt-4 hidden max-w-[52ch] text-sm md:block">
          Say it out loud, then tell us. The pastoral team will follow up personally, and
          the house will stand with you at the altar this Sunday.
        </p>
      </Container>
    </section>
  );
}

function PhoneIcon() {
  return (
    <svg
      aria-hidden="true"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.9.6 2.8.7a2 2 0 0 1 1.8 2z" />
    </svg>
  );
}
