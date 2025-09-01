# OctoCode

**AI-Powered Development Platform with Intelligent Agent Orchestration**

OctoCode is a revolutionary development platform that uses intelligent agents to automate software development workflows. Built with Next.js 14, it features a Master Orchestrator that decomposes complex development prompts into specialized tasks executed by domain-specific agents.

## 🎯 Vision

Transform software development through AI-powered automation, where complex development tasks are intelligently decomposed and executed by specialized agents working in orchestrated workflows.

## ⚡ Features

- **🤖 Master Orchestrator** - Analyzes and decomposes complex prompts into actionable tasks
- **👥 Specialist Agents** - Domain experts for Frontend, Backend, DevOps, Database, and Testing
- **📊 Real-time Dashboard** - Live progress tracking with WebSocket-powered visualization
- **🏗️ Multi-tenant Ready** - Designed for evolution from single-user MVP to enterprise platform
- **🎨 Material Design 3** - Modern, accessible UI following Google's latest design system
- **🐳 Docker Ready** - Complete containerized development environment

## 🛠 Tech Stack

### Frontend
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Material Design 3** with pure CSS implementation
- **Zustand** for state management
- **Socket.io** for real-time communication

### Backend
- **Next.js API Routes** for serverless functions
- **Prisma ORM** with SQLite (MVP) → PostgreSQL (production)
- **NextAuth.js** for authentication
- **Anthropic SDK** for AI integration

### Infrastructure
- **Docker & Docker Compose** for development
- **pnpm** package manager
- **ESLint & Prettier** for code quality
- **Vitest & Playwright** for testing

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- pnpm 8+
- Docker & Docker Compose

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/octocode.git
   cd octocode
   ```

2. **Set up environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your API keys
   ```

3. **Start with Docker (Recommended)**
   ```bash
   # Run the automated setup script
   ./docker/scripts/dev-setup.sh
   
   # Or manually
   docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
   ```

4. **Start without Docker**
   ```bash
   pnpm install
   pnpm db:generate
   pnpm db:push
   pnpm dev
   ```

### Environment Variables

Create a `.env.local` file with:

```env
# Database
DATABASE_URL="file:./dev.db"

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# AI Integration
ANTHROPIC_API_KEY="your-anthropic-api-key"
```

## 🏗 Architecture

### Agent System

```
Master Orchestrator
├── Decomposition Agent (analyzes prompts)
├── Frontend Specialist (React, Next.js, TypeScript)
├── Backend Specialist (APIs, databases, services)
├── DevOps Specialist (Docker, deployment, CI/CD)
└── Code Reviewer (quality, best practices)
```

### Database Schema

Multi-tenant ready with user isolation:
- **Users** - Authentication and project ownership
- **Projects** - Development project containers
- **Tasks** - Individual agent work units
- **Workflows** - Orchestrated task sequences
- **Generated Files** - Code output tracking

## 📁 Project Structure

```
octocode/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   ├── api/               # API endpoints
│   │   ├── agents/        # Agent orchestration
│   │   ├── projects/      # Project management
│   │   └── websocket/     # Real-time updates
│   └── dashboard/         # Main application
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── agents/           # Agent-specific UI
│   └── workflow/         # Workflow visualization
├── lib/                  # Core utilities
│   ├── agents/           # Agent implementations
│   ├── db/               # Database utilities
│   └── utils/            # Helper functions
├── prisma/               # Database schema
└── docker/               # Container configs
```

## 🐳 Docker Development

The project includes a complete Docker development environment:

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f oc_app

# Access application container
docker exec -it oc_app bash

# Reset environment
./docker/scripts/dev-reset.sh
```

### Container Services
- **oc_app** - Next.js application (port 3000)
- **oc_database** - PostgreSQL database (port 5432)
- **oc_redis** - Redis for caching (port 6379)

## 📊 Development Commands

```bash
# Development
pnpm dev                 # Start development server
pnpm build              # Build for production
pnpm start              # Start production server

# Database
pnpm db:generate        # Generate Prisma client
pnpm db:push            # Push schema changes
pnpm db:migrate         # Run migrations
pnpm db:studio          # Open Prisma Studio

# Quality
pnpm lint               # Run ESLint
pnpm typecheck         # TypeScript checking
pnpm test              # Run tests
pnpm test:e2e          # End-to-end tests
```

## 🎨 Material Design 3

The project implements a complete Material Design 3 system with:

- **Dynamic Color System** - Adaptive light/dark themes
- **Typography Scale** - Complete MD3 type system
- **Component Library** - Buttons, cards, surfaces
- **Accessibility** - WCAG AA compliant
- **Motion System** - Smooth animations and transitions

## 🔮 Roadmap

### Phase 1: MVP (Current)
- [x] Next.js 14 foundation
- [x] Material Design 3 system
- [x] Docker development environment
- [x] Prisma schema design
- [x] Agent base architecture
- [ ] Master Orchestrator implementation
- [ ] Basic agent specializations

### Phase 2: Core Features
- [ ] Real-time workflow dashboard
- [ ] Socket.io integration
- [ ] Authentication system
- [ ] File generation and management
- [ ] Basic project management

### Phase 3: Multi-User
- [ ] PostgreSQL migration
- [ ] User isolation
- [ ] Collaboration features
- [ ] Advanced agent capabilities

### Phase 4: Enterprise
- [ ] Multi-tenant architecture
- [ ] Organization management
- [ ] Resource quotas and billing
- [ ] Advanced analytics

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🚨 Status

**🚧 Under Development** - This is an active MVP in development. Core features are being implemented.

## 📞 Support

- 📧 Email: support@octocode.dev
- 💬 Discord: [OctoCode Community](https://discord.gg/octocode)
- 📖 Docs: [docs.octocode.dev](https://docs.octocode.dev)

---

**Built with ❤️ by the OctoCode team**