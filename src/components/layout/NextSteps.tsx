import Link from "next/link";
import { UserPlus, Droplet, BookOpen, Users, ArrowRight } from "lucide-react";

const steps = [
  {
    title: "New to New Heights",
    description: "Start your journey with us. Learn about who we are and what we believe.",
    href: "/member/pathways/n2n",
    icon: UserPlus,
    cta: "Get Started",
  },
  {
    title: "Baptism",
    description: "Take the next step in your faith journey through baptism.",
    href: "/member/baptism",
    icon: Droplet,
    cta: "Sign Up",
  },
  {
    title: "Evangelism Training",
    description: "Equip yourself to share your faith with others confidently.",
    href: "/member/training",
    icon: BookOpen,
    cta: "Learn More",
  },
  {
    title: "Join a Group",
    description: "Connect with others in community and grow together.",
    href: "/events",
    icon: Users,
    cta: "Find a Group",
  },
];

export function NextSteps() {
  return (
    <div>
      {/* Section Header */}
      <div className="text-center mb-12">
        <p className="text-gold text-xs uppercase tracking-wider mb-2">
          Your Journey
        </p>
        <h2 className="font-heading text-display-sm text-text-primary mb-4">
          Next Steps
        </h2>
        <p className="text-text-secondary max-w-2xl mx-auto">
          No matter where you are in your faith journey, there&apos;s a next step for you.
        </p>
      </div>

      {/* Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step) => (
          <Link
            key={step.title}
            href={step.href}
            className="card group text-center"
          >
            {/* Icon */}
            <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
              <step.icon className="w-6 h-6 text-gold" />
            </div>

            {/* Content */}
            <h3 className="font-heading text-heading-sm text-text-primary mb-2 group-hover:text-gold transition-colors">
              {step.title}
            </h3>
            <p className="text-text-secondary text-sm mb-4 line-clamp-2">
              {step.description}
            </p>

            {/* CTA */}
            <span className="inline-flex items-center gap-1 text-gold text-sm font-medium">
              {step.cta}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
