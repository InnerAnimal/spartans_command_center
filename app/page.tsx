export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-inner-animal-dark via-gray-900 to-inner-animal-dark">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl font-bold text-white mb-6">
            🦁 Inner Animal Platform
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Your unified integration hub for all services and tools
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-2">Integrations</h3>
              <p className="text-gray-400">Access all your services in one place</p>
            </div>
            <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-2">Production Apps</h3>
              <p className="text-gray-400">Monitor all your deployed applications</p>
            </div>
            <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-2">Subscriptions</h3>
              <p className="text-gray-400">Manage your subscription tiers</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

