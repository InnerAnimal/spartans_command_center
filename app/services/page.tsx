import Link from "next/link";
import Navigation from "@/components/layout/Navigation";
import { Palette, Monitor, TrendingUp, Target, Zap, Users } from "lucide-react";

export default function ServicesPage() {
  const services = [
    {
      icon: Palette,
      title: "Brand Identity",
      description: "Create compelling brand identities that resonate with your audience and stand out in the market.",
    },
    {
      icon: Monitor,
      title: "Web Design",
      description: "Beautiful, responsive websites that convert visitors into customers with seamless user experiences.",
    },
    {
      icon: TrendingUp,
      title: "Digital Marketing",
      description: "Data-driven marketing strategies that drive growth and maximize your ROI across all channels.",
    },
    {
      icon: Target,
      title: "Creative Strategy",
      description: "Strategic creative direction that aligns with your business goals and amplifies your message.",
    },
    {
      icon: Zap,
      title: "Multi-Asset Workstation",
      description: "Unified platform for managing all your digital assets, workflows, and team collaboration.",
    },
    {
      icon: Users,
      title: "Epic Team Collaboration",
      description: "Streamlined collaboration tools that keep your team aligned, productive, and inspired.",
    },
  ];

  return (
    <div className="min-h-screen bg-hero-gradient">
      <Navigation />

      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">
            Our{" "}
            <span className="text-brand-teal-light drop-shadow-[0_0_20px_rgba(95,156,158,0.5)]">
              Services
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Transform your vision into reality with our comprehensive suite of creative and strategic services.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <div
              key={index}
              className="card-neu hover:shadow-neu-emboss-lg transition-all duration-300 group cursor-pointer"
            >
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 shadow-neu-emboss-sm bg-gradient-teal">
                <service.icon className="h-7 w-7 text-charcoal-deep" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-foreground">{service.title}</h3>
              <p className="text-muted-foreground mb-4">{service.description}</p>
              <Link
                href="/contact"
                className="text-brand-teal-light hover:text-brand-teal font-medium transition-colors"
              >
                Learn More →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto card-neu text-center">
          <h2 className="text-3xl font-bold mb-4 text-foreground">
            Ready to Get Started?
          </h2>
          <p className="text-muted-foreground mb-8">
            Let's discuss how we can help bring your vision to life.
          </p>
          <Link href="/contact" className="btn-neu inline-block">
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
}

