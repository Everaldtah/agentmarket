import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { AgentRepository } from './repositories/agent.repository'
import { ReviewRepository } from './repositories/review.repository'
import { DeploymentRepository } from './repositories/deployment.repository'
import { UserRepository } from './repositories/user.repository'

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(helmet())
app.use(cors())
app.use(express.json())

// Repositories (in-memory for demo)
const agentRepo = new AgentRepository()
const reviewRepo = new ReviewRepository()
const deploymentRepo = new DeploymentRepository()
const userRepo = new UserRepository()

// Seed some data
agentRepo.seed()

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// ============ AGENTS ============

// List agents
app.get('/api/agents', (req, res) => {
  const { category, pricing, search, sort = 'popular', page = 1, limit = 20 } = req.query
  
  let agents = agentRepo.findAll()
  
  if (category) {
    agents = agents.filter(a => a.category.toLowerCase() === (category as string).toLowerCase())
  }
  if (pricing) {
    agents = agents.filter(a => a.pricing === pricing)
  }
  if (search) {
    const q = (search as string).toLowerCase()
    agents = agents.filter(a => 
      a.name.toLowerCase().includes(q) || 
      a.description.toLowerCase().includes(q) ||
      a.tags.some(t => t.toLowerCase().includes(q))
    )
  }
  
  // Sort
  if (sort === 'popular') {
    agents = agents.sort((a, b) => b.downloads - a.downloads)
  } else if (sort === 'rating') {
    agents = agents.sort((a, b) => b.rating - a.rating)
  } else if (sort === 'newest') {
    agents = agents.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }
  
  const offset = (Number(page) - 1) * Number(limit)
  const paginated = agents.slice(offset, offset + Number(limit))
  
  res.json({ agents: paginated, total: agents.length, page, limit: Number(limit) })
})

// Get agent
app.get('/api/agents/:id', (req, res) => {
  const agent = agentRepo.findById(req.params.id)
  if (!agent) return res.status(404).json({ error: 'Agent not found' })
  res.json(agent)
})

// Create agent
app.post('/api/agents', (req, res) => {
  const agent = agentRepo.create({
    ...req.body,
    id: crypto.randomUUID(),
    downloads: 0,
    rating: 0,
    reviewCount: 0,
    status: 'published',
    createdAt: new Date(),
    updatedAt: new Date(),
  })
  res.status(201).json(agent)
})

// Update agent
app.put('/api/agents/:id', (req, res) => {
  const agent = agentRepo.update(req.params.id, {
    ...req.body,
    updatedAt: new Date(),
  })
  if (!agent) return res.status(404).json({ error: 'Agent not found' })
  res.json(agent)
})

// Delete agent
app.delete('/api/agents/:id', (req, res) => {
  const deleted = agentRepo.delete(req.params.id)
  if (!deleted) return res.status(404).json({ error: 'Agent not found' })
  res.status(204).send()
})

// ============ REVIEWS ============

// Get reviews for agent
app.get('/api/agents/:id/reviews', (req, res) => {
  const reviews = reviewRepo.findByAgentId(req.params.id)
  res.json({ reviews })
})

// Add review
app.post('/api/agents/:id/reviews', (req, res) => {
  const review = reviewRepo.create({
    id: crypto.randomUUID(),
    agentId: req.params.id,
    ...req.body,
    helpful: 0,
    createdAt: new Date(),
  })
  
  // Update agent rating
  const allReviews = reviewRepo.findByAgentId(req.params.id)
  const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
  agentRepo.update(req.params.id, { rating: avgRating, reviewCount: allReviews.length })
  
  res.status(201).json(review)
})

// ============ DEPLOYMENTS ============

// Deploy agent
app.post('/api/deployments', (req, res) => {
  const deployment = deploymentRepo.create({
    id: crypto.randomUUID(),
    ...req.body,
    status: 'active',
    deployedAt: new Date(),
  })
  
  // Increment download count
  const agent = agentRepo.findById(req.body.agentId)
  if (agent) {
    agentRepo.update(req.body.agentId, { downloads: agent.downloads + 1 })
  }
  
  res.status(201).json(deployment)
})

// Get user deployments
app.get('/api/users/:id/deployments', (req, res) => {
  const deployments = deploymentRepo.findByUserId(req.params.id)
  res.json({ deployments })
})

// ============ CATEGORIES ============

app.get('/api/categories', (req, res) => {
  const agents = agentRepo.findAll()
  const categories = [
    { name: 'Development', slug: 'development', icon: '💻' },
    { name: 'Analytics', slug: 'analytics', icon: '📊' },
    { name: 'Content', slug: 'content', icon: '✍️' },
    { name: 'Support', slug: 'support', icon: '🎧' },
    { name: 'Marketing', slug: 'marketing', icon: '📈' },
    { name: 'Research', slug: 'research', icon: '🔬' },
  ].map(cat => ({
    ...cat,
    count: agents.filter(a => a.category.toLowerCase() === cat.slug).length,
  }))
  res.json({ categories })
})

// Start server
app.listen(PORT, () => {
  console.log(`AgentMarket API running on port ${PORT}`)
})

export default app
