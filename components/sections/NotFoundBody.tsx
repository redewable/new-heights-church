import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { AscendingBars } from "@/components/brand/AscendingBars";

/**
 * The 404 itself, without site chrome. `app/not-found.tsx` wraps it in the
 * header and footer for URLs that match nothing; `app/(marketing)/not-found.tsx`
 * renders it bare because the marketing layout already supplies both.
 */
export function NotFoundBody() {
  return (
    <Container
      size="md"
      className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center"
    >
      <AscendingBars size={40} aria-label="" className="text-[color:var(--nh-gold)]" />
      <p className="u-eyebrow mt-6 text-[color:var(--nh-gold-ink)]">
        404 — Lost, but not forgotten
      </p>
      <h1 className="u-display-dramatic mt-4 text-[clamp(2.25rem,5.5vw,4.5rem)]">
        That page has moved on.
      </h1>
      <p className="text-stone mt-5 max-w-xl text-lg">
        The page you're looking for isn't here. Try the home page, the sermons library, or
        send us a note and we'll help you find it.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button variant="primary" href="/">
          Home
        </Button>
        <Button variant="ghost" href="/sermons">
          Sermons
        </Button>
        <Button variant="ghost" href="/connect">
          Contact us
        </Button>
      </div>
      <p className="text-fog mt-10 text-sm">
        Still stuck?{" "}
        <Link className="underline underline-offset-4" href="/connect">
          Reach out
        </Link>
        .
      </p>
    </Container>
  );
}
