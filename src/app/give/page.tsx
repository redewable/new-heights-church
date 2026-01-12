import Link from "next/link";
import { Heart, CreditCard, Repeat, Gift, ArrowRight, Shield, Clock } from "lucide-react";

export const metadata = {
  title: "Give",
  description: "Support the mission of New Heights Church through your generous giving.",
};

const givingOptions = [
  {
    icon: CreditCard,
    title: "One-Time Gift",
    description: "Make a single contribution to support our ministry.",
  },
  {
    icon: Repeat,
    title: "Recurring Giving",
    description: "Set up automatic weekly or monthly contributions.",
  },
];

const impactAreas = [
  "Supporting local families in need",
  "Youth and children's ministry programs",
  "Community outreach and missions",
  "Facility maintenance and improvements",
  "Worship and media production",
];

export default function GivePage() {
  const pushPayUrl = process.env.NEXT_PUBLIC_PUSHPAY_URL || "#";

  return (
    <div className="min-h-screen bg-bg pt-28 pb-16">
      <div className="container-site">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
            <Heart className="w-7 h-7 text-gold" />
          </div>
          <h1 className="font-heading text-display-md text-text-primary mb-4">
            Give Generously
          </h1>
          <p className="text-text-secondary text-body-lg">
            Your generosity helps us love people and point them to Christ. Every
            gift makes an eternal impact.
          </p>
        </div>

        {/* Main Give Button */}
        <div className="max-w-md mx-auto mb-16">
          <a
            href={pushPayUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full btn-primary text-lg py-5 text-center"
          >
            Give Now
            <ArrowRight className="w-5 h-5" />
          </a>
          
          <div className="flex items-center justify-center gap-6 mt-6 text-sm text-text-muted">
            <span className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Secure
            </span>
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Takes 2 minutes
            </span>
          </div>
        </div>

        {/* Giving Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-16">
          {givingOptions.map((option) => (
            <div key={option.title} className="card text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gold/10 flex items-center justify-center">
                <option.icon className="w-5 h-5 text-gold" />
              </div>
              <h3 className="font-heading text-heading-md text-text-primary mb-2">
                {option.title}
              </h3>
              <p className="text-text-secondary text-sm">
                {option.description}
              </p>
            </div>
          ))}
        </div>

        {/* Asset Giving CTA */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="card bg-gradient-to-br from-gold/10 to-transparent border-gold/20">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-16 h-16 flex-shrink-0 rounded-xl bg-gold/20 flex items-center justify-center">
                <Gift className="w-7 h-7 text-gold" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="font-heading text-heading-lg text-text-primary mb-2">
                  Asset Giving
                </h3>
                <p className="text-text-secondary mb-4">
                  Consider giving through stocks, cryptocurrency, property, or other
                  assets. These gifts can provide significant tax benefits while
                  supporting our mission.
                </p>
                <Link href="/give/assets" className="btn-secondary text-sm">
                  Learn More
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Impact Section */}
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-heading text-heading-lg text-text-primary mb-6">
            Your Giving Makes a Difference
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            {impactAreas.map((area) => (
              <div
                key={area}
                className="flex items-start gap-3 p-4 rounded-lg bg-white/5"
              >
                <div className="w-2 h-2 mt-2 rounded-full bg-gold flex-shrink-0" />
                <span className="text-text-secondary text-sm">{area}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scripture */}
        <div className="max-w-xl mx-auto mt-16 text-center">
          <blockquote className="text-text-secondary italic">
            &ldquo;Each of you should give what you have decided in your heart to
            give, not reluctantly or under compulsion, for God loves a cheerful
            giver.&rdquo;
          </blockquote>
          <cite className="block mt-2 text-gold text-sm">
            — 2 Corinthians 9:7
          </cite>
        </div>
      </div>
    </div>
  );
}
