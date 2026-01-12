import { Instagram, Facebook, ArrowRight } from "lucide-react";

// Placeholder data for demo
// In production, this would come from a third-party aggregator like Curator.io
const mockPosts = [
  {
    id: "1",
    platform: "instagram",
    content: "What an incredible Sunday! Thank you for worshiping with us. 🙌",
    imageUrl: null,
    date: "2 hours ago",
    link: "#",
  },
  {
    id: "2",
    platform: "facebook",
    content: "Join us this Wednesday for our midweek service. Doors open at 6:30 PM!",
    imageUrl: null,
    date: "1 day ago",
    link: "#",
  },
  {
    id: "3",
    platform: "instagram",
    content: "Our youth group had an amazing time at the retreat! 🏕️",
    imageUrl: null,
    date: "2 days ago",
    link: "#",
  },
  {
    id: "4",
    platform: "facebook",
    content: "Volunteers are the heart of our church. Thank you for serving!",
    imageUrl: null,
    date: "3 days ago",
    link: "#",
  },
];

const PlatformIcon = ({ platform }: { platform: string }) => {
  if (platform === "instagram") {
    return <Instagram className="w-4 h-4" />;
  }
  return <Facebook className="w-4 h-4" />;
};

export async function SocialFeed() {
  // In production: const posts = await fetchSocialPosts();
  const posts = mockPosts;

  return (
    <div>
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-gold text-xs uppercase tracking-wider mb-2">
            Stay Connected
          </p>
          <h2 className="font-heading text-display-sm text-text-primary">
            Follow Along
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            aria-label="Follow on Instagram"
          >
            <Instagram className="w-5 h-5 text-text-secondary" />
          </a>
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            aria-label="Follow on Facebook"
          >
            <Facebook className="w-5 h-5 text-text-secondary" />
          </a>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {posts.map((post) => (
          <a
            key={post.id}
            href={post.link}
            target="_blank"
            rel="noopener noreferrer"
            className="card group"
          >
            {/* Platform indicator */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-text-muted">
                <PlatformIcon platform={post.platform} />
                <span className="text-xs capitalize">{post.platform}</span>
              </div>
              <span className="text-xs text-text-muted">{post.date}</span>
            </div>

            {/* Image placeholder */}
            {post.imageUrl ? (
              <div className="aspect-square rounded-lg overflow-hidden mb-3 bg-bg-tertiary">
                {/* <Image src={post.imageUrl} ... /> */}
              </div>
            ) : (
              <div className="aspect-square rounded-lg mb-3 bg-gradient-to-br from-gold/5 to-bg-tertiary flex items-center justify-center">
                <PlatformIcon platform={post.platform} />
              </div>
            )}

            {/* Content */}
            <p className="text-text-secondary text-sm line-clamp-3 group-hover:text-text-primary transition-colors">
              {post.content}
            </p>

            {/* View link */}
            <div className="mt-3 flex items-center gap-1 text-gold text-xs opacity-0 group-hover:opacity-100 transition-opacity">
              View Post
              <ArrowRight className="w-3 h-3" />
            </div>
          </a>
        ))}
      </div>

      {/* Note about integration */}
      <div className="mt-8 p-4 rounded-lg bg-white/5 border border-white/10 text-center">
        <p className="text-text-muted text-sm">
          💡 <strong className="text-text-secondary">Integration Note:</strong> Connect with{" "}
          <a href="https://curator.io" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">
            Curator.io
          </a>{" "}
          or similar service for automated social media aggregation.
        </p>
      </div>
    </div>
  );
}
