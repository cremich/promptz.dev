# Product Overview

## Core Purpose

Promptz.dev is a comprehensive library and community platform for AI-assisted development, serving as the central hub for developers using Kiro, Kiro CLI, and Amazon Q Developer. The platform enables creation, discovery, and sharing of AI development resources across the entire software development lifecycle.

## Primary Content Types

- **Prompts**: AI instructions for specific development tasks (code generation, testing, documentation, architecture)
- **Steering Documents**: Configuration files that ensure AI assistants consistently follow established patterns, libraries, and standards
- **Custom Agents**: Specialized AI assistants for specific workflows and development processes
- **Agent Hooks**: Automation tools that execute predefined agent actions when specific IDE events occur
- **Kiro Powers**: Packaged tools, workflows, and best practices that Kiro can activate on-demand

## Target Audience

- Developers using Kiro, Kiro CLI, and Amazon Q Developer for AI-assisted development
- Development teams establishing coding standards and AI workflows
- Contributors creating and sharing AI prompts and development patterns
- Organizations implementing AI-assisted development practices at scale

## Key Features

- **Git-based content management** through libraries added as git submodules
- **Intelligent content service** with TypeScript-first architecture and React caching
- **Rich metadata extraction** from YAML frontmatter, JSON configs, and git history
- **Real-time git integration** providing author attribution, commit history, and content lifecycle tracking
- **Type-safe content processing** using union types for cross-content operations
- **Efficient content discovery** across multiple libraries with advanced search and filtering
- **Community analytics** showing contributor activity, content evolution, and collaboration patterns
- **Graceful error handling** ensuring platform stability despite missing or corrupted content
- **Performance optimization** through request-level memoization and git repository caching
- **Modern UI/UX** with Shadcn UI components, Tailwind CSS, and responsive design
- **Server-side rendering** with Next.js App Router for optimal performance
- **Comprehensive testing** with Jest, React Testing Library, and property-based testing

## Content Organization Strategy

- **Libraries are managed as git submodules** for independent versioning and contribution
- **Each library focuses on specific domains** or use cases (official powers vs community content)
- **Content is organized by type** (prompts, steering, agents, hooks, powers) with consistent interfaces
- **Hierarchical structure enables easy discovery** and navigation through type-safe APIs
- **Metadata is intelligently extracted** from multiple sources with fallback strategies:
  - Primary: YAML frontmatter and JSON configuration files
  - Secondary: Git history for author attribution and dates
  - Fallback: Generated metadata with placeholder values
- **Community contributions are encouraged** through standardized formats and git-based workflows
- **Content validation and filtering** ensures only complete, valid content is displayed
- **Real-time analytics** provide insights into content evolution and contributor activity

## Platform Architecture

- **Next.js 16 App Router** for modern React architecture with server components
- **TypeScript-first development** with strict type checking and comprehensive interfaces
- **Shadcn UI component library** for consistent, accessible user interface
- **Tailwind CSS** for utility-first styling with dark mode support
- **React Server Components** for optimal performance and SEO
- **Suspense boundaries** for progressive loading and better user experience
- **Git submodule integration** for decentralized content management
- **Automated testing** with unit, integration, and property-based tests

## User Experience

- **Responsive design** optimized for desktop and mobile devices
- **Dark mode first** with light mode alternative
- **Progressive loading** with skeleton states and Suspense boundaries
- **Type-ahead search** and filtering across all content types
- **Detailed content pages** with metadata, git history, and related content
- **Contributor profiles** showing activity and contributions across libraries
- **Content analytics** displaying usage patterns and community engagement

## Success Metrics

- **Content Quality and Coverage**
  - Number of active contributors across libraries (tracked via git history)
  - Content completeness and metadata coverage percentages
  - Git integration coverage and data quality metrics
- **Platform Adoption and Usage**
  - Usage and adoption of shared prompts and steering documents
  - Integration success with Kiro ecosystem tools
  - API usage patterns and content discovery metrics
- **Community Engagement**
  - Quality and effectiveness of AI-assisted development workflows
  - Community engagement and collaboration levels
  - Contributor activity patterns and retention rates
  - Content evolution and update frequency
- **Technical Performance**
  - Content service response times and caching effectiveness
  - Error rates and graceful degradation success
  - Build and deployment success rates
  - Core Web Vitals scores and user experience metrics