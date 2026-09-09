import { Container } from "@/components/ui/Container";
import { MobileFolds } from "@/components/ui/MobileFolds";
import { VALUES } from "@/lib/constants/values";

/**
 * The Church's statement of faith — twenty-one values, the house's own
 * words — as a numbered two-column ledger. No cards, no icons: a hairline,
 * a number, the title in Fraunces, and the statement.
 */
export function ValuesList() {
  return (
    <section aria-labelledby="values-heading" className="py-16 md:py-20">
      <Container size="lg">
        <div className="flex items-center gap-4 text-[color:var(--nh-gold-ink)]">
          <span aria-hidden="true" className="u-rule-gold w-12" />
          <span className="u-eyebrow">Our values</span>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-end md:gap-10">
          <h2
            id="values-heading"
            className="u-display-dramatic text-ink max-w-[16ch] text-[clamp(2rem,4.5vw,3.25rem)]"
          >
            What this house holds.
          </h2>
          <p className="text-stone hidden max-w-[40rem] text-lg md:block">
            Twenty-one statements, in the Church&rsquo;s own words. This is the doctrinal
            ground under every sermon, every class, and every altar call.
          </p>
          <p className="text-stone text-lg md:hidden">
            Twenty-one statements, in the Church&rsquo;s own words. Tap one to read it.
          </p>
        </div>

        {/* Phones: each value is a row that opens; desktop keeps the ledger. */}
        <MobileFolds
          className="mt-8"
          items={VALUES.map((v, i) => ({
            key: v.key,
            title: (
              <>
                <span className="u-eyebrow mr-3 text-[color:var(--nh-gold-ink)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {v.title}
              </>
            ),
            body: v.text.map((p) => <p key={p.slice(0, 24)}>{p}</p>),
          }))}
        />

        <ol className="mt-12 hidden gap-x-12 gap-y-9 md:grid md:grid-cols-2 md:gap-y-10">
          {VALUES.map((v, i) => (
            <li key={v.key} className="border-t border-[color:var(--nh-border)] pt-5">
              <p className="u-eyebrow text-[color:var(--nh-gold-ink)]">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="font-display text-ink mt-2 text-xl md:text-2xl">
                {v.title}
              </h3>
              {v.text.map((p) => (
                <p key={p.slice(0, 24)} className="text-stone mt-3 leading-relaxed">
                  {p}
                </p>
              ))}
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
