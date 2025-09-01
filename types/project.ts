export interface Project {
  id: string
  name: string
  description?: string
  userId: string
  settings?: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

export interface User {
  id: string
  email: string
  name?: string
  image?: string
  emailVerified?: Date
  createdAt: Date
  updatedAt: Date
}

export interface ProjectSettings {
  framework?: 'nextjs' | 'react' | 'vue' | 'angular'
  language?: 'typescript' | 'javascript'
  styling?: 'css' | 'scss' | 'styled-components' | 'emotion'
  testing?: 'jest' | 'vitest' | 'cypress' | 'playwright'
  database?: 'postgresql' | 'mysql' | 'sqlite' | 'mongodb'
  deployment?: 'vercel' | 'netlify' | 'docker' | 'aws'
  aiModel?: 'claude-3-opus' | 'claude-3-sonnet' | 'claude-3-haiku'
  maxRetries?: number
  defaultTimeout?: number
}