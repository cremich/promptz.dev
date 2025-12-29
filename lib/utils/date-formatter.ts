/**
 * Date formatting utilities for consistent date display across the application
 * Handles both git dates and frontmatter dates with graceful error handling
 */

/**
 * Default date format options for consistent display
 */
const DEFAULT_DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'short',
  day: 'numeric'
}

/**
 * Format a date string to a consistent, readable format
 * Handles both git dates (ISO strings) and frontmatter dates (various formats)
 * 
 * @param dateInput - Date string from git or frontmatter
 * @param options - Optional Intl.DateTimeFormatOptions for custom formatting
 * @returns Formatted date string or fallback for invalid dates
 */
export function formatDate(
  dateInput: string | undefined | null,
  options: Intl.DateTimeFormatOptions = DEFAULT_DATE_OPTIONS
): string {
  // Handle null, undefined, or empty strings
  if (!dateInput || typeof dateInput !== 'string' || dateInput.trim() === '') {
    return 'Unknown Date'
  }

  try {
    const date = new Date(dateInput)
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      console.warn(`Invalid date format: ${dateInput}`)
      return dateInput // Return original string if we can't parse it
    }

    return date.toLocaleDateString('en-US', options)
  } catch (error) {
    console.warn(`Error formatting date: ${dateInput}`, error)
    return dateInput // Return original string as fallback
  }
}

/**
 * Format a git date specifically (wrapper for consistency)
 * Git dates are typically ISO strings from git log
 * 
 * @param gitDate - Date string from git history
 * @returns Formatted date string
 */
export function formatGitDate(gitDate: string | undefined | null): string {
  return formatDate(gitDate)
}

/**
 * Format a frontmatter date specifically (wrapper for consistency)
 * Frontmatter dates can be in various formats depending on the author
 * 
 * @param frontmatterDate - Date string from YAML frontmatter
 * @returns Formatted date string
 */
export function formatFrontmatterDate(frontmatterDate: string | undefined | null): string {
  return formatDate(frontmatterDate)
}

/**
 * Get the most appropriate date from git info or frontmatter with consistent formatting
 * Prioritizes git creation date, falls back to frontmatter date
 * 
 * @param gitCreatedDate - Date from git history (creation date)
 * @param frontmatterDate - Date from YAML frontmatter
 * @returns Formatted date string using the best available source
 */
export function getFormattedDisplayDate(
  gitCreatedDate: string | undefined | null,
  frontmatterDate: string | undefined | null
): string {
  // Prefer git creation date if available
  if (gitCreatedDate) {
    return formatGitDate(gitCreatedDate)
  }
  
  // Fall back to frontmatter date
  if (frontmatterDate) {
    return formatFrontmatterDate(frontmatterDate)
  }
  
  // Final fallback
  return 'Unknown Date'
}

/**
 * Format date for sorting purposes (returns timestamp)
 * Used internally for date-based sorting operations
 * 
 * @param dateInput - Date string from any source
 * @returns Timestamp number for sorting, or 0 for invalid dates
 */
export function getDateTimestamp(dateInput: string | undefined | null): number {
  if (!dateInput || typeof dateInput !== 'string' || dateInput.trim() === '') {
    return 0
  }

  try {
    const date = new Date(dateInput)
    return isNaN(date.getTime()) ? 0 : date.getTime()
  } catch {
    return 0
  }
}

/**
 * Compare two dates for sorting (newest first)
 * Handles both git and frontmatter dates with proper fallbacks
 * 
 * @param dateA - First date string
 * @param dateB - Second date string
 * @returns Comparison result for Array.sort() (negative = A is newer)
 */
export function compareDatesNewestFirst(
  dateA: string | undefined | null,
  dateB: string | undefined | null
): number {
  const timestampA = getDateTimestamp(dateA)
  const timestampB = getDateTimestamp(dateB)
  
  // Newest first (descending order)
  return timestampB - timestampA
}

/**
 * Validate if a date string is parseable
 * Useful for validation before display
 * 
 * @param dateInput - Date string to validate
 * @returns True if the date can be parsed successfully
 */
export function isValidDate(dateInput: string | undefined | null): boolean {
  if (!dateInput || typeof dateInput !== 'string' || dateInput.trim() === '') {
    return false
  }

  try {
    const date = new Date(dateInput)
    return !isNaN(date.getTime())
  } catch {
    return false
  }
}