# Implementation Plan: Prompt Cards

## Overview

This implementation plan breaks down the prompt card rendering feature into discrete, manageable coding tasks. Each task builds incrementally on previous work, ensuring the feature can be developed step-by-step with validation at each stage.

## Tasks

- [x] 1. Create PromptCard component with shadcn integration
  - Create `components/prompt-card.tsx` using shadcn Card and Badge components
  - Implement proper TypeScript interfaces using existing types from `lib/types/content.ts`
  - Display prompt title, ID, type badge, and library source badge
  - Handle git information display with fallback to frontmatter data
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9_

- [ ]* 1.1 Write property test for PromptCard content display
  - **Property 6: PromptCard Content Display**
  - **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5**

- [ ]* 1.2 Write property test for git information display
  - **Property 7: Git Information Display**
  - **Validates: Requirements 3.6, 3.7, 3.8**

- [ ]* 1.3 Write property test for fallback information display
  - **Property 8: Fallback Information Display**
  - **Validates: Requirements 3.9**

- [x] 2. Create PromptsGrid component with responsive layout
  - Create `components/prompts-grid.tsx` with CSS Grid layout
  - Implement responsive breakpoints: mobile (1 col), tablet (2 col), desktop (3 col)
  - Handle empty state display when no prompts available
  - Ensure equal height cards using CSS Grid properties
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 1.4, 2.4_

- [ ]* 2.1 Write property test for responsive grid layout
  - **Property 4: Responsive Grid Layout**
  - **Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5**

- [ ]* 2.2 Write unit test for empty state handling
  - **Property 5: Empty State Handling**
  - **Validates: Requirements 1.4, 2.4**

- [x] 3. Implement data fetching utilities
  - Create `lib/prompts.ts` with functions to fetch and sort prompts
  - Implement `getLatestPrompts(limit?: number)` for homepage
  - Implement `getAllPrompts()` for prompts page
  - Use existing content service functions with proper error handling
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ]* 3.1 Write property test for content service integration
  - **Property 11: Content Service Integration**
  - **Validates: Requirements 5.1, 5.2, 5.5**

- [ ]* 3.2 Write property test for error handling resilience
  - **Property 12: Error Handling Resilience**
  - **Validates: Requirements 5.4**

- [x] 4. Update homepage to display latest 6 prompts
  - Modify `app/page.tsx` to fetch and display prompts using Server Components
  - Integrate PromptsGrid component with 6-prompt limit
  - Maintain existing homepage layout and styling
  - Add proper error boundaries for graceful error handling
  - _Requirements: 1.1, 1.2, 1.3, 1.5, 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ]* 4.1 Write property test for homepage prompt limiting
  - **Property 1: Homepage Prompt Limiting**
  - **Validates: Requirements 1.1, 1.5**

- [ ]* 4.2 Write property test for component consistency
  - **Property 3: Component Consistency**
  - **Validates: Requirements 1.2**

- [x] 5. Create dedicated prompts page
  - Create `app/prompts/page.tsx` as a Server Component
  - Display all prompts from all libraries using PromptsGrid
  - Implement proper sorting by creation date (newest first)
  - Add page metadata for SEO optimization
  - _Requirements: 2.1, 2.2, 2.3, 2.5, 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ]* 5.1 Write property test for complete prompt display
  - **Property 2: Complete Prompt Display**
  - **Validates: Requirements 2.1, 2.5**

- [ ]* 5.2 Write property test for server-side rendering
  - **Property 13: Server-Side Rendering**
  - **Validates: Requirements 8.1, 8.2, 8.3, 8.4**

- [x] 6. Implement badge styling and consistency
  - Create utility functions for badge variant selection
  - Ensure consistent styling across all prompt cards
  - Implement proper spacing and arrangement for multiple badges
  - Add library-specific badge colors if needed
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ]* 6.1 Write property test for badge styling consistency
  - **Property 9: Badge Styling Consistency**
  - **Validates: Requirements 6.3, 6.4, 6.5**

- [ ] 7. Add date formatting utilities
  - Create `lib/utils/date-formatter.ts` for consistent date display
  - Implement readable date formatting for both git and frontmatter dates
  - Ensure consistent formatting across all components
  - Handle edge cases like invalid dates gracefully
  - _Requirements: 7.2, 7.5_

- [ ]* 7.1 Write property test for date formatting consistency
  - **Property 10: Date Formatting Consistency**
  - **Validates: Requirements 7.2, 7.5**

- [ ] 8. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 9. Integration testing and final validation
  - Test homepage displays exactly 6 most recent prompts
  - Test prompts page displays all prompts from all libraries
  - Verify responsive behavior across different screen sizes
  - Validate error handling with missing git submodules
  - Test performance with large numbers of prompts
  - _Requirements: All requirements validation_

- [ ]* 9.1 Write integration tests for end-to-end functionality
  - Test complete user workflows from homepage to prompts page
  - Validate responsive grid behavior across breakpoints
  - Test error scenarios and recovery

- [ ] 10. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties using `@fast-check/jest`
- Unit tests validate specific examples and edge cases
- Server Components are used throughout for optimal performance and SEO
- All components use existing types from `lib/types/content.ts`
- Integration with existing content service maintains caching and error handling