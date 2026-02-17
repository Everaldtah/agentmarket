# AgentMarket

**AI Agent Marketplace Platform**

AgentMarket is a SaaS platform for discovering, publishing, and deploying pre-built AI agents. Think of it as an app store for AI agents.

## Features

- **Agent Registry**: Publish and version your AI agents
- **Marketplace Discovery**: Browse, search, and filter agents by category, rating, price
- **Reviews & Ratings**: Community feedback on agents
- **One-Click Deploy**: Install agents to your environment
- **User Dashboard**: Manage your published agents and deployments
- **Analytics**: Track downloads, usage, and engagement

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                 Frontend (Next.js)                       │
│  Home │ Browse │ Agent Detail │ Publish │ Dashboard     │
└─────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│                 Backend API                              │
├─────────────────────────────────────────────────────────┤
│  Agent Registry │ Marketplace │ Reviews │ Deployments   │
│  User System │ Analytics │ Search │ Categories          │
└─────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│                 Database                                 │
│  PostgreSQL: Agents │ Users │ Reviews │ Deployments     │
└─────────────────────────────────────────────────────────┘
```

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL (with in-memory option for dev)
- **Auth**: JWT-based authentication

## Getting Started

```bash
# Clone
git clone https://gitlab.com/kaelvolt11/agentmarket.git
cd agentmarket

# Backend
cd backend && npm install && npm run dev

# Frontend (new terminal)
cd frontend && npm install && npm run dev
```

## API Endpoints

### Agents
- `GET /api/agents` - List/search agents
- `GET /api/agents/:id` - Get agent details
- `POST /api/agents` - Publish new agent
- `PUT /api/agents/:id` - Update agent
- `DELETE /api/agents/:id` - Remove agent

### Reviews
- `GET /api/agents/:id/reviews` - Get reviews
- `POST /api/agents/:id/reviews` - Add review

### Deployments
- `POST /api/deployments` - Deploy agent
- `GET /api/users/:id/deployments` - User's deployments

### Categories
- `GET /api/categories` - List all categories

## License

MIT
