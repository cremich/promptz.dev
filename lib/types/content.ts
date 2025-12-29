// Content type definitions for the libraries

export interface GitInfo {
  author: string
  authorEmail: string
  createdDate: string
  lastModifiedDate: string
  commitHash: string
  commitMessage: string
}

export interface BaseContent {
  id: string
  title: string
  author: string
  date: string
  path: string
  git?: GitInfo
}

export interface Prompt extends BaseContent {
  type: 'prompt'
  content: string
  category?: string
}

export interface Agent extends BaseContent {
  type: 'agent'
  description: string
  config: AgentConfig
  content: string
}

export interface AgentConfig {
  mcpServers?: string[]
  tools?: string[]
  [key: string]: any
}

export interface Power extends BaseContent {
  type: 'power'
  displayName: string
  description: string
  keywords: string[]
  content: string
  mcpConfig?: any
  steeringFiles?: string[]
}

export interface SteeringDocument extends BaseContent {
  type: 'steering'
  content: string
  category?: string
}

export interface Hook extends BaseContent {
  type: 'hook'
  content: string
  trigger?: string
}

export interface Library {
  name: string
  path: string
  prompts: Prompt[]
  agents: Agent[]
  powers: Power[]
  steering: SteeringDocument[]
  hooks: Hook[]
}

export type ContentItem = Prompt | Agent | Power | SteeringDocument | Hook