import { NotFoundBody } from "@/components/sections/NotFoundBody";

/**
 * 404 for `notFound()` thrown inside marketing routes (a sermon or event slug
 * that doesn't exist). The marketing layout already renders the header and
 * footer, so this is the body alone — otherwise the chrome doubled.
 */
export default function MarketingNotFound() {
  return <NotFoundBody />;
}
