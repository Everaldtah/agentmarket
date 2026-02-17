'use client'

import RatingStars from '@/components/RatingStars'
import ReviewList from '@/components/ReviewList'
import InstallButton from '@/components/InstallButton'
import PricingBadge from '@/components/PricingBadge'
import { useState } from 'react'

const agent = {
  id: '1',
  name: 'Code Assistant Pro',
  description: 'AI-powered code review and generation',
  longDescription: 'Code Assistant Pro is a powerful AI agent that helps developers write better code faster. It provides intelligent code suggestions, automated code reviews, and can even generate entire functions based on natural language descriptions.',
  category: 'Development',
  rating: 4.8,
  reviewCount: 234,
  downloads: 15420,
  pricing: 'free',
  icon: '💻',
  author: { name: 'DevTools Inc', verified: true },
  tags: ['code', 'development', 'review', 'generation'],
  capabilities: ['Code Review', 'Code Generation', 'Bug Detection', 'Documentation'],
  version: '2.1.0',
  updatedAt: '2026-02-15',
}

const reviews = [
  { id: '1', user: 'Alex K.', rating: 5, title: 'Game changer for my workflow', content: 'This agent has completely transformed how I write code. Highly recommend!', helpful: 42, createdAt: '2026-02-10' },
  { id: '2', user: 'Sarah M.', rating: 4, title: 'Very useful', content: 'Great for code reviews. Would love more language support.', helpful: 28, createdAt: '2026-02-08' },
  { id: '3', user: 'John D.', rating: 5, title: 'Best AI coding assistant', content: 'Tried many others, this one is by far the best.', helpful: 15, createdAt: '2026-02-05' },
]

export default function AgentDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-start gap-6 mb-8">
        <div className="text-6xl">{agent.icon}</div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{agent.name}</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">{agent.description}</p>
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1">
              <RatingStars rating={agent.rating} />
              <span className="ml-1 font-medium">{agent.rating}</span>
              <span className="text-gray-500">({agent.reviewCount} reviews)</span>
            </div>
            <span className="text-gray-500">{agent.downloads.toLocaleString()} downloads</span>
            <PricingBadge pricing={agent.pricing} price={agent.price} />
          </div>
          <div className="text-sm text-gray-500 mt-2">
            By {agent.author.name} {agent.author.verified && '✓'}
          </div>
        </div>
        <InstallButton agentId={agent.id} />
      </div>

      {/* Tabs */}
      <div className="border-b mb-6">
        {['overview', 'reviews', 'documentation'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 capitalize ${activeTab === tab ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <h2 className="text-xl font-bold mb-4">About</h2>
            <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
              {agent.longDescription}
            </p>
            
            <h3 className="text-lg font-bold mt-6 mb-3">Capabilities</h3>
            <div className="flex flex-wrap gap-2">
              {agent.capabilities.map(cap => (
                <span key={cap} className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                  {cap}
                </span>
              ))}
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-4">
            <h3 className="font-bold mb-3">Details</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500">Category</dt>
                <dd>{agent.category}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Version</dt>
                <dd>{agent.version}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Updated</dt>
                <dd>{agent.updatedAt}</dd>
              </div>
            </dl>
            
            <h3 className="font-bold mt-4 mb-2">Tags</h3>
            <div className="flex flex-wrap gap-1">
              {agent.tags.map(tag => (
                <span key={tag} className="px-2 py-0.5 bg-gray-200 dark:bg-slate-700 rounded text-xs">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'reviews' && (
        <ReviewList reviews={reviews} />
      )}

      {activeTab === 'documentation' && (
        <div className="prose dark:prose-invert max-w-none">
          <h2>Getting Started</h2>
          <p>To use this agent, simply click the Install button and follow the setup wizard.</p>
          <h3>Configuration</h3>
          <p>This agent requires the following environment variables:</p>
          <pre className="bg-gray-100 dark:bg-slate-800 p-4 rounded">
{`API_KEY=your_api_key
MODEL=gpt-4`}
          </pre>
        </div>
      )}
    </div>
  )
}
