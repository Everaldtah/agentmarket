'use client'

import { useState } from 'react'

const categories = ['Development', 'Analytics', 'Content', 'Support', 'Marketing', 'Research', 'Finance', 'Other']

export default function PublishPage() {
  const [form, setForm] = useState({
    name: '',
    description: '',
    longDescription: '',
    category: '',
    tags: '',
    pricing: 'free',
    price: '',
    capabilities: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Publishing agent:', form)
    alert('Agent published successfully! (Demo)')
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Publish Your Agent</h1>
      <p className="text-gray-600 mb-8">Share your AI agent with the community</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">Agent Name *</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full p-3 border rounded-lg dark:bg-slate-800"
            placeholder="My Awesome Agent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Short Description *</label>
          <input
            type="text"
            required
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full p-3 border rounded-lg dark:bg-slate-800"
            placeholder="A brief description of what your agent does"
            maxLength={200}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Full Description</label>
          <textarea
            value={form.longDescription}
            onChange={(e) => setForm({ ...form, longDescription: e.target.value })}
            className="w-full p-3 border rounded-lg dark:bg-slate-800"
            rows={5}
            placeholder="Detailed description, use cases, and examples"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Category *</label>
            <select
              required
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full p-3 border rounded-lg dark:bg-slate-800"
            >
              <option value="">Select category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Pricing *</label>
            <select
              required
              value={form.pricing}
              onChange={(e) => setForm({ ...form, pricing: e.target.value })}
              className="w-full p-3 border rounded-lg dark:bg-slate-800"
            >
              <option value="free">Free</option>
              <option value="paid">One-time Purchase</option>
              <option value="subscription">Subscription</option>
            </select>
          </div>
        </div>

        {form.pricing !== 'free' && (
          <div>
            <label className="block text-sm font-medium mb-1">Price ($)</label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full p-3 border rounded-lg dark:bg-slate-800"
              placeholder="29"
              min="1"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">Tags (comma-separated)</label>
          <input
            type="text"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            className="w-full p-3 border rounded-lg dark:bg-slate-800"
            placeholder="code, ai, productivity"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Capabilities (comma-separated)</label>
          <input
            type="text"
            value={form.capabilities}
            onChange={(e) => setForm({ ...form, capabilities: e.target.value })}
            className="w-full p-3 border rounded-lg dark:bg-slate-800"
            placeholder="Code Review, Bug Detection, Documentation"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
        >
          Publish Agent
        </button>
      </form>
    </div>
  )
}
