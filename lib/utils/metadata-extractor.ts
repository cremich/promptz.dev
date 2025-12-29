import path from 'path'
import { 
  safeFileRead, 
  parseYamlFrontmatter, 
  parseJsonConfig, 
  generateTitleFromFilename,
  generatePathId 
} from './file-parser'
import { 
  extractGitFileInfo, 
  extractGitDirectoryInfo, 
  formatGitDate 
} from './git-extractor'
import type { Power, Agent, Prompt, SteeringDocument, Hook, GitInfo } from '../types/content'

const PLACEHOLDER_AUTHOR = 'Unknown Author'
const PLACEHOLDER_DATE = 'Unknown Date'

/**
 * Get author and date with git fallback
 */
async function getAuthorAndDate(
  frontmatterData: Record<string, any>,
  filePath: string,
  useDirectory = false
): Promise<{ author: string; date: string; git?: GitInfo }> {
  // Try frontmatter first
  let author = frontmatterData.author
  let date = frontmatterData.date
  
  // Extract git information
  const gitInfo = useDirectory 
    ? await extractGitDirectoryInfo(filePath)
    : await extractGitFileInfo(filePath)
  
  // Use git info as fallback or primary source
  if (gitInfo) {
    if (!author) {
      author = gitInfo.author
    }
    if (!date) {
      date = formatGitDate(gitInfo.lastModifiedDate)
    }
    
    return {
      author: author || PLACEHOLDER_AUTHOR,
      date: date || PLACEHOLDER_DATE,
      git: gitInfo
    }
  }
  
  return {
    author: author || PLACEHOLDER_AUTHOR,
    date: date || PLACEHOLDER_DATE
  }
}

/**
 * Extract metadata from a Power directory (POWER.md with YAML frontmatter)
 */
export async function extractPowerMetadata(
  libraryName: string,
  powerDir: string,
  powerPath: string
): Promise<Power | null> {
  try {
    const powerMdPath = path.join(powerPath, 'POWER.md')
    const content = await safeFileRead(powerMdPath)
    
    if (!content) return null
    
    const parsed = parseYamlFrontmatter(content)
    const { data } = parsed
    
    // Validate required fields
    if (!data.name || !data.description) {
      console.warn(`Power missing required metadata: ${powerDir}`)
      return null
    }
    
    // Get author and date with git fallback (use directory for powers)
    const { author, date, git } = await getAuthorAndDate(data, powerPath, true)
    
    const id = generatePathId(libraryName, 'powers', powerDir)
    
    return {
      type: 'power',
      id,
      title: data.displayName || data.name || generateTitleFromFilename(powerDir),
      author,
      date,
      path: powerPath,
      git,
      displayName: data.displayName || data.name,
      description: data.description,
      keywords: Array.isArray(data.keywords) ? data.keywords : [],
      content: parsed.content,
      mcpConfig: await parseJsonConfig(path.join(powerPath, 'mcp.json')),
      steeringFiles: [] // TODO: scan steering directory
    }
  } catch (error) {
    console.warn(`Failed to extract power metadata: ${powerDir}`, error)
    return null
  }
}

/**
 * Extract metadata from an Agent directory (agent.md + config.json)
 */
export async function extractAgentMetadata(
  libraryName: string,
  agentDir: string,
  agentPath: string
): Promise<Agent | null> {
  try {
    const agentMdPath = path.join(agentPath, 'agent.md')
    const configPath = path.join(agentPath, 'config.json')
    
    const [content, config] = await Promise.all([
      safeFileRead(agentMdPath),
      parseJsonConfig(configPath)
    ])
    
    if (!content) return null
    
    const parsed = parseYamlFrontmatter(content)
    const { data } = parsed
    
    // Get author and date with git fallback (use directory for agents)
    const { author, date, git } = await getAuthorAndDate(data, agentPath, true)
    
    const id = generatePathId(libraryName, 'agents', agentDir)
    
    return {
      type: 'agent',
      id,
      title: data.title || generateTitleFromFilename(agentDir),
      author,
      date,
      path: agentPath,
      git,
      description: data.description || 'AI Agent',
      config: config || {},
      content: parsed.content
    }
  } catch (error) {
    console.warn(`Failed to extract agent metadata: ${agentDir}`, error)
    return null
  }
}

/**
 * Extract metadata from a Prompt file (.md)
 */
export async function extractPromptMetadata(
  libraryName: string,
  promptFile: string,
  promptPath: string
): Promise<Prompt | null> {
  try {
    const content = await safeFileRead(promptPath)
    if (!content) return null
    
    const parsed = parseYamlFrontmatter(content)
    const { data } = parsed
    
    // Get author and date with git fallback (use file for prompts)
    const { author, date, git } = await getAuthorAndDate(data, promptPath, false)
    
    const promptName = path.basename(promptFile, '.md')
    const id = generatePathId(libraryName, 'prompts', promptName)
    
    return {
      type: 'prompt',
      id,
      title: data.title || generateTitleFromFilename(promptName),
      author,
      date,
      path: promptPath,
      git,
      content: parsed.content,
      category: data.category
    }
  } catch (error) {
    console.warn(`Failed to extract prompt metadata: ${promptFile}`, error)
    return null
  }
}

/**
 * Extract metadata from a Steering document (.md)
 */
export async function extractSteeringMetadata(
  libraryName: string,
  steeringFile: string,
  steeringPath: string
): Promise<SteeringDocument | null> {
  try {
    const content = await safeFileRead(steeringPath)
    if (!content) return null
    
    const parsed = parseYamlFrontmatter(content)
    const { data } = parsed
    
    // Get author and date with git fallback (use file for steering docs)
    const { author, date, git } = await getAuthorAndDate(data, steeringPath, false)
    
    const steeringName = path.basename(steeringFile, '.md')
    const id = generatePathId(libraryName, 'steering', steeringName)
    
    return {
      type: 'steering',
      id,
      title: data.title || generateTitleFromFilename(steeringName),
      author,
      date,
      path: steeringPath,
      git,
      content: parsed.content,
      category: data.category
    }
  } catch (error) {
    console.warn(`Failed to extract steering metadata: ${steeringFile}`, error)
    return null
  }
}

/**
 * Extract metadata from a Hook file (.kiro.hook)
 */
export async function extractHookMetadata(
  libraryName: string,
  hookFile: string,
  hookPath: string
): Promise<Hook | null> {
  try {
    const content = await safeFileRead(hookPath)
    if (!content) return null
    
    const parsed = parseYamlFrontmatter(content)
    const { data } = parsed
    
    // Get author and date with git fallback (use file for hooks)
    const { author, date, git } = await getAuthorAndDate(data, hookPath, false)
    
    const hookName = path.basename(hookFile, '.kiro.hook')
    const id = generatePathId(libraryName, 'hooks', hookName)
    
    return {
      type: 'hook',
      id,
      title: data.title || generateTitleFromFilename(hookName),
      author,
      date,
      path: hookPath,
      git,
      content: parsed.content,
      trigger: data.trigger
    }
  } catch (error) {
    console.warn(`Failed to extract hook metadata: ${hookFile}`, error)
    return null
  }
}