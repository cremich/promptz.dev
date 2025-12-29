# Requirements Document

## Introduction

This feature implements the rendering of steering documents as SteeringCard components on the promptz.dev website. Steering documents are configuration files that ensure AI assistants consistently follow established patterns, libraries, and standards. The feature will display the latest 6 steering files on the homepage and provide a dedicated page showing all steering files in a grid layout.

## Glossary

- **Steering_Document**: A markdown file with YAML frontmatter that provides guidance and configuration for AI assistants
- **SteeringCard**: A React component that displays steering document metadata in a card format using shadcn/ui components
- **Content_Service**: The existing TypeScript service that extracts metadata from content libraries using git integration
- **Library_Source**: The git submodule library where the steering document originates (promptz or kiro-powers)
- **Git_Information**: Author, creation date, last modified date, and commit hash extracted from git history
- **Homepage**: The main landing page at the root URL that displays latest content
- **Steering_Page**: A dedicated page at /steering that displays all steering documents

## Requirements

### Requirement 1: Homepage Steering Display

**User Story:** As a developer visiting the homepage, I want to see the latest 6 steering documents, so that I can quickly discover recent guidance and configuration files.

#### Acceptance Criteria

1. WHEN a user visits the homepage, THE System SHALL display a "Latest Steering Documents" section
2. WHEN the steering section loads, THE System SHALL show exactly 6 steering documents sorted by creation date (newest first)
3. WHEN git creation date is available, THE System SHALL use it for sorting, otherwise fall back to frontmatter date
4. WHEN no steering documents are available, THE System SHALL display an empty state gracefully
5. WHEN the steering section is displayed, THE System SHALL include a "View all →" link to the steering page

### Requirement 2: Dedicated Steering Page

**User Story:** As a developer, I want to browse all steering documents on a dedicated page, so that I can explore the complete collection of available guidance files.

#### Acceptance Criteria

1. WHEN a user visits /steering, THE System SHALL display all steering documents from all libraries
2. WHEN the steering page loads, THE System SHALL sort documents by creation date (newest first)
3. WHEN git creation date is available, THE System SHALL use it for sorting, otherwise fall back to frontmatter date
4. WHEN no steering documents are available, THE System SHALL display an appropriate empty state
5. WHEN the page loads, THE System SHALL include proper SEO metadata and page title

### Requirement 3: SteeringCard Component Implementation

**User Story:** As a developer viewing steering documents, I want each document displayed as a consistent card, so that I can easily scan and identify relevant guidance files.

#### Acceptance Criteria

1. WHEN a steering document is rendered, THE SteeringCard SHALL use the shadcn Card component as its base
2. WHEN displaying document information, THE SteeringCard SHALL show the document title in the card header
3. WHEN displaying metadata, THE SteeringCard SHALL show the document ID and author in the card content
4. WHEN git information is available, THE SteeringCard SHALL display the commit hash in the card footer
5. WHEN displaying the date, THE SteeringCard SHALL show creation date in the card footer

### Requirement 4: Badge Display Requirements

**User Story:** As a developer scanning steering documents, I want clear visual indicators of document type and source, so that I can quickly identify the origin and nature of each document.

#### Acceptance Criteria

1. WHEN a SteeringCard is displayed, THE System SHALL show a "steering" badge indicating the content type
2. WHEN a SteeringCard is displayed, THE System SHALL show a library source badge (promptz or kiro-powers)
3. WHEN displaying badges, THE System SHALL use the existing badge utility functions for consistent styling
4. WHEN arranging badges, THE System SHALL follow the card-header badge arrangement pattern
5. WHEN styling badges, THE System SHALL use the steering content type variant (outline)

### Requirement 5: Grid Layout Implementation

**User Story:** As a developer browsing steering documents, I want them organized in a responsive grid, so that I can efficiently scan multiple documents on different screen sizes.

#### Acceptance Criteria

1. WHEN steering documents are displayed, THE System SHALL organize them in a responsive grid layout
2. WHEN the grid is rendered, THE System SHALL follow the same pattern as the existing PromptsGrid component
3. WHEN on mobile devices, THE System SHALL display cards in a single column
4. WHEN on larger screens, THE System SHALL display multiple cards per row with appropriate spacing
5. WHEN loading, THE System SHALL display skeleton cards matching the expected layout

### Requirement 6: Content Service Integration

**User Story:** As a system, I want to retrieve steering documents through the existing content service, so that I maintain consistency with other content types and leverage git integration.

#### Acceptance Criteria

1. WHEN fetching steering documents, THE System SHALL use the existing content service architecture
2. WHEN retrieving documents, THE System SHALL extract metadata using the existing extractSteeringMetadata function
3. WHEN processing documents, THE System SHALL include git information when available
4. WHEN handling errors, THE System SHALL gracefully return empty arrays to prevent page crashes
5. WHEN caching results, THE System SHALL use React cache for request-level memoization

### Requirement 7: Steering Service Implementation

**User Story:** As a developer, I want a dedicated service for steering document operations, so that steering functionality follows the same patterns as other content types.

#### Acceptance Criteria

1. WHEN implementing steering operations, THE System SHALL create a steering service following the prompts service pattern
2. WHEN fetching all steering documents, THE System SHALL combine documents from all available libraries
3. WHEN sorting documents, THE System SHALL use creation date with newest first ordering
4. WHEN providing latest documents, THE System SHALL support optional limit parameter
5. WHEN handling errors, THE System SHALL log errors and return empty arrays gracefully

### Requirement 8: Loading States and Suspense

**User Story:** As a developer waiting for steering documents to load, I want appropriate loading indicators, so that I understand the system is working and content is being fetched.

#### Acceptance Criteria

1. WHEN steering documents are loading, THE System SHALL display skeleton cards matching the expected layout
2. WHEN using Suspense boundaries, THE System SHALL provide appropriate fallback components
3. WHEN displaying skeletons, THE System SHALL match the structure and spacing of actual SteeringCard components
4. WHEN loading completes, THE System SHALL smoothly transition from skeleton to actual content
5. WHEN errors occur during loading, THE System SHALL handle them gracefully without breaking the page layout