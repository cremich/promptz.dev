import 'server-only'
import { cache } from 'react'
import path from 'path'
import { 
  directoryExists, 
  getDirectories, 
  getFilesWithExtension 
} from './utils/file-parser'
import {
  extractPowerMetadata,
  extractAgentMetadata,
  extractPromptMetadata,
  extractSteeringMetadata,
  extractHookMetadata
} from './utils/metadata-extractor'
import type { Library, Power, Agent, Prompt, SteeringDocument, Hook } from './types/content'

const LIBRARIES_PATH = path.join(process.cwd(), 'libraries')

/**
 * Read and parse the Promptz community library
 */
export const readPromptzLibrary = cache(async (): Promise<Library> => {
  const libraryPath = path.join(LIBRARIES_PATH, 'promptz')
  const libraryName = 'promptz'
  
  if (!(await directoryExists(libraryPath))) {
    console.warn('Promptz library not found')
    return createEmptyLibrary(libraryName, libraryPath)
  }
  
  const [prompts, agents, powers, steering, hooks] = await Promise.all([
    readPrompts(libraryName, path.join(libraryPath, 'prompts')),
    readAgents(libraryName, path.join(libraryPath, 'agents')),
    readPowers(libraryName, path.join(libraryPath, 'powers')),
    readSteering(libraryName, path.join(libraryPath, 'steering')),
    readHooks(libraryName, path.join(libraryPath, 'hooks'))
  ])
  
  return {
    name: libraryName,
    path: libraryPath,
    prompts,
    agents,
    powers,
    steering,
    hooks
  }
})

/**
 * Read and parse the Kiro Powers library
 */
export const readKiroLibrary = cache(async (): Promise<Library> => {
  const libraryPath = path.join(LIBRARIES_PATH, 'kiro-powers')
  const libraryName = 'kiro-powers'
  
  if (!(await directoryExists(libraryPath))) {
    console.warn('Kiro Powers library not found')
    return createEmptyLibrary(libraryName, libraryPath)
  }
  
  // Kiro Powers library primarily contains powers
  const powers = await readPowers(libraryName, libraryPath)
  
  return {
    name: libraryName,
    path: libraryPath,
    prompts: [],
    agents: [],
    powers,
    steering: [],
    hooks: []
  }
})

/**
 * Read powers from a directory
 */
async function readPowers(libraryName: string, powersPath: string): Promise<Power[]> {
  if (!(await directoryExists(powersPath))) {
    return []
  }
  
  const powerDirs = await getDirectories(powersPath)
  const powers: Power[] = []
  
  for (const powerDir of powerDirs) {
    const powerPath = path.join(powersPath, powerDir)
    const power = await extractPowerMetadata(libraryName, powerDir, powerPath)
    
    if (power) {
      powers.push(power)
    }
  }
  
  return powers
}

/**
 * Read agents from a directory
 */
async function readAgents(libraryName: string, agentsPath: string): Promise<Agent[]> {
  if (!(await directoryExists(agentsPath))) {
    return []
  }
  
  const agentFiles = await getFilesWithExtension(agentsPath, '.md')
  const agents: Agent[] = []
  
  for (const agentFile of agentFiles) {
    const agentPath = path.join(agentsPath, agentFile)
    const agent = await extractAgentMetadata(libraryName, agentFile, agentPath)
    
    if (agent) {
      agents.push(agent)
    }
  }
  
  return agents
}

/**
 * Read prompts from a directory
 */
async function readPrompts(libraryName: string, promptsPath: string): Promise<Prompt[]> {
  if (!(await directoryExists(promptsPath))) {
    return []
  }
  
  const promptFiles = await getFilesWithExtension(promptsPath, '.md')
  const prompts: Prompt[] = []
  
  for (const promptFile of promptFiles) {
    const promptPath = path.join(promptsPath, promptFile)
    const prompt = await extractPromptMetadata(libraryName, promptFile, promptPath)
    
    if (prompt) {
      prompts.push(prompt)
    }
  }
  
  return prompts
}

/**
 * Read steering documents from a directory
 */
async function readSteering(libraryName: string, steeringPath: string): Promise<SteeringDocument[]> {
  if (!(await directoryExists(steeringPath))) {
    return []
  }
  
  const steeringFiles = await getFilesWithExtension(steeringPath, '.md')
  const steering: SteeringDocument[] = []
  
  for (const steeringFile of steeringFiles) {
    const filePath = path.join(steeringPath, steeringFile)
    const doc = await extractSteeringMetadata(libraryName, steeringFile, filePath)
    
    if (doc) {
      steering.push(doc)
    }
  }
  
  return steering
}

/**
 * Read hooks from a directory
 */
async function readHooks(libraryName: string, hooksPath: string): Promise<Hook[]> {
  if (!(await directoryExists(hooksPath))) {
    return []
  }
  
  const hookFiles = await getFilesWithExtension(hooksPath, '.kiro.hook')
  const hooks: Hook[] = []
  
  for (const hookFile of hookFiles) {
    const hookPath = path.join(hooksPath, hookFile)
    const hook = await extractHookMetadata(libraryName, hookFile, hookPath)
    
    if (hook) {
      hooks.push(hook)
    }
  }
  
  return hooks
}

/**
 * Create an empty library structure
 */
function createEmptyLibrary(name: string, path: string): Library {
  return {
    name,
    path,
    prompts: [],
    agents: [],
    powers: [],
    steering: [],
    hooks: []
  }
}