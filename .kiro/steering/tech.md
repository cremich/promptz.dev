# Technology Stack

## Framework and Runtime

- **Next.js 16.1.1**: React framework with App Router architecture for server-side rendering and static generation
- **React 19.2.3**: UI library with latest concurrent features and server components
- **TypeScript 5**: Static type checking with strict configuration enabled
- **Node.js**: JavaScript runtime (version 18+ required for Next.js 16)

## Styling and UI

- **Tailwind CSS 4**: Utility-first CSS framework with PostCSS integration
- **Geist Font Family**: Modern font stack optimized for developer interfaces
- **Dark Mode**: Primary theme with light mode alternative using CSS variables
- **Responsive Design**: Mobile-first approach with Tailwind breakpoint system

## Development Tools

- **ESLint**: Code linting with Next.js and TypeScript configurations
- **PostCSS**: CSS processing with Tailwind CSS plugin
- **Git Submodules**: Content library management for independent versioning

## Build System

- **Turbopack**: Next.js 16 default bundler for faster builds and Hot Module Replacement
- **TypeScript Compiler**: Strict type checking with path mapping support
- **CSS Processing**: Tailwind CSS compilation with PostCSS

## Content Management

- **Git Submodules**: External libraries managed as independent repositories
- **Markdown Processing**: Content rendering for prompts, steering docs, and documentation
- **File-based Routing**: Next.js App Router for automatic route generation

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

### Git Submodule Management
```bash
# Initialize and update all submodules
git submodule update --init --recursive

# Update specific submodule to latest
git submodule update --remote libraries/kiro-powers

# Add new submodule
git submodule add <repository-url> libraries/<library-name>
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
- **tsconfig.json**: TypeScript compiler configuration with strict mode
- **eslint.config.mjs**: ESLint configuration for Next.js and TypeScript
- **postcss.config.mjs**: PostCSS configuration for Tailwind CSS processing
- **package.json**: Dependencies and scripts configuration
- **.gitmodules**: Git submodule configuration for content libraries

## Performance Considerations

- **Server Components**: Default rendering strategy for optimal performance
- **Client Components**: Used only when browser interactivity is required
- **Static Generation**: Leveraged for content that doesn't change frequently
- **Image Optimization**: Next.js Image component for automatic optimization
- **Bundle Optimization**: Turbopack for faster builds and smaller bundles

## Development Workflow

- **Hot Module Replacement**: Instant updates during development
- **TypeScript Integration**: Real-time type checking and IntelliSense
- **ESLint Integration**: Automatic code quality checks
- **Git Workflow**: Submodule-based content management with independent versioning