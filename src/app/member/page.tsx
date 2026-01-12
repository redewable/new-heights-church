import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  User, 
  Users, 
  Bookmark, 
  GraduationCap, 
  Droplet,
  Settings,
  LogOut,
  ChevronRight,
  Baby
} from "lucide-react";

export const metadata = {
  title: "Member Dashboard",
};

const quickActions = [
  {
    title: "My Family",
    description: "Manage household and children profiles",
    href: "/member/family",
    icon: Users,
    color: "bg-gold/10 text-gold",
  },
  {
    title: "Kids Check-in",
    description: "Check in your children for service",
    href: "/member/family",
    icon: Baby,
    color: "bg-success/10 text-success-light",
  },
  {
    title: "Saved Items",
    description: "Your bookmarked sermons and content",
    href: "/member/saved",
    icon: Bookmark,
    color: "bg-warning/10 text-warning-light",
  },
  {
    title: "Training",
    description: "Continue your learning journey",
    href: "/member/training",
    icon: GraduationCap,
    color: "bg-gold/10 text-gold",
  },
];

const pathways = [
  {
    title: "New to New Heights",
    description: "Start your journey with our onboarding class",
    href: "/member/pathways/n2n",
    status: "available",
  },
  {
    title: "Baptism",
    description: "Take your next step of faith",
    href: "/member/baptism",
    status: "available",
  },
];

export default async function MemberDashboardPage() {
  const supabase = await createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/member/login");
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const displayName = profile?.full_name || user.email?.split("@")[0] || "Member";

  return (
    <div className="min-h-screen bg-bg pt-28 pb-16">
      <div className="container-site">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-gold/10 flex items-center justify-center">
              <User className="w-7 h-7 text-gold" />
            </div>
            <div>
              <h1 className="font-heading text-display-sm text-text-primary">
                Welcome, {displayName}
              </h1>
              <p className="text-text-secondary">
                {user.email}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Link
              href="/member/settings"
              className="btn-ghost text-sm"
            >
              <Settings className="w-4 h-4" />
              Settings
            </Link>
            <form action="/api/auth/signout" method="POST">
              <button type="submit" className="btn-ghost text-sm text-error-light">
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </form>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="font-heading text-heading-md text-text-primary mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Link
                key={action.title}
                href={action.href}
                className="card group flex items-start gap-4"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${action.color}`}>
                  <action.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading text-heading-sm text-text-primary group-hover:text-gold transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-text-muted text-sm">
                    {action.description}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-text-muted group-hover:text-gold transition-colors flex-shrink-0" />
              </Link>
            ))}
          </div>
        </div>

        {/* Pathways */}
        <div className="mb-12">
          <h2 className="font-heading text-heading-md text-text-primary mb-4">
            Your Pathways
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pathways.map((pathway) => (
              <Link
                key={pathway.title}
                href={pathway.href}
                className="card group flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0">
                  <Droplet className="w-5 h-5 text-gold" />
                </div>
                <div className="flex-1">
                  <h3 className="font-heading text-heading-sm text-text-primary group-hover:text-gold transition-colors">
                    {pathway.title}
                  </h3>
                  <p className="text-text-muted text-sm">
                    {pathway.description}
                  </p>
                </div>
                <span className="px-2 py-1 bg-success/20 text-success-light text-xs rounded">
                  Available
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="font-heading text-heading-md text-text-primary mb-4">
            Recent Activity
          </h2>
          <div className="card">
            <p className="text-text-muted text-center py-8">
              Your recent activity will appear here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
