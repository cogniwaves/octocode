# OctoCode MVP - Architecture Next.js 14

## Stack Technique Révisé

### Frontend (Next.js 14)
```
├── Framework: Next.js 14 + React 18 (App Router)
├── Styling: Material Design 3
├── State Management: Zustand (simple, performant)
├── UI Components: shadcn/ui + custom components
├── Real-time: WebSocket via Socket.io-client
└── TypeScript: Full type safety
```

### Backend (Next.js API Routes)
```
├── API Layer: Next.js 14 API Routes (app/api/)
├── Database: Prisma ORM + SQLite (MVP) → PostgreSQL (production)
├── Authentication: NextAuth.js (préparé pour multi-tenant)
├── Real-time: Socket.io server
├── AI Integration: Anthropic SDK
└── File System: Local storage + future cloud migration path
```

### DevOps & Deployment
```
├── Local Development: Docker Compose avec containers oc_*
├── Database Migrations: Prisma migrate
├── Testing: Vitest + Playwright
├── Monitoring: Built-in Next.js analytics
└── Future: Vercel deployment ready
```

---

## Architecture MVP avec Future-Proofing

### Structure de Projet
```
octocode/
├── app/                          # Next.js 14 App Router
│   ├── (auth)/                   # Auth routes groupées
│   ├── api/                      # API Routes
│   │   ├── agents/               # Agent endpoints
│   │   ├── projects/             # Project management
│   │   └── websocket/            # Real-time communication
│   ├── dashboard/                # Main application
│   ├── globals.css               # Global MD3 Styles
│   └── layout.tsx                # Root layout
├── components/                   # Shared UI components
│   ├── ui/                       # shadcn/ui components
│   ├── agents/                   # Agent-specific components
│   └── workflow/                 # Workflow builder components
├── lib/                          # Utilities & configs
│   ├── agents/                   # Agent logic
│   ├── db/                       # Database utilities
│   └── utils.ts                  # Helper functions
├── prisma/                       # Database schema & migrations
└── docker/                       # Container configurations
```

### Multi-Tenant Preparation
```typescript
// Modèle de données préparé pour multi-tenancy
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  // Future: organizationId String?
  projects  Project[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Project {
  id          String   @id @default(cuid())
  name        String
  description String?
  userId      String   // Isolation par utilisateur (MVP)
  // Future: organizationId String? // Multi-tenant
  user        User     @relation(fields: [userId], references: [id])
  tasks       Task[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

---

## Agents Architecture dans Next.js

### Agent Base Class
```typescript
// lib/agents/base-agent.ts
export abstract class BaseAgent {
  abstract name: string;
  abstract type: AgentType;
  
  constructor(
    protected projectId: string,
    protected userId: string // Ready for multi-tenant
  ) {}
  
  abstract execute(task: Task): Promise<AgentResult>;
  
  protected async updateProgress(progress: number, status: string) {
    // WebSocket update to frontend
    await this.notifyProgress(this.projectId, progress, status);
  }
}
```

### Master Orchestrator API Route
```typescript
// app/api/agents/orchestrator/route.ts
export async function POST(request: Request) {
  const { prompt, userId, projectId } = await request.json();
  
  // 1. Classify prompt
  const classification = classifyPrompt(prompt);
  
  // 2. Create decomposition
  const decomposer = new DecompositionAgent(projectId, userId);
  const tasks = await decomposer.decompose(prompt, classification);
  
  // 3. Execute workflow (sequential for MVP)
  const orchestrator = new MasterOrchestrator(projectId, userId);
  const result = await orchestrator.execute(tasks);
  
  return NextResponse.json(result);
}
```

### Frontend Specialist Agent
```typescript
// lib/agents/frontend-specialist.ts
export class FrontendSpecialistAgent extends BaseAgent {
  name = "Frontend Specialist";
  type = AgentType.FRONTEND;
  
  async execute(task: Task): Promise<AgentResult> {
    await this.updateProgress(10, "Analyzing component requirements...");
    
    // Generate Next.js components with TypeScript
    const prompt = this.buildPrompt(task, {
      framework: "Next.js 14",
      styling: "MD3",
      components: "shadcn/ui",
      typescript: true
    });
    
    const code = await this.callClaudeAPI(prompt);
    
    await this.updateProgress(80, "Generating tests...");
    const tests = await this.generateTests(code);
    
    return {
      code,
      tests,
      files: this.organizeFiles(code, tests)
    };
  }
}
```

---

## Real-Time Dashboard

### Workflow Canvas Component
```typescript
// components/workflow/canvas.tsx
"use client";

import { useEffect, useState } from 'react';
import { useSocket } from '@/lib/hooks/use-socket';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export function WorkflowCanvas({ projectId }: { projectId: string }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const socket = useSocket();
  
  useEffect(() => {
    socket?.on(`project:${projectId}:progress`, (update) => {
      setTasks(prev => prev.map(task => 
        task.id === update.taskId 
          ? { ...task, progress: update.progress, status: update.status }
          : task
      ));
    });
    
    return () => socket?.off(`project:${projectId}:progress`);
  }, [socket, projectId]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tasks.map(task => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}
```

### Task Card Component
```typescript
// components/workflow/task-card.tsx
function TaskCard({ task }: { task: Task }) {
  return (
    <Card className={`transition-all ${getStatusColor(task.status)}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {getAgentIcon(task.agentType)} {task.title}
        </CardTitle>
        <Badge variant={getStatusVariant(task.status)}>
          {task.status}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="text-xs text-muted-foreground mb-2">
          {task.description}
        </div>
        <Progress value={task.progress} className="w-full" />
        <div className="text-xs text-muted-foreground mt-1">
          {task.progress}% complete
        </div>
      </CardContent>
    </Card>
  );
}
```

---

## Docker Setup pour Development

### docker-compose.yml
```yaml
version: '3.8'
services:
  oc_app:
    build:
      context: .
      dockerfile: docker/Dockerfile.app
    container_name: oc_app
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
      - /app/.next
    environment:
      - DATABASE_URL=file:./dev.db
      - NEXTAUTH_URL=http://localhost:3000
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
    networks:
      - oc_network

  oc_database:
    image: postgres:15-alpine
    container_name: oc_database
    environment:
      - POSTGRES_DB=octocode
      - POSTGRES_USER=octocode
      - POSTGRES_PASSWORD=dev_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - oc_network

networks:
  oc_network:
    driver: bridge

volumes:
  postgres_data:
```

### Dockerfile pour App
```dockerfile
# docker/Dockerfile.app
FROM archlinux:latest

# Install base packages
RUN pacman -Syu --noconfirm && \
    pacman -S --noconfirm nodejs npm python python-pip git

# Install pnpm for faster package management
RUN npm install -g pnpm

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

# Copy source code
COPY . .

# Generate Prisma client
RUN pnpm prisma generate

# Expose port
EXPOSE 3000

# Development command
CMD ["pnpm", "dev"]
```

---

## Timeline Révisé (10 semaines)

### Semaines 1-2: Foundation Next.js
- Setup Next.js 14 avec App Router
- Configuration Prisma + SQLite
- Authentication basique NextAuth.js
- Docker environment
- shadcn/ui components setup

### Semaines 3-4: Agent Architecture
- Base Agent class implementation
- Master Orchestrator API routes
- Decomposition Agent logic
- WebSocket real-time communication
- Basic prompt classification

### Semaines 5-6: Specialist Agents
- Frontend Agent (Next.js + React + TypeScript)
- Backend Agent (Next.js API Routes)
- Code generation avec templates
- File organization system
- Basic testing generation

### Semaines 7-8: Workflow UI
- Interactive dashboard
- Real-time progress tracking
- Code preview/download
- Error handling & recovery
- Basic project management

### Semaines 9-10: Integration & Polish
- End-to-end workflow testing
- Performance optimization
- Error handling refinement
- Documentation
- Demo preparation

---

## Migration Path vers Multi-Tenant

### Phase 1: Single User (MVP)
- Authentication locale
- SQLite database
- File system local
- Single Docker container

### Phase 2: Multi-User
- PostgreSQL migration
- User isolation
- Shared resources
- Basic collaboration

### Phase 3: Multi-Tenant
- Organization model
- Resource quotas
- Admin interfaces
- Billing integration

### Phase 4: Cloud Native
- Vercel deployment
- External database
- Cloud storage
- CDN integration

---

## Avantages de cette Architecture

### Pour le MVP
- **Développement rapide** avec Next.js conventions
- **Full-stack TypeScript** pour moins d'erreurs
- **Components prêts** avec shadcn/ui
- **Real-time built-in** avec WebSocket

### Pour l'Évolution
- **Vercel deployment** en un clic
- **Database migrations** automatiques avec Prisma
- **API Routes** scalables vers serverless
- **Multi-tenant ready** dès la conception

### Pour l'Équipe
- **Stack moderne** attirante pour développeurs
- **TypeScript** partout pour moins de bugs
- **Hot reload** pour développement rapide
- **Ecosystem riche** Next.js

Cette architecture nous donne un MVP solide tout en préparant l'évolution vers une plateforme multi-tenant robuste.
