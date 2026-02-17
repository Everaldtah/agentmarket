import AgentCard from '@/components/AgentCard'
import SearchBar from '@/components/SearchBar'
import CategoryNav from '@/components/CategoryNav'
import Link from 'next/link'

const featuredAgents = [
  { id: '1', name: 'Code Assistant Pro', description: 'AI-powered code review and generation', category: 'Development', rating: 4.8, downloads: 15420, pricing: 'free', icon: '💻' },
  { id: '2', name: 'Data Analyst Bot', description: 'Analyze datasets and generate insights', category: 'Analytics', rating: 4.6, downloads: 8930, pricing: 'paid', price: 29, icon: '📊' },
  { id: '3', name: 'Content Writer', description: 'Generate high-quality content for any purpose', category: 'Content', rating: 4.9, downloads: 23100, pricing: 'subscription', price: 9, icon: '✍️' },
  { id: '4', name: 'Customer Support AI', description: '24/7 automated customer support agent', category: 'Support', rating: 4.7, downloads: 12500, pricing: 'subscription', price: 49, icon: '🎧' },
]

const categories = [
  { name: 'Development', slug: 'development', count: 156, icon: '💻' },
  { name: 'Analytics', slug: 'analytics', count: 89, icon: '📊' },
  { name: 'Content', slug: 'content', count: 234, icon: '✍️' },
  { name: 'Support', slug: 'support', count: 67, icon: '🎧' },
  { name: 'Marketing', slug: 'marketing', count: 112, icon: '📈' },
  { name: 'Research', slug: 'research', count: 45, icon: '🔬' },
]

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero */}
      <section className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4">AI Agent Marketplace</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          Discover, publish, and deploy pre-built AI agents
        </p>
        <div className="max-w-2xl mx-auto">
          <SearchBar />
        </div>
      </section>

      {/* Categories */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Browse by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map(cat => (
            <Link
              key={cat.slug}
              href={`/browse?category=${cat.slug}`}
              className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow hover:shadow-md transition text-center"
            >
              <div className="text-3xl mb-2">{cat.icon}</div>
              <div className="font-medium">{cat.name}</div>
              <div className="text-sm text-gray-500">{cat.count} agents</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Agents */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Featured Agents</h2>
          <Link href="/browse" className="text-blue-600 hover:underline">View all →</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredAgents.map(agent => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Publish Your Agent</h2>
        <p className="mb-6">Share your AI agent with the world and start earning</p>
        <Link href="/publish" className="inline-block px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100">
          Start Publishing
        </Link>
      </section>
    </div>
  )
}
