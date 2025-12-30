# Project Structure

## Root Directory Organization

```
promptz.dev/
├── app/                    # Next.js App Router pages and layouts
│   ├── agents/             # Custom agents listing page
│   ├── hooks/              # Agent hooks listing page
│   ├── powers/             # Kiro powers listing page
│   ├── prompts/            # Prompts listing page
│   ├── steering/           # Steering documents listing page
│   ├── test-content/       # Content service testing interface
│   ├── layout.tsx          # Root layout with fonts and metadata
│   ├── page.tsx            # Homepage with latest content sections
│   ├── globals.css         # Global styles with Tailwind imports
│   └── favicon.ico         # Site favicon
├── components/             # React components
│   ├── ui/                 # Shadcn UI components
│   ├── *-card.tsx          # Content type-specific card components
│   └── grid.tsx            # Responsive grid with skeleton states
├── lib/                    # Content service and utilities
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions and parsers
│   ├── content-service.ts  # Main content service with caching
│   ├── prompts.ts          # Prompts-specific service functions
│   ├── agents.ts           # Agents-specific service functions
│   ├── powers.ts           # Powers-specific service functions
│   ├── steering.ts         # Steering-specific service functions
│   └── hooks.ts            # Hooks-specific service functions
├── libraries/              # Git submodules for content libraries
│   ├── kiro-powers/        # Official Kiro powers library
│   └── promptz/            # Community prompts and resources
├── __tests__/              # Test suites
│   ├── unit/               # Unit tests for components and utilities
│   └── property/           # Property-based tests (ephemeral)
├── public/                 # Static assets (images, icons, fonts)
├── .kiro/                  # Kiro configuration and steering files
├── .next/                  # Next.js build output (generated)
├── node_modules/           # Dependencies (generated)
└── configuration files     # Package.json, configs, etc.
```

## Content Service Architecture

### lib/ Directory Structure
- **lib/types/content.ts**: TypeScript interfaces for all content types with union types
- **lib/utils/file-parser.ts**: File system utilities and parsing functions
- **lib/utils/metadata-extractor.ts**: Content-specific metadata extraction logic
- **lib/utils/git-extractor.ts**: Git history analysis and information extraction
- **lib/utils/date-formatter.ts**: Date formatting and comparison utilities
- **lib/content-service.ts**: Main service with React cache integration
- **lib/{type}.ts**: Type-specific service functions (prompts.ts, agents.ts, etc.)

### Content Service Features
- **Type-safe content processing**: Union types enable cross-content operations
- **Intelligent metadata extraction**: Multi-source fallback strategy (frontmatter → git → placeholders)
- **Git integration**: Real author attribution, commit history, and content lifecycle tracking
- **Performance optimization**: React cache for request-level memoization
- **Error resilience**: Graceful handling of missing files and corrupted data
- **Content validation**: Filtering of incomplete or invalid content

### Content Type System
```typescript
// Union type for type-safe operations across all content
type ContentItem = Prompt | Agent | Power | SteeringDocument | Hook

// Base interface with git integration
interface BaseContent {
  id: string           // Path-based ID generation
  title: string        // From frontmatter or filename
  author: string       // From frontmatter or git history
  date: string         // From frontmatter or git commits
  path: string         // File system path
  git?: GitInfo        // Optional git metadata
}
```

## App Directory Structure (Next.js 16 App Router)

### Core Pages
- **app/layout.tsx**: Root layout with Geist fonts, global styles, and metadata
- **app/page.tsx**: Homepage with server components and Suspense boundaries
- **app/globals.css**: Global CSS with Tailwind imports and custom properties
- **app/favicon.ico**: Site favicon and branding assets

### Content Type Pages
- **app/prompts/page.tsx**: Prompts listing with server-side data fetching
- **app/agents/page.tsx**: Custom agents listing with metadata display
- **app/powers/page.tsx**: Kiro powers listing with MCP configuration info
- **app/steering/page.tsx**: Steering documents listing with category filtering
- **app/hooks/page.tsx**: Agent hooks listing with trigger information

### Testing Interface
- **app/test-content/**: Content service testing and validation interface
- **app/test-content/components/**: Test-specific components for debugging

## Components Architecture

### UI Components (Shadcn UI)
- **components/ui/card.tsx**: Base card component with variants
- **components/ui/badge.tsx**: Badge component for tags and categories
- **components/ui/skeleton.tsx**: Loading skeleton components

### Content Components
- **components/grid.tsx**: Responsive grid with type-safe rendering and skeleton states
- **components/prompt-card.tsx**: Prompt display card with metadata
- **components/agent-card.tsx**: Agent card with configuration preview
- **components/power-card.tsx**: Power card with keywords and MCP info
- **components/steering-card.tsx**: Steering document card with category
- **components/hook-card.tsx**: Hook card with trigger information

### Component Features
- **Type-safe rendering**: Union type discrimination for content cards
- **Skeleton states**: Loading placeholders for all content types
- **Responsive design**: Mobile-first with Tailwind breakpoints
- **Accessibility**: ARIA labels, semantic HTML, keyboard navigation
- **Dark mode support**: CSS variables and Tailwind dark mode utilities

## Libraries Directory (Git Submodules)

### kiro-powers/
Collection of Kiro powers for enhanced AI agent capabilities:
- **Individual power directories**: Each power has its own folder with POWER.md, mcp.json, and steering files
- **Power structure**: POWER.md (documentation), mcp.json (MCP server configuration), steering/ (guidance files)
- **Examples**: stripe/, aws-infrastructure-as-code/, terraform/, datadog/

### promptz/
Community-driven library for AI development resources:
- **agents/**: Custom agent configurations with config.json and agent.md files
- **hooks/**: Agent hooks for IDE automation (.kiro.hook files)
- **powers/**: Additional power definitions and configurations
- **prompts/**: AI instruction templates for development tasks
- **steering/**: Shared steering documents for development standards

## Configuration Files Location

### Root Level
- **package.json**: Dependencies, scripts, and project metadata with Next.js 16 and React 19
- **next.config.ts**: Next.js configuration with TypeScript
- **tsconfig.json**: TypeScript compiler configuration with strict mode and path mapping
- **eslint.config.mjs**: ESLint rules for Next.js and TypeScript with Prettier integration
- **postcss.config.mjs**: PostCSS configuration for Tailwind CSS processing
- **jest.config.ts**: Jest testing configuration with Next.js integration
- **jest.setup.ts**: Jest setup with React Testing Library
- **.gitmodules**: Git submodule configuration for content libraries
- **.gitignore**: Git ignore patterns for build artifacts and dependencies

### Kiro Configuration
- **.kiro/steering/**: Project-specific steering documents
- **.kiro/settings/**: Kiro IDE settings and MCP configurations (when present)

## Content Organization Patterns

### Power Structure
```
power-name/
├── POWER.md              # Main documentation with frontmatter metadata
├── mcp.json              # MCP server configuration
└── steering/             # Optional guidance documents
    ├── getting-started.md
    ├── best-practices.md
    └── troubleshooting.md
```

### Agent Structure
```
agent-name/
├── agent.md              # Agent prompt and instructions
└── config.json           # Agent configuration with MCP servers and tools
```

### Prompt Structure
```
prompts/
├── prompt-name.md        # Individual prompt files
└── category/             # Organized by category or domain
    └── specific-prompt.md
```

## File Naming Conventions

- **Directories**: Use kebab-case for all directory names (user-profile, auth-forms)
- **Components**: Use kebab-case for file names, PascalCase for component names
- **Configuration**: Use standard names (package.json, next.config.ts, tsconfig.json)
- **Content**: Use kebab-case with descriptive names (getting-started.md, api-testing.md)
- **Extensions**: .tsx for React components, .ts for utilities, .md for documentation

## Import Path Configuration

- **@/**: Root directory alias configured in tsconfig.json
- **Relative imports**: Preferred for local files within same feature
- **Absolute imports**: Used for shared utilities and components

## Testing Structure

### Test Organization
- **__tests__/unit/**: Unit tests mirroring source structure
- **__tests__/property/**: Property-based tests (ephemeral, not committed)
- **Jest configuration**: Next.js integration with jsdom environment
- **Testing utilities**: React Testing Library with custom matchers

### Test Patterns
- **Component testing**: Render testing with user interactions
- **Service testing**: Content service with mocked file system
- **Integration testing**: Full content processing workflows
- **Property testing**: AI-assisted validation during development

## Asset Organization

### Public Directory
- **Static assets**: Images, icons, fonts that need direct URL access
- **SEO assets**: Favicon, robots.txt, sitemap.xml
- **Brand assets**: Logos, marketing images

### App Directory Assets
- **Component-specific assets**: Co-located with components when possible
- **Global styles**: CSS files imported in layout.tsx
- **Font files**: Loaded via Next.js font optimization (Geist Sans/Mono)

## Build Output Structure

- **.next/**: Next.js build artifacts (automatically generated)
- **out/**: Static export output (when using static export)
- **dist/**: Alternative build output directory (if configured)

## Development Workflow Structure

### Local Development
1. **Root level**: Main application development with content service integration
2. **Libraries**: Navigate to submodules for content editing
3. **Submodule workflow**: Independent git repositories with their own commit history
4. **Content service testing**: Use `/test-content` route for validation and debugging

### Content Service Development
1. **Type definitions**: Start with `lib/types/content.ts` for new content types
2. **Metadata extraction**: Add extractors in `lib/utils/metadata-extractor.ts`
3. **Service integration**: Update `lib/content-service.ts` for new content sources
4. **Type-specific services**: Create dedicated service files (e.g., `lib/prompts.ts`)
5. **Testing**: Validate with test components and git integration showcase

### Content Contribution
1. **Fork library**: Create fork of specific library repository
2. **Create content**: Add new prompts, powers, or agents with proper frontmatter
3. **Git workflow**: Commit with descriptive messages for proper attribution
4. **Submit PR**: Contribute back to main library repository
5. **Update reference**: Parent repository updates submodule reference
6. **Validation**: Content service automatically extracts git metadata and validates structure

## Deployment Structure

- **Static assets**: Served from public/ directory
- **API routes**: Server-side functionality (if added to app/api/)
- **Generated pages**: Static and server-rendered pages from app/ directory
- **Submodule content**: Included in build process for content rendering
- **Content service**: Server-side rendering with React cache optimization
- **Git integration**: Repository analysis during build time for metadata extraction

## Testing and Validation

### Content Service Testing
- **Test route**: `/test-content` provides comprehensive content service validation
- **Git showcase**: Demonstrates git integration features and analytics
- **Union type examples**: Shows type-safe content processing patterns
- **Error handling**: Validates graceful degradation with missing content

### Content Validation
- **Metadata completeness**: Checks for required fields and fallback strategies
- **Git integration**: Validates author attribution and commit history extraction
- **Type safety**: Ensures all content types conform to TypeScript interfaces
- **Performance**: Monitors caching effectiveness and response times