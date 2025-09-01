import { AgentType, Task, AgentResult } from '@/types/agent'

export abstract class BaseAgent {
  abstract name: string
  abstract type: AgentType

  constructor(
    protected projectId: string,
    protected userId: string
  ) {}

  abstract execute(task: Task): Promise<AgentResult>

  protected async updateProgress(
    taskId: string,
    progress: number,
    status: string
  ): Promise<void> {
    // TODO: Implement WebSocket progress updates
    console.log(`Task ${taskId}: ${progress}% - ${status}`)
  }

  protected buildPrompt(task: Task, context: Record<string, any>): string {
    return `
Task: ${task.title}

Description: ${task.description || 'No description provided'}

Type: ${task.type}
Priority: ${task.priority}

Context:
${JSON.stringify(context, null, 2)}

Instructions:
${task.prompt}

Please provide a complete solution including:
1. Generated code
2. File organization
3. Any additional considerations
`.trim()
  }

  protected async callAI(prompt: string): Promise<string> {
    // TODO: Implement Anthropic SDK integration
    // For now, return a placeholder
    return 'AI response would go here'
  }
}