export enum AgentType {
  MASTER_ORCHESTRATOR = 'MASTER_ORCHESTRATOR',
  DECOMPOSITION_AGENT = 'DECOMPOSITION_AGENT',
  FRONTEND_SPECIALIST = 'FRONTEND_SPECIALIST',
  BACKEND_SPECIALIST = 'BACKEND_SPECIALIST',
  DEVOPS_SPECIALIST = 'DEVOPS_SPECIALIST',
  DATABASE_SPECIALIST = 'DATABASE_SPECIALIST',
  TESTING_SPECIALIST = 'TESTING_SPECIALIST',
  CODE_REVIEWER = 'CODE_REVIEWER',
}

export enum TaskType {
  FRONTEND = 'FRONTEND',
  BACKEND = 'BACKEND',
  DATABASE = 'DATABASE',
  DEVOPS = 'DEVOPS',
  TESTING = 'TESTING',
  DOCUMENTATION = 'DOCUMENTATION',
  REVIEW = 'REVIEW',
}

export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  BLOCKED = 'BLOCKED',
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export interface AgentResult {
  success: boolean
  code?: string
  files?: GeneratedFile[]
  tests?: string
  documentation?: string
  error?: string
  metadata?: Record<string, any>
}

export interface GeneratedFile {
  filename: string
  path: string
  content: string
  language?: string
  framework?: string
}

export interface Task {
  id: string
  title: string
  description?: string
  type: TaskType
  status: TaskStatus
  priority: TaskPriority
  agentType?: AgentType
  prompt: string
  input?: Record<string, any>
  output?: AgentResult
  progress: number
  startedAt?: Date
  completedAt?: Date
  error?: string
  retryCount: number
  maxRetries: number
  userId: string
  projectId: string
  workflowId?: string
  createdAt: Date
  updatedAt: Date
}

export interface Workflow {
  id: string
  name: string
  description?: string
  status: 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'CANCELLED'
  originalPrompt: string
  classification: Record<string, any>
  totalTasks: number
  completedTasks: number
  failedTasks: number
  startedAt?: Date
  completedAt?: Date
  estimatedDuration?: number
  projectId: string
  tasks: Task[]
  createdAt: Date
  updatedAt: Date
}

export abstract class BaseAgent {
  abstract name: string
  abstract type: AgentType

  constructor(
    protected projectId: string,
    protected userId: string
  ) {}

  abstract execute(task: Task): Promise<AgentResult>

  protected async updateProgress(taskId: string, progress: number, status: string): Promise<void> {
    // Implementation will be added later for WebSocket updates
  }

  protected buildPrompt(task: Task, context: Record<string, any>): string {
    // Base prompt building logic
    return `Task: ${task.title}\n\nDescription: ${task.description}\n\nContext: ${JSON.stringify(context, null, 2)}\n\nInstructions: ${task.prompt}`
  }
}