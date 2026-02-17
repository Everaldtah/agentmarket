# AgentMarket Architecture

## Overview

AgentMarket is a marketplace platform for AI agents — enabling discovery, publishing, reviews, and one-click deployment of pre-built AI agents.

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         Frontend (Next.js)                               │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │   Home   │ │  Browse  │ │  Agent   │ │ Publish  │ │Dashboard │       │
│  │          │ │          │ │  Detail  │ │          │ │          │       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           API Gateway                                    │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │  Authentication │ Rate Limiting │ Request Validation │ Caching  │    │
│  └─────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        Core Services                                     │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐    │
│  │    Agent     │ │  Marketplace │ │   Review     │ │  Deployment  │    │
│  │   Registry   │ │   Service    │ │   Service    │ │   Service    │    │
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘    │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐    │
│  │    User      │ │   Search     │ │  Analytics   │ │  Category    │    │
│  │   Service    │ │   Service    │ │   Service    │ │   Service    │    │
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘    │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        Data Layer                                        │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐          │
│  │   PostgreSQL    │  │      Redis      │  │  Object Storage │          │
│  │  (Persistent)   │  │  (Cache/Queue)  │  │  (Agent Files)  │          │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘          │
└─────────────────────────────────────────────────────────────────────────┘
```

## Core Components

### 1. Agent Registry

Manages the lifecycle of AI agents in the marketplace.

```typescript
interface Agent {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  authorId: string;
  category: string;
  tags: string[];
  version: string;
  pricing: 'free' | 'paid' | 'subscription';
  price?: number;
  icon?: string;
  screenshots?: string[];
  config: {
    capabilities: string[];
    modelRequirements?: string[];
    environmentVars?: Record<string, string>;
  };
  stats: {
    downloads: number;
    rating: number;
    reviewCount: number;
  };
  status: 'draft' | 'published' | 'deprecated' | 'removed';
  createdAt: Date;
  updatedAt: Date;
}
```

### 2. Marketplace Service

Handles discovery, search, and filtering.

**Features:**
- Full-text search on name, description, tags
- Category-based browsing
- Filter by: pricing, rating, category, tags
- Sort by: popularity, rating, recent, name
- Featured agents carousel
- Trending agents

### 3. Review Service

Community feedback and ratings.

```typescript
interface Review {
  id: string;
  agentId: string;
  userId: string;
  rating: number; // 1-5
  title: string;
  content: string;
  helpful: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### 4. Deployment Service

One-click agent deployment.

```typescript
interface Deployment {
  id: string;
  agentId: string;
  userId: string;
  status: 'pending' | 'active' | 'failed' | 'stopped';
  config: Record<string, any>;
  deployedAt: Date;
  lastActivity?: Date;
}
```

### 5. User Service

User profiles and ownership.

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'user' | 'developer' | 'admin';
  publishedAgents: string[];
  deployments: string[];
  createdAt: Date;
}
```

### 6. Analytics Service

Track engagement and usage.

```typescript
interface AgentAnalytics {
  agentId: string;
  views: number;
  downloads: number;
  deployments: number;
  reviews: number;
  avgRating: number;
  revenue?: number;
  period: 'day' | 'week' | 'month' | 'year';
}
```

## Database Schema

```sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  avatar VARCHAR(500),
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Agents
CREATE TABLE agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  long_description TEXT,
  author_id UUID REFERENCES users(id),
  category VARCHAR(100) NOT NULL,
  tags TEXT[],
  version VARCHAR(50) DEFAULT '1.0.0',
  pricing VARCHAR(50) DEFAULT 'free',
  price DECIMAL(10,2),
  icon VARCHAR(500),
  screenshots TEXT[],
  config JSONB,
  downloads INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Reviews
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES agents(id),
  user_id UUID REFERENCES users(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  content TEXT,
  helpful INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(agent_id, user_id)
);

-- Deployments
CREATE TABLE deployments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES agents(id),
  user_id UUID REFERENCES users(id),
  status VARCHAR(50) DEFAULT 'pending',
  config JSONB,
  deployed_at TIMESTAMP DEFAULT NOW(),
  last_activity TIMESTAMP
);

-- Categories
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  icon VARCHAR(100),
  agent_count INTEGER DEFAULT 0,
  parent_id UUID REFERENCES categories(id)
);

-- Indexes
CREATE INDEX idx_agents_category ON agents(category);
CREATE INDEX idx_agents_status ON agents(status);
CREATE INDEX idx_agents_author ON agents(author_id);
CREATE INDEX idx_reviews_agent ON reviews(agent_id);
CREATE INDEX idx_deployments_user ON deployments(user_id);
```

## API Design

### REST Endpoints

#### Agents
- `GET /api/agents` - List/search agents (with filters)
- `GET /api/agents/:id` - Get agent details
- `POST /api/agents` - Publish new agent (auth required)
- `PUT /api/agents/:id` - Update agent (auth required)
- `DELETE /api/agents/:id` - Remove agent (auth required)

#### Reviews
- `GET /api/agents/:id/reviews` - Get agent reviews
- `POST /api/agents/:id/reviews` - Add review (auth required)
- `PUT /api/reviews/:id` - Update review (auth required)
- `DELETE /api/reviews/:id` - Delete review (auth required)
- `POST /api/reviews/:id/helpful` - Mark review helpful

#### Deployments
- `POST /api/deployments` - Deploy agent (auth required)
- `GET /api/deployments` - User's deployments (auth required)
- `GET /api/deployments/:id` - Deployment details
- `DELETE /api/deployments/:id` - Stop deployment

#### Categories
- `GET /api/categories` - List all categories
- `GET /api/categories/:slug/agents` - Agents in category

#### Users
- `GET /api/users/:id` - User profile
- `GET /api/users/:id/agents` - User's published agents
- `GET /api/users/me` - Current user (auth required)

#### Search
- `GET /api/search?q=query&filters` - Search agents

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL
- **Cache**: Redis
- **Storage**: S3-compatible object storage
- **Auth**: JWT

## Pricing Model

1. **Free Agents**: Community contributions, open source
2. **One-Time Purchase**: Pay once, use forever
3. **Subscription**: Monthly recurring fee
4. **Revenue Share**: Platform takes 20-30% commission

## Security Considerations

1. Agent code sandboxing
2. API rate limiting per user
3. Input sanitization for all user content
4. Review spam prevention
5. Secure deployment isolation
