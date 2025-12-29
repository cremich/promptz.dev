# Project Structure

## Root Directory Organization

```
promptz.dev/
├── app/                    # Next.js App Router pages and layouts
├── libraries/              # Git submodules for content libraries
├── public/                 # Static assets (images, icons, fonts)
├── .kiro/                  # Kiro configuration and steering files
├── .next/                  # Next.js build output (generated)
├── node_modules/           # Dependencies (generated)
└── configuration files     # Package.json, configs, etc.
```

## App Directory Structure

- **app/layout.tsx**: Root layout with global styles and font configuration
- **app/page.tsx**: Homepage component with main landing content
- **app/globals.css**: Global CSS with Tailwind imports and custom properties
- **app/favicon.ico**: Site favicon and branding assets

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
- **package.json**: Dependencies, scripts, and project metadata
- **next.config.ts**: Next.js configuration with TypeScript
- **tsconfig.json**: TypeScript compiler configuration with strict mode
- **eslint.config.mjs**: ESLint rules for Next.js and TypeScript
- **postcss.config.mjs**: PostCSS configuration for Tailwind CSS
- **.gitmodules**: Git submodule configuration for libraries
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

## Asset Organization

### Public Directory
- **Static assets**: Images, icons, fonts that need direct URL access
- **SEO assets**: Favicon, robots.txt, sitemap.xml
- **Brand assets**: Logos, marketing images

### App Directory Assets
- **Component-specific assets**: Co-located with components when possible
- **Global styles**: CSS files imported in layout.tsx
- **Font files**: Loaded via Next.js font optimization

## Build Output Structure

- **.next/**: Next.js build artifacts (automatically generated)
- **out/**: Static export output (when using static export)
- **dist/**: Alternative build output directory (if configured)

## Development Workflow Structure

### Local Development
1. **Root level**: Main application development
2. **Libraries**: Navigate to submodules for content editing
3. **Submodule workflow**: Independent git repositories with their own commit history

### Content Contribution
1. **Fork library**: Create fork of specific library repository
2. **Create content**: Add new prompts, powers, or agents
3. **Submit PR**: Contribute back to main library repository
4. **Update reference**: Parent repository updates submodule reference

## Deployment Structure

- **Static assets**: Served from public/ directory
- **API routes**: Server-side functionality (if added to app/api/)
- **Generated pages**: Static and server-rendered pages from app/ directory
- **Submodule content**: Included in build process for content rendering