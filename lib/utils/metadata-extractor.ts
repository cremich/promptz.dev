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
  frontmatterData: Record<string, unknown>,
  filePath: string,
  useDirectory = false
): Promise<{ author: string; date: string; git?: GitInfo }> {
  // Try frontmatter first - ensure they are strings
  let author = typeof frontmatterData.author === 'string' ? frontmatterData.author : undefined
  let date = typeof frontmatterData.date === 'string' ? frontmatterData.date : undefined
  
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
    const name = typeof data.name === 'string' ? data.name : undefined
    const description = typeof data.description === 'string' ? data.description : undefined
    
    if (!name || !description) {
      console.warn(`Power missing required metadata: ${powerDir}`)
      return null
    }
    
    // Get author and date with git fallback (use directory for powers)
    const { author, date, git } = await getAuthorAndDate(data, powerPath, true)
    
    const id = generatePathId(libraryName, 'powers', powerDir)
    const displayName = typeof data.displayName === 'string' ? data.displayName : name
    const keywords = Array.isArray(data.keywords) ? data.keywords : []
    
    return {
      type: 'power',
      id,
      title: displayName || generateTitleFromFilename(powerDir),
      author,
      date,
      path: powerPath,
      git,
      displayName,
      description,
      keywords,
      content: parsed.content,
      mcpConfig: (await parseJsonConfig(path.join(powerPath, 'mcp.json'))) || undefined,
      steeringFiles: [] // TODO: scan steering directory
    }
  } catch (error) {
    console.warn(`Failed to extract power metadata: ${powerDir}`, error)
    return null
  }
}

/**
 * Extract metadata from an Agent file pair (.md + .json)
 */
export async function extractAgentMetadata(
  libraryName: string,
  agentFile: string,
  agentPath: string
): Promise<Agent | null> {
  try {
    // Agent files are structured as: agent-name.md and agent-name.json
    const baseName = path.basename(agentFile, '.md')
    const agentDir = path.dirname(agentPath)
    const configPath = path.join(agentDir, `${baseName}.json`)
    
    const [content, config] = await Promise.all([
      safeFileRead(agentPath),
      parseJsonConfig(configPath)
    ])
    
    if (!content) return null
    
    const parsed = parseYamlFrontmatter(content)
    const { data } = parsed
    
    // Get author and date with git fallback (use file for agents)
    const { author, date, git } = await getAuthorAndDate(data, agentPath, false)
    
    const id = generatePathId(libraryName, 'agents', baseName)
    const title = typeof data.title === 'string' ? data.title : generateTitleFromFilename(baseName)
    
    // Get description from config.json if not in frontmatter
    let description = typeof data.description === 'string' ? data.description : undefined
    if (!description && config && typeof config.description === 'string') {
      description = config.description
    }
    description = description || 'AI Agent'
    
    return {
      type: 'agent',
      id,
      title,
      author,
      date,
      path: agentPath,
      git,
      description,
      config: config || {},
      content: parsed.content
    }
  } catch (error) {
    console.warn(`Failed to extract agent metadata: ${agentFile}`, error)
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
    const title = typeof data.title === 'string' ? data.title : generateTitleFromFilename(promptName)
    const category = typeof data.category === 'string' ? data.category : undefined
    
    return {
      type: 'prompt',
      id,
      title,
      author,
      date,
      path: promptPath,
      git,
      content: parsed.content,
      category
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
    const title = typeof data.title === 'string' ? data.title : generateTitleFromFilename(steeringName)
    const category = typeof data.category === 'string' ? data.category : undefined
    
    return {
      type: 'steering',
      id,
      title,
      author,
      date,
      path: steeringPath,
      git,
      content: parsed.content,
      category
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
    const title = typeof data.title === 'string' ? data.title : generateTitleFromFilename(hookName)
    const trigger = typeof data.trigger === 'string' ? data.trigger : undefined
    
    return {
      type: 'hook',
      id,
      title,
      author,
      date,
      path: hookPath,
      git,
      content: parsed.content,
      trigger
    }
  } catch (error) {
    console.warn(`Failed to extract hook metadata: ${hookFile}`, error)
    return null
  }
}