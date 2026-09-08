import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { NotFoundBody } from "@/components/sections/NotFoundBody";

/**
 * Global 404 for URLs that match no route. It lives outside the (marketing)
 * route group, so it composes the header and footer itself — a lost visitor
 * still gets the full site chrome and a way back. `notFound()` calls from
 * inside marketing pages hit `app/(marketing)/not-found.tsx` instead, which
 * renders inside that layout's chrome.
 */
export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main" className="flex-1">
        <NotFoundBody />
      </main>
      <Footer />
    </>
  );
}
