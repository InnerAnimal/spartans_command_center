import Link from "next/link";
import Navigation from "@/components/layout/Navigation";
import { Target, Users, Sparkles, Award } from "lucide-react";

export default function AboutPage() {
  const values = [
    {
      icon: Target,
      title: "Mission-Driven",
      description: "We're committed to creating meaningful impact through innovative design and technology.",
    },
    {
      icon: Users,
      title: "Collaborative",
      description: "We believe the best results come from working closely with our clients as partners.",
    },
    {
      icon: Sparkles,
      title: "Innovative",
      description: "We stay ahead of trends and embrace new technologies to deliver cutting-edge solutions.",
    },
    {
      icon: Award,
      title: "Excellence",
      description: "We strive for excellence in every project, ensuring the highest quality standards.",
    },
  ];

  return (
    <div className="min-h-screen bg-hero-gradient">
      <Navigation />

      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">
            About{" "}
            <span className="text-brand-teal-light drop-shadow-[0_0_20px_rgba(95,156,158,0.5)]">
              Inner Animal Media
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            We're a creative agency dedicated to transforming ideas into impactful digital experiences.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto card-neu">
          <h2 className="text-3xl font-bold mb-4 text-foreground">Our Mission</h2>
          <p className="text-muted-foreground text-lg leading-relaxed mb-4">
            At Inner Animal Media, we believe in the power of creative expression and strategic thinking. 
            Our mission is to help organizations communicate their vision effectively through innovative design, 
            compelling narratives, and cutting-edge technology.
          </p>
          <p className="text-muted-foreground text-lg leading-relaxed">
            We combine artistic creativity with technical expertise to deliver solutions that not only look 
            amazing but also drive real business results. Every project is an opportunity to create something 
            meaningful that resonates with audiences and makes a lasting impact.
          </p>
        </div>
      </section>

      {/* Values Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8 text-center text-foreground">Our Values</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {values.map((value, index) => (
            <div
              key={index}
              className="card-neu hover:shadow-neu-emboss-lg transition-all duration-300 text-center"
            >
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 shadow-neu-emboss-sm bg-gradient-teal mx-auto">
                <value.icon className="h-7 w-7 text-charcoal-deep" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-foreground">{value.title}</h3>
              <p className="text-muted-foreground">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 text-foreground">Meet Our Team</h2>
          <p className="text-muted-foreground mb-8">
            Our talented team brings together diverse expertise to deliver exceptional results.
          </p>
          <Link href="/team" className="btn-neu inline-block">
            View Team
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto card-neu text-center">
          <h2 className="text-3xl font-bold mb-4 text-foreground">
            Let's Work Together
          </h2>
          <p className="text-muted-foreground mb-8">
            Ready to bring your vision to life? Get in touch and let's start a conversation.
          </p>
          <Link href="/contact" className="btn-neu inline-block">
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
}

