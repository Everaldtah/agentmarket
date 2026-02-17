'use client'

import { useState, useEffect } from 'react'
import AgentCard from '@/components/AgentCard'
import SearchBar from '@/components/SearchBar'
import CategoryNav from '@/components/CategoryNav'

const allAgents = [
  { id: '1', name: 'Code Assistant Pro', description: 'AI-powered code review and generation', category: 'Development', rating: 4.8, downloads: 15420, pricing: 'free', icon: '💻' },
  { id: '2', name: 'Data Analyst Bot', description: 'Analyze datasets and generate insights', category: 'Analytics', rating: 4.6, downloads: 8930, pricing: 'paid', price: 29, icon: '📊' },
  { id: '3', name: 'Content Writer', description: 'Generate high-quality content for any purpose', category: 'Content', rating: 4.9, downloads: 23100, pricing: 'subscription', price: 9, icon: '✍️' },
  { id: '4', name: 'Customer Support AI', description: '24/7 automated customer support agent', category: 'Support', rating: 4.7, downloads: 12500, pricing: 'subscription', price: 49, icon: '🎧' },
  { id: '5', name: 'SEO Optimizer', description: 'Optimize content for search engines', category: 'Marketing', rating: 4.5, downloads: 6700, pricing: 'paid', price: 19, icon: '🔍' },
  { id: '6', name: 'Research Assistant', description: 'Deep research and summarization', category: 'Research', rating: 4.8, downloads: 9200, pricing: 'free', icon: '🔬' },
]

export default function BrowsePage() {
  const [agents, setAgents] = useState(allAgents)
  const [category, setCategory] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState('popular')

  useEffect(() => {
    let filtered = category 
      ? allAgents.filter(a => a.category.toLowerCase() === category)
      : allAgents
    
    if (sortBy === 'popular') {
      filtered = [...filtered].sort((a, b) => b.downloads - a.downloads)
    } else if (sortBy === 'rating') {
      filtered = [...filtered].sort((a, b) => b.rating - a.rating)
    }
    
    setAgents(filtered)
  }, [category, sortBy])

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Browse Agents</h1>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <CategoryNav 
            selected={category} 
            onSelect={setCategory} 
          />
          
          <div className="mt-6">
            <label className="block text-sm font-medium mb-2">Sort by</label>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full p-2 border rounded-lg dark:bg-slate-800"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </aside>

        {/* Grid */}
        <div className="flex-1">
          <div className="mb-4 text-gray-600">
            {agents.length} agents found
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map(agent => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
