'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const pricingTiers = [
  {
    name: 'Free',
    price: '$0',
    description: 'Perfect for trying out the platform',
    features: [
      '10 MCP Tools',
      '100 API Calls/Day',
      '1 Team Member',
      '1 Project',
      'Email Support',
      'Basic Analytics'
    ],
    stripePriceId: null,
  },
  {
    name: 'Starter',
    price: '$29',
    description: 'For small teams getting started',
    features: [
      '30 MCP Tools',
      '1,000 API Calls/Day',
      '3 Team Members',
      '3 Projects',
      'Priority Email Support',
      'Advanced Analytics',
      'Custom Access Tokens'
    ],
    stripePriceId: 'price_starter_monthly',
  },
  {
    name: 'Professional',
    price: '$99',
    description: 'For growing teams and businesses',
    features: [
      'All 65 MCP Tools',
      '10,000 API Calls/Day',
      '10 Team Members',
      'Unlimited Projects',
      'Chat Support',
      'Full Analytics',
      'Unlimited Access Tokens',
      'API Webhooks',
      'Custom Integrations'
    ],
    stripePriceId: 'price_professional_monthly',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: '$299',
    description: 'Everything + custom tools, dedicated support',
    features: [
      'Everything in Professional',
      'Custom MCP Tools',
      'Unlimited API Calls',
      'Unlimited Team Members',
      'Dedicated Support',
      'Custom Integrations',
      'SLA Guarantee',
      'Priority Feature Requests'
    ],
    stripePriceId: 'price_enterprise_monthly',
  },
];

export default function SubscribePage() {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  const handleSubscribe = async (tier: typeof pricingTiers[0]) => {
    if (!tier.stripePriceId) {
      // Free tier - redirect to signup
      window.location.href = '/signup?tier=free';
      return;
    }

    // Redirect to Stripe Checkout
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId: tier.stripePriceId, tierName: tier.name }),
      });

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-inner-animal-dark via-gray-900 to-inner-animal-dark py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-300">
            Select the perfect plan for your team
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pricingTiers.map((tier) => (
            <motion.div
              key={tier.name}
              whileHover={{ scale: 1.05 }}
              className={`relative bg-white/5 backdrop-blur-xl rounded-2xl p-6 border ${
                tier.popular
                  ? 'border-inner-animal-cyan border-2'
                  : 'border-white/10'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-inner-animal-cyan text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
              )}

              <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-white">{tier.price}</span>
                <span className="text-gray-400">/month</span>
              </div>
              <p className="text-gray-400 text-sm mb-6">{tier.description}</p>

              <ul className="space-y-3 mb-6">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-inner-animal-teal flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(tier)}
                className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                  tier.popular
                    ? 'bg-inner-animal-cyan text-white hover:bg-inner-animal-teal'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {tier.name === 'Free' ? 'Get Started' : 'Subscribe'}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}

