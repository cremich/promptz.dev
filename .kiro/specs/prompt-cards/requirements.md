# Requirements Document

## Introduction

This document defines the requirements for implementing prompt card rendering functionality on the promptz.dev website. The feature will enable users to discover and browse AI development prompts through an intuitive card-based interface on both the homepage and a dedicated prompts page.

## Glossary

- **Prompt**: An AI instruction template stored as markdown files in the libraries with metadata
- **PromptCard**: A React component that displays prompt information in a card format
- **Content_Service**: The existing TypeScript service that fetches and processes content from git submodules
- **Library**: A git submodule containing organized content (promptz, kiro-powers)
- **Git_Info**: Metadata extracted from git history including author, dates, and commit information
- **Homepage**: The main landing page at the root URL (/)
- **Prompts_Page**: A dedicated page at /prompts displaying all available prompts

## Requirements

### Requirement 1: Homepage Prompt Display

**User Story:** As a visitor, I want to see the latest 6 prompts on the homepage, so that I can quickly discover recent AI development resources.

#### Acceptance Criteria

1. WHEN a user visits the homepage, THE System SHALL display the 6 most recently created prompts
2. WHEN prompts are displayed on the homepage, THE System SHALL render each prompt using the PromptCard component
3. WHEN prompts are arranged on the homepage, THE System SHALL organize them in a responsive grid layout
4. WHEN no prompts are available, THE System SHALL display an appropriate empty state message
5. WHEN prompts have git information, THE System SHALL sort by git creation date, otherwise by frontmatter date

### Requirement 2: Dedicated Prompts Page

**User Story:** As a developer, I want to browse all available prompts on a dedicated page, so that I can explore the complete collection of AI development resources.

#### Acceptance Criteria

1. WHEN a user navigates to /prompts, THE System SHALL display all available prompts from all libraries
2. WHEN prompts are displayed on the prompts page, THE System SHALL render each prompt using the PromptCard component
3. WHEN prompts are arranged on the prompts page, THE System SHALL organize them in a responsive grid layout
4. WHEN no prompts are available, THE System SHALL display an appropriate empty state message
5. WHEN prompts are loaded, THE System SHALL sort them by creation date (newest first)

### Requirement 3: PromptCard Component Implementation

**User Story:** As a user, I want each prompt to be displayed in a consistent card format, so that I can easily scan and compare different prompts.

#### Acceptance Criteria

1. THE PromptCard SHALL use the shadcn Card component as its foundation
2. WHEN displaying a prompt, THE PromptCard SHALL show the prompt title prominently
3. WHEN displaying a prompt, THE PromptCard SHALL show the prompt ID for reference
4. WHEN displaying a prompt, THE PromptCard SHALL include a badge indicating "prompt" type
5. WHEN displaying a prompt, THE PromptCard SHALL include a badge showing the library source name
6. WHEN git information is available, THE PromptCard SHALL display the git author name
7. WHEN git information is available, THE PromptCard SHALL display the git creation date
8. WHEN git information is available, THE PromptCard SHALL display the short commit hash
9. WHEN git information is not available, THE PromptCard SHALL display fallback author and date from frontmatter

### Requirement 4: Responsive Grid Layout

**User Story:** As a user on any device, I want the prompt cards to be displayed in an appropriate grid layout, so that I can browse prompts comfortably regardless of screen size.

#### Acceptance Criteria

1. WHEN viewed on mobile devices, THE System SHALL display prompt cards in a single column
2. WHEN viewed on tablet devices, THE System SHALL display prompt cards in a two-column grid
3. WHEN viewed on desktop devices, THE System SHALL display prompt cards in a three-column grid
4. WHEN the grid layout changes, THE System SHALL maintain consistent spacing between cards
5. WHEN cards are displayed, THE System SHALL ensure equal height for cards in the same row

### Requirement 5: Content Service Integration

**User Story:** As a system, I want to leverage the existing content service, so that prompt data is fetched efficiently with proper caching and error handling.

#### Acceptance Criteria

1. THE System SHALL use the existing readPromptzLibrary function to fetch promptz library prompts
2. THE System SHALL use the existing readKiroLibrary function to fetch kiro-powers library prompts
3. WHEN fetching prompts, THE System SHALL combine prompts from all available libraries
4. WHEN content service errors occur, THE System SHALL handle them gracefully without breaking the page
5. WHEN prompts are fetched, THE System SHALL utilize React cache for performance optimization

### Requirement 6: Badge Display Requirements

**User Story:** As a user, I want to quickly identify prompt sources and types through visual badges, so that I can understand the context and origin of each prompt.

#### Acceptance Criteria

1. WHEN displaying a prompt card, THE System SHALL show a "prompt" type badge with consistent styling
2. WHEN displaying a prompt card, THE System SHALL show a library source badge (e.g., "promptz", "kiro-powers")
3. WHEN rendering badges, THE System SHALL use the shadcn Badge component with appropriate variants
4. WHEN multiple badges are displayed, THE System SHALL arrange them in a visually clear manner
5. WHEN badges are rendered, THE System SHALL use consistent colors and styling across all cards

### Requirement 7: Git Information Display

**User Story:** As a developer, I want to see git metadata for each prompt, so that I can understand the authorship and recency of the content.

#### Acceptance Criteria

1. WHEN git information is available, THE System SHALL display the git author name
2. WHEN git information is available, THE System SHALL display the git creation date in a readable format
3. WHEN git information is available, THE System SHALL display the short commit hash (first 7 characters)
4. WHEN git information is not available, THE System SHALL display author and date from frontmatter metadata
5. WHEN displaying git information, THE System SHALL format dates consistently across all cards

### Requirement 8: Server-Side Rendering

**User Story:** As a user, I want prompt cards to load quickly with good SEO, so that I can access content immediately and search engines can index the prompts effectively.

#### Acceptance Criteria

1. THE System SHALL render prompt cards using Next.js Server Components
2. WHEN pages load, THE System SHALL fetch and render prompt data on the server
3. WHEN content is rendered, THE System SHALL provide proper HTML structure for SEO
4. WHEN server-side rendering occurs, THE System SHALL handle async data fetching appropriately
5. WHEN errors occur during server rendering, THE System SHALL provide fallback content