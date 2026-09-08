import { CHURCH } from "@/lib/constants/church";

/**
 * JSON-LD builders for schema.org structured data.
 * Drop the returned object into a `<script type="application/ld+json">` tag.
 * Per RFP §10: Organization + Church on every page; LocalBusiness on home + visit;
 * Event / VideoObject / PodcastSeries etc. on their respective pages.
 */

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "Church"],
    name: CHURCH.name,
    url: CHURCH.urls.site,
    logo: `${CHURCH.urls.site}/brand/logo.png`,
    sameAs: [
      CHURCH.urls.facebook,
      CHURCH.urls.instagram,
      CHURCH.urls.youtube,
      CHURCH.urls.churchCenter,
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: CHURCH.address.street,
      addressLocality: CHURCH.address.city,
      addressRegion: CHURCH.address.region,
      postalCode: CHURCH.address.postal,
      addressCountry: CHURCH.address.country,
    },
    telephone: CHURCH.contact.phone,
    email: CHURCH.contact.email,
    founder: {
      "@type": "Person",
      name: CHURCH.leadership.seniorPastor,
    },
    slogan: CHURCH.mission,
  };
}

export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["Church", "LocalBusiness", "PlaceOfWorship"],
    name: CHURCH.name,
    url: CHURCH.urls.site,
    telephone: CHURCH.contact.phone,
    email: CHURCH.contact.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: CHURCH.address.street,
      addressLocality: CHURCH.address.city,
      addressRegion: CHURCH.address.region,
      postalCode: CHURCH.address.postal,
      addressCountry: CHURCH.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: CHURCH.address.geo.lat,
      longitude: CHURCH.address.geo.lng,
    },
    openingHoursSpecification: CHURCH.services.map((s) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: `https://schema.org/${s.dayOfWeek}`,
      opens: to24Hour(s.time),
      closes: addHours(to24Hour(s.time), 2),
      name: s.name,
    })),
  };
}

export function breadcrumbSchema(items: ReadonlyArray<{ name: string; href: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.href.startsWith("http") ? item.href : `${CHURCH.urls.site}${item.href}`,
    })),
  };
}

/**
 * Render JSON-LD as an inline script. Safe to pass untrusted input because
 * we stringify with JSON.stringify, but we still escape `<` to avoid early
 * termination of the script tag.
 */
export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

function to24Hour(time: string): string {
  const match = time.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return "00:00";
  let hour = parseInt(match[1], 10);
  const minute = match[2];
  const mer = match[3].toUpperCase();
  if (mer === "PM" && hour !== 12) hour += 12;
  if (mer === "AM" && hour === 12) hour = 0;
  return `${String(hour).padStart(2, "0")}:${minute}`;
}

function addHours(hhmm: string, hours: number): string {
  const [h, m] = hhmm.split(":").map(Number);
  const total = h + hours;
  return `${String(total % 24).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}
