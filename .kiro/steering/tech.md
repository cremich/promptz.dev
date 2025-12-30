# Technology Stack

## Framework and Runtime

- **Next.js 16.1.1**: React framework with App Router architecture for server-side rendering and static generation
- **React 19.2.3**: UI library with latest concurrent features and server components
- **TypeScript 5**: Static type checking with strict configuration enabled
- **Node.js**: JavaScript runtime (version 18+ required for Next.js 16)

## Styling and UI

- **Tailwind CSS 4**: Utility-first CSS framework with PostCSS integration
- **Shadcn UI**: Component library for consistent, accessible UI components
- **Geist Font Family**: Modern font stack optimized for developer interfaces (Geist Sans & Geist Mono)
- **Dark Mode**: Primary theme with light mode alternative using CSS variables
- **Responsive Design**: Mobile-first approach with Tailwind breakpoint system
- **Lucide React**: Icon library for consistent iconography

## Development Tools

- **ESLint 9**: Code linting with Next.js and TypeScript configurations
- **Prettier 3.7.4**: Code formatting with lint-staged integration
- **PostCSS**: CSS processing with Tailwind CSS plugin
- **Husky 9.1.7**: Git hooks for code quality enforcement
- **lint-staged 16.2.7**: Run linters on staged files
- **Git Submodules**: Content library management for independent versioning

## Build System

- **Turbopack**: Next.js 16 default bundler for faster builds and Hot Module Replacement
- **TypeScript Compiler**: Strict type checking with path mapping support (@/ alias)
- **CSS Processing**: Tailwind CSS 4 compilation with PostCSS
- **ESM Configuration**: Modern JavaScript modules with .mjs config files

## Testing Framework

- **Jest 30.2.0**: JavaScript testing framework with Next.js integration
- **React Testing Library 16.3.1**: Component testing utilities
- **Jest DOM**: Custom matchers for DOM testing
- **jsdom**: Browser environment simulation for tests
- **Fast-check**: Property-based testing for AI-assisted validation
- **ts-node**: TypeScript execution for test configuration

## Content Management

- **Git Submodules**: External libraries managed as independent repositories
- **Content Service**: TypeScript-first service with React cache integration
- **Metadata Processing**: Multi-source extraction from YAML frontmatter, JSON configs, and git history
- **Git Integration**: Real-time repository analysis using simple-git library
- **File-based Routing**: Next.js App Router for automatic route generation
- **Type Safety**: Union types for cross-content operations and validation

## Content Service Dependencies

- **gray-matter 4.0.3**: YAML frontmatter parsing for markdown content
- **simple-git 3.30.0**: Git repository analysis and history extraction
- **server-only 0.0.1**: Ensures server-side only execution for content service

## UI Component Dependencies

- **@radix-ui/react-slot 1.2.4**: Primitive component composition
- **class-variance-authority 0.7.1**: Type-safe component variants
- **clsx 2.1.1**: Conditional className utility
- **tailwind-merge 3.4.0**: Tailwind class merging utility
- **tw-animate-css 1.4.0**: CSS animations for Tailwind

## Content Service Architecture

### Core Components
- **Content Service** (`lib/content-service.ts`): Main service with React cache integration
- **Type Definitions** (`lib/types/content.ts`): TypeScript interfaces and union types
- **File Parser** (`lib/utils/file-parser.ts`): File system utilities and parsing functions
- **Metadata Extractor** (`lib/utils/metadata-extractor.ts`): Content-specific extraction logic
- **Git Extractor** (`lib/utils/git-extractor.ts`): Git history analysis and information extraction
- **Date Formatter** (`lib/utils/date-formatter.ts`): Date formatting and comparison utilities

### Type-Specific Services
- **Prompts Service** (`lib/prompts.ts`): Prompts-specific operations with caching
- **Agents Service** (`lib/agents.ts`): Agents-specific operations with caching
- **Powers Service** (`lib/powers.ts`): Powers-specific operations with caching
- **Steering Service** (`lib/steering.ts`): Steering documents operations with caching
- **Hooks Service** (`lib/hooks.ts`): Hooks-specific operations with caching

### Key Features
- **Union Type System**: Type-safe operations across all content types
- **Intelligent Metadata Resolution**: Frontmatter → Git → Placeholders fallback strategy
- **Performance Optimization**: React cache for request-level memoization
- **Error Resilience**: Graceful handling of missing files and corrupted data
- **Git Integration**: Author attribution, commit history, and content lifecycle tracking
- **Content Validation**: Filtering of incomplete or invalid content

### Content Processing Flow
1. **Discovery**: Scan library directories for content
2. **Parsing**: Extract content from markdown, JSON, and YAML files
3. **Git Analysis**: Retrieve author, dates, and commit information
4. **Validation**: Filter incomplete or invalid content
5. **Caching**: Store processed content with React cache
6. **Serving**: Provide type-safe API for components

## Component Architecture

### UI Components (Shadcn UI)
- **Card Component** (`components/ui/card.tsx`): Base card with header, content, footer variants
- **Badge Component** (`components/ui/badge.tsx`): Status and category indicators
- **Skeleton Component** (`components/ui/skeleton.tsx`): Loading state placeholders

### Content Components
- **Grid Component** (`components/grid.tsx`): Responsive grid with type-safe rendering
- **Content Cards**: Type-specific cards (prompt-card, agent-card, power-card, steering-card, hook-card)
- **Skeleton States**: Loading placeholders for all content types

### Component Features
- **Type-safe Rendering**: Union type discrimination for content cards
- **Responsive Design**: Mobile-first with Tailwind breakpoints
- **Accessibility**: ARIA labels, semantic HTML, keyboard navigation
- **Dark Mode Support**: CSS variables and Tailwind dark mode utilities
- **Progressive Loading**: Suspense boundaries with skeleton states

## Common Commands

### Development
```bash
# Start development server with hot reload
npm run dev

# Alternative package managers
yarn dev
pnpm dev
bun dev
```

### Build and Deployment
```bash
# Build production bundle
npm run build

# Start production server
npm run start

# Run linting
npm run lint
```

### Testing
```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch
```

### Code Quality
```bash
# Prepare git hooks (run automatically after npm install)
npm run prepare

# Format code with Prettier (runs automatically on commit)
npx prettier --write .
```

### Git Submodule Management
```bash
# Initialize and update all submodules
git submodule update --init --recursive

# Update specific submodule to latest
git submodule update --remote libraries/kiro-powers

# Add new submodule
git submodule add <repository-url> libraries/<library-name>
```

### Content Service Testing
```bash
# Test content service functionality
npm run dev
# Navigate to http://localhost:3000/test-content

# Validate git integration
git submodule update --init --recursive
# Check git coverage and analytics in test interface
```

### Content Development
```bash
# Navigate to library for content editing
cd libraries/kiro-powers

# Create new power or content
mkdir new-power-name
cd new-power-name

# Commit changes in submodule
git add .
git commit -m "feat: add new power"
git push

# Update parent repository to reference new submodule commit
cd ../..
git add libraries/kiro-powers
git commit -m "feat: update kiro-powers library"
```

## Configuration Files

- **next.config.ts**: Next.js configuration with TypeScript support
- **tsconfig.json**: TypeScript compiler configuration with strict mode and path mapping
- **eslint.config.mjs**: ESLint configuration for Next.js and TypeScript with Prettier integration
- **postcss.config.mjs**: PostCSS configuration for Tailwind CSS processing
- **jest.config.ts**: Jest testing configuration with Next.js integration
- **jest.setup.ts**: Jest setup with React Testing Library
- **package.json**: Dependencies and scripts configuration
- **.gitmodules**: Git submodule configuration for content libraries

## Performance Considerations

- **Server Components**: Default rendering strategy for optimal performance
- **Client Components**: Used only when browser interactivity is required
- **Static Generation**: Leveraged for content that doesn't change frequently
- **React Cache**: Request-level memoization for content service operations
- **Git Repository Caching**: Efficient git instance management per repository
- **Content Validation**: Early filtering of invalid content to prevent processing overhead
- **Image Optimization**: Next.js Image component for automatic optimization
- **Bundle Optimization**: Turbopack for faster builds and smaller bundles
- **Suspense Boundaries**: Progressive loading with skeleton states

## Development Workflow

- **Hot Module Replacement**: Instant updates during development with Turbopack
- **TypeScript Integration**: Real-time type checking and IntelliSense with strict mode
- **ESLint Integration**: Automatic code quality checks with Prettier formatting
- **Git Workflow**: Submodule-based content management with independent versioning
- **Content Service**: Automatic metadata extraction and git integration
- **Error Handling**: Graceful degradation with comprehensive logging
- **Testing Interface**: `/test-content` route for validation and debugging
- **Pre-commit Hooks**: Automated code formatting and linting with Husky and lint-staged

## Library Ecosystem

### Git Submodules
- **kiro-powers**: Official Kiro powers library (git@github.com:kirodotdev/powers.git)
- **promptz**: Community prompts library (git@github.com:cremich/promptz.lib.git)

### Content Types Support
- **Powers**: POWER.md with MCP configuration and steering files
- **Prompts**: Markdown files with YAML frontmatter
- **Agents**: Agent.md with config.json configuration
- **Steering Documents**: Markdown files with category support
- **Hooks**: .kiro.hook files with trigger configuration

## Deployment Architecture

- **Static Assets**: Served from public/ directory with Next.js optimization
- **Server-Side Rendering**: App Router with React Server Components
- **Content Processing**: Build-time git analysis and metadata extraction
- **Caching Strategy**: React cache for request-level memoization
- **Error Boundaries**: Graceful degradation for missing or corrupted content
- **Performance Monitoring**: Core Web Vitals tracking and optimization