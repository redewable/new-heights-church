"use client";

import Script from "next/script";
import { useConsent } from "./ConsentProvider";
import { analyticsAllowed } from "@/lib/consent/constants";

/**
 * Loads GA4 and (optionally) Meta Pixel once the user has opted in via
 * the consent banner. Renders nothing when consent is "pending" or
 * "essential" — and nothing when the env vars aren't set. We use
 * `strategy="lazyOnload"` per the performance targets so analytics
 * never blocks first paint.
 *
 * Environment variables read client-side:
 *   NEXT_PUBLIC_GA4_MEASUREMENT_ID   — e.g. "G-XXXXXXXXXX"
 *   NEXT_PUBLIC_META_PIXEL_ID        — e.g. "1234567890"
 *
 * If either is missing we simply skip that loader — the other still
 * runs when consented. No env duplication.
 */
export function AnalyticsLoader() {
  const { state } = useConsent();
  if (!analyticsAllowed(state)) return null;

  const ga4Id = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID?.trim();
  const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim();

  return (
    <>
      {ga4Id ? (
        <>
          <Script
            id="ga4-loader"
            strategy="lazyOnload"
            src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`}
          />
          <Script id="ga4-init" strategy="lazyOnload">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${ga4Id}', {
                anonymize_ip: true,
                send_page_view: true
              });
              window.gtag = gtag;
            `}
          </Script>
        </>
      ) : null}

      {metaPixelId ? (
        <Script id="meta-pixel-init" strategy="lazyOnload">
          {`
            !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
              n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
              document,'script','https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${metaPixelId}');
            fbq('track', 'PageView');
          `}
        </Script>
      ) : null}
    </>
  );
}
