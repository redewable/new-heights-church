/**
 * Monochrome marks for the platforms the house publishes on. Inline SVG so
 * they take `currentColor` and sit on ink or paper without variants. Used
 * by the footer social rows and the podcast platform buttons.
 */
export type Platform = "apple" | "spotify" | "youtube" | "rss" | "facebook" | "instagram";

export function PlatformIcon({
  platform,
  size = 16,
  className,
}: {
  platform: Platform;
  size?: number;
  className?: string;
}) {
  const common = {
    "aria-hidden": true,
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    className,
  } as const;

  switch (platform) {
    case "facebook":
      return (
        <svg {...common} fill="currentColor">
          <path d="M24 12.07C24 5.44 18.63.07 12 .07S0 5.44 0 12.07c0 5.99 4.39 10.95 10.13 11.85v-8.38H7.08v-3.47h3.05V9.43c0-3.01 1.79-4.67 4.53-4.67 1.31 0 2.69.23 2.69.23v2.96h-1.51c-1.49 0-1.96.92-1.96 1.87v2.25h3.33l-.53 3.47h-2.8v8.38C19.61 23.02 24 18.06 24 12.07z" />
        </svg>
      );
    case "instagram":
      return (
        <svg
          {...common}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
          <circle cx="12" cy="12" r="4.2" />
          <circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case "youtube":
      return (
        <svg {...common} fill="currentColor">
          <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z" />
        </svg>
      );
    case "spotify":
      return (
        <svg {...common} fill="currentColor">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
        </svg>
      );
    case "apple":
      // Apple Podcasts: a listener inside two open rings.
      return (
        <svg
          {...common}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path d="M6.6 19.4A9.5 9.5 0 1 1 17.4 19.4" />
          <path d="M8.6 15.6A5.4 5.4 0 1 1 15.4 15.6" />
          <circle cx="12" cy="9.6" r="2.4" fill="currentColor" stroke="none" />
          <path
            d="M12 13.4c-1.4 0-2.2.8-2.1 1.8l.6 5.2c.1.7.7 1.2 1.5 1.2s1.4-.5 1.5-1.2l.6-5.2c.1-1-.7-1.8-2.1-1.8z"
            fill="currentColor"
            stroke="none"
          />
        </svg>
      );
    case "rss":
      return (
        <svg
          {...common}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        >
          <path d="M4.5 11a8.5 8.5 0 0 1 8.5 8.5" />
          <path d="M4.5 4.5a15 15 0 0 1 15 15" />
          <circle cx="5.6" cy="18.4" r="1.6" fill="currentColor" stroke="none" />
        </svg>
      );
  }
}
