import { simpleGit, SimpleGit, LogResult } from 'simple-git'
import { cacheLife, cacheTag } from 'next/cache'
import path from 'path'

export interface GitFileInfo {
  author: string
  authorEmail: string
  createdDate: string
  lastModifiedDate: string
  commitHash: string
  commitMessage: string
}

/**
 * Cache for git instances per repository
 */
const gitInstances = new Map<string, SimpleGit>()

/**
 * Get or create a git instance for a repository
 */
function getGitInstance(repoPath: string): SimpleGit {
  if (!gitInstances.has(repoPath)) {
    gitInstances.set(repoPath, simpleGit(repoPath))
  }
  return gitInstances.get(repoPath)!
}

/**
 * Extract git information for a specific file
 */
export async function extractGitFileInfo(filePath: string): Promise<GitFileInfo | null> {
  'use cache'
  cacheLife('days') // Git history rarely changes, cache for 1 day
  cacheTag('git-file-info', `git-${filePath}`)
  
  try {
    // Find the git repository root for this file
    const repoPath = await findGitRoot(filePath)
    if (!repoPath) {
      console.warn(`No git repository found for file: ${filePath}`)
      return null
    }
    
    const git = getGitInstance(repoPath)
    
    // Get relative path from repo root
    const relativePath = path.relative(repoPath, filePath)
    
    // Get git log for this specific file
    const log: LogResult = await git.log({
      file: relativePath,
      maxCount: 100 // Get more history to find creation
    })
    
    if (!log.all || log.all.length === 0) {
      console.warn(`No git history found for file: ${relativePath}`)
      return null
    }
    
    // Most recent commit (last modified)
    const latestCommit = log.all[0]
    
    // Oldest commit (creation) - last in the array
    const oldestCommit = log.all[log.all.length - 1]
    
    return {
      author: latestCommit.author_name,
      authorEmail: latestCommit.author_email,
      createdDate: oldestCommit.date,
      lastModifiedDate: latestCommit.date,
      commitHash: latestCommit.hash,
      commitMessage: latestCommit.message
    }
  } catch (error) {
    console.warn(`Failed to extract git info for ${filePath}:`, error)
    return null
  }
}

/**
 * Find the git repository root for a given file path
 */
async function findGitRoot(filePath: string): Promise<string | null> {
  try {
    let currentPath = path.dirname(filePath)
    
    // Walk up the directory tree looking for .git
    while (currentPath !== path.dirname(currentPath)) {
      const git = simpleGit(currentPath)
      
      try {
        await git.status()
        return currentPath
      } catch {
        // Not a git repo, continue up
        currentPath = path.dirname(currentPath)
      }
    }
    
    return null
  } catch (error) {
    console.warn(`Error finding git root for ${filePath}:`, error)
    return null
  }
}

/**
 * Extract git information for a directory (useful for powers/agents)
 */
export async function extractGitDirectoryInfo(dirPath: string): Promise<GitFileInfo | null> {
  'use cache'
  cacheLife('days') // Git history rarely changes, cache for 1 day
  cacheTag('git-dir-info', `git-dir-${dirPath}`)
  
  try {
    const repoPath = await findGitRoot(dirPath)
    if (!repoPath) {
      return null
    }
    
    const git = getGitInstance(repoPath)
    const relativePath = path.relative(repoPath, dirPath)
    
    // Get commits that affected this directory
    const log: LogResult = await git.log({
      from: 'HEAD',
      maxCount: 100,
      // Use -- to specify path after other options
    })
    
    // Filter commits that touched files in this directory
    const relevantCommits = []
    
    for (const commit of log.all) {
      try {
        const files = await git.show([commit.hash, '--name-only', '--format='])
        const fileList = files.split('\n').filter(f => f.trim())
        
        if (fileList.some(file => file.startsWith(relativePath))) {
          relevantCommits.push(commit)
        }
      } catch {
        // Skip commits we can't analyze
        continue
      }
    }
    
    if (relevantCommits.length === 0) {
      return null
    }
    
    const latestCommit = relevantCommits[0]
    const oldestCommit = relevantCommits[relevantCommits.length - 1]
    
    return {
      author: latestCommit.author_name,
      authorEmail: latestCommit.author_email,
      createdDate: oldestCommit.date,
      lastModifiedDate: latestCommit.date,
      commitHash: latestCommit.hash,
      commitMessage: latestCommit.message
    }
  } catch (error) {
    console.warn(`Failed to extract git directory info for ${dirPath}:`, error)
    return null
  }
}

/**
 * Format git date to a readable string
 */
export function formatGitDate(gitDate: string): string {
  try {
    return new Date(gitDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch {
    return gitDate
  }
}

/**
 * Get short commit hash (first 7 characters)
 */
export function getShortHash(fullHash: string): string {
  return fullHash.substring(0, 7)
}