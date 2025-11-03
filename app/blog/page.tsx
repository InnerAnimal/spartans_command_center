import Link from "next/link";
import Navigation from "@/components/layout/Navigation";
import { Calendar, ArrowRight } from "lucide-react";

export default function BlogPage() {
  const posts = [
    {
      title: "The Future of Digital Design",
      excerpt: "Exploring the latest trends and innovations shaping the future of digital design and user experience.",
      date: "November 2, 2025",
      category: "Design",
    },
    {
      title: "Building Better User Experiences",
      excerpt: "Key principles and strategies for creating user experiences that truly resonate with your audience.",
      date: "October 28, 2025",
      category: "UX/UI",
    },
    {
      title: "Brand Identity in the Digital Age",
      excerpt: "How to create a cohesive brand identity that works across all digital platforms and touchpoints.",
      date: "October 20, 2025",
      category: "Branding",
    },
    {
      title: "The Power of Collaboration",
      excerpt: "Why collaboration is essential for creative success and how to build better partnerships.",
      date: "October 15, 2025",
      category: "Strategy",
    },
    {
      title: "Innovation in Web Development",
      excerpt: "Latest technologies and approaches that are revolutionizing web development and deployment.",
      date: "October 10, 2025",
      category: "Development",
    },
    {
      title: "Measuring Creative Impact",
      excerpt: "How to measure and demonstrate the impact of your creative work and design decisions.",
      date: "October 5, 2025",
      category: "Strategy",
    },
  ];

  return (
    <div className="min-h-screen bg-hero-gradient">
      <Navigation />

      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">
            Insights &{" "}
            <span className="text-brand-teal-light drop-shadow-[0_0_20px_rgba(95,156,158,0.5)]">
              Blog
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Stay updated with the latest insights, trends, and perspectives from our team.
          </p>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {posts.map((post, index) => (
            <Link
              key={index}
              href={`/blog/${post.title.toLowerCase().replace(/\s+/g, '-')}`}
              className="card-neu hover:shadow-neu-emboss-lg transition-all duration-300 group cursor-pointer block"
            >
              <div className="mb-4">
                <span className="text-xs text-brand-teal-light font-medium">{post.category}</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-foreground group-hover:text-brand-teal-light transition-colors">
                {post.title}
              </h3>
              <p className="text-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{post.date}</span>
                </div>
                <ArrowRight className="h-5 w-5 text-brand-teal-light group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto card-neu text-center">
          <h2 className="text-3xl font-bold mb-4 text-foreground">
            Stay Connected
          </h2>
          <p className="text-muted-foreground mb-8">
            Subscribe to get the latest insights and updates delivered to your inbox.
          </p>
          <div className="flex gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="input-neu flex-1"
            />
            <button className="btn-neu">Subscribe</button>
          </div>
        </div>
      </section>
    </div>
  );
}

