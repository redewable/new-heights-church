import type { Metadata } from "next";
import { CHURCH } from "@/lib/constants/church";

/**
 * Build page metadata with the NHC title template and sensible OG/Twitter defaults.
 * Use `buildMetadata({ title, description, path })` in each page's `generateMetadata`.
 */

export interface PageMetaInput {
  /** Page-specific title, or null to use the church's tagline. */
  title?: string | null;
  description: string;
  /** Path from site root, e.g. "/im-new". No trailing slash. */
  path?: string;
  /** Optional OG image path relative to the site. */
  ogImage?: string;
  /** Disable indexing (e.g. admin routes). */
  noindex?: boolean;
}

export function buildMetadata(input: PageMetaInput): Metadata {
  const canonical = `${CHURCH.urls.site}${input.path ?? ""}`;
  const title = input.title
    ? `${input.title} | ${CHURCH.name}`
    : `${CHURCH.name} — ${CHURCH.tagline}`;
  // Default card is generated at build by `app/opengraph-image.tsx`.
  const ogImageUrl = input.ogImage
    ? input.ogImage.startsWith("http")
      ? input.ogImage
      : `${CHURCH.urls.site}${input.ogImage}`
    : `${CHURCH.urls.site}/opengraph-image`;

  return {
    title,
    description: input.description,
    metadataBase: new URL(CHURCH.urls.site),
    alternates: { canonical },
    robots: input.noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      type: "website",
      siteName: CHURCH.name,
      title,
      description: input.description,
      url: canonical,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: CHURCH.name }],
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: input.description,
      images: [ogImageUrl],
    },
  };
}

export const ROOT_METADATA: Metadata = {
  ...buildMetadata({
    title: null,
    description:
      "New Heights Church — a Spirit-filled, apostolic-prophetic family in College Station, Texas. Sundays 10 AM · Wednesdays 7 PM.",
  }),
  applicationName: CHURCH.name,
  authors: [{ name: CHURCH.leadership.seniorPastor }],
  formatDetection: { email: false, address: false, telephone: false },
  // Icons come from the file convention: app/icon.svg + app/apple-icon.tsx.
};
