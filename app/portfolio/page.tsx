import Link from "next/link";
import Navigation from "@/components/layout/Navigation";
import { ExternalLink } from "lucide-react";

export default function PortfolioPage() {
  const projects = [
    {
      title: "Meauxbility Wordmark",
      category: "Branding",
      description: "Professional brand identity design that captures the essence of the organization.",
    },
    {
      title: "Mobile Squad App",
      category: "Web Application",
      description: "Mobile-first application with seamless user experience and modern design.",
    },
    {
      title: "Race Platform Experience",
      category: "Web Platform",
      description: "Comprehensive platform design for race management and community engagement.",
    },
    {
      title: "3D Brand Elements",
      category: "Brand Design",
      description: "Innovative 3D brand elements that bring visual identity to life.",
    },
    {
      title: "Training with ATF 2022",
      category: "Event Design",
      description: "Event branding and digital assets for training program with ATF.",
    },
    {
      title: "Community Outreach Hub",
      category: "Web Platform",
      description: "Community-focused platform design for outreach and engagement.",
    },
    {
      title: "Team Building Platform",
      category: "Web Application",
      description: "Collaborative platform designed to enhance team productivity and communication.",
    },
    {
      title: "Brand Meaning",
      category: "Brand Strategy",
      description: "Strategic brand development that connects meaning with visual identity.",
    },
    {
      title: "Event Management System",
      category: "Web Application",
      description: "Comprehensive event management solution with intuitive design.",
    },
  ];

  const categories = ["All", "Branding", "Web Application", "Web Platform", "Brand Design", "Event Design", "Brand Strategy"];

  return (
    <div className="min-h-screen bg-hero-gradient">
      <Navigation />

      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">
            Our{" "}
            <span className="text-brand-teal-light drop-shadow-[0_0_20px_rgba(95,156,158,0.5)]">
              Portfolio
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Explore our collection of projects that showcase our expertise in design, development, and strategy.
          </p>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {projects.map((project, index) => (
            <div
              key={index}
              className="card-neu hover:shadow-neu-emboss-lg transition-all duration-300 group cursor-pointer"
            >
              <div className="aspect-video bg-charcoal-light rounded-xl mb-4 flex items-center justify-center">
                <div className="text-muted-foreground text-sm">{project.category}</div>
              </div>
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-xl font-bold text-foreground">{project.title}</h3>
                <ExternalLink className="h-5 w-5 text-muted-foreground group-hover:text-brand-teal transition-colors" />
              </div>
              <p className="text-muted-foreground mb-4">{project.description}</p>
              <span className="text-xs text-brand-teal-light font-medium">{project.category}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto card-neu text-center">
          <h2 className="text-3xl font-bold mb-4 text-foreground">
            Have a Project in Mind?
          </h2>
          <p className="text-muted-foreground mb-8">
            Let's collaborate to bring your vision to life.
          </p>
          <Link href="/contact" className="btn-neu inline-block">
            Start a Project
          </Link>
        </div>
      </section>
    </div>
  );
}

