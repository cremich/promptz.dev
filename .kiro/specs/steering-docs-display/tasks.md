# Implementation Plan: Steering Docs Display

## Overview

This implementation plan creates the steering documents rendering feature by following the established patterns from the prompts functionality. The approach builds incrementally, starting with the core service layer, then components, and finally page integration. Each task builds on previous work to ensure a cohesive implementation.

## Tasks

- [ ] 1. Create steering service following prompts service pattern
  - Create `lib/steering.ts` with getAllSteering and getLatestSteering functions
  - Implement React cache for request-level memoization
  - Add error handling with empty array fallbacks
  - Use existing content service to fetch steering documents from all libraries
  - _Requirements: 6.1, 6.2, 6.4, 6.5, 7.1, 7.5_

- [ ]* 1.1 Write property test for steering service sorting
  - **Property 1: Steering document sorting consistency**
  - **Validates: Requirements 1.2, 1.3, 2.2, 2.3, 7.3**

- [ ]* 1.2 Write property test for latest steering limit behavior
  - **Property 2: Latest steering limit behavior**
  - **Validates: Requirements 1.2, 7.4**

- [ ]* 1.3 Write property test for library aggregation
  - **Property 3: Library aggregation completeness**
  - **Validates: Requirements 2.1, 7.2**

- [ ]* 1.4 Write unit tests for steering service error handling
  - Test empty data scenarios and error conditions
  - _Requirements: 6.4, 7.5_

- [ ] 2. Implement SteeringCard component
  - Create `components/steering-card.tsx` following PromptCard structure
  - Use shadcn Card component as base with header, content, and footer sections
  - Display title, ID, author, date, and git commit hash
  - Implement SteeringCardSkeleton for loading states
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ]* 2.1 Write property test for SteeringCard title display
  - **Property 4: SteeringCard title display**
  - **Validates: Requirements 3.2**

- [ ]* 2.2 Write property test for SteeringCard metadata display
  - **Property 5: SteeringCard metadata display**
  - **Validates: Requirements 3.3**

- [ ]* 2.3 Write property test for SteeringCard git information display
  - **Property 6: SteeringCard git information display**
  - **Validates: Requirements 3.4**

- [ ]* 2.4 Write property test for SteeringCard date display
  - **Property 7: SteeringCard date display**
  - **Validates: Requirements 3.5**

- [ ] 3. Implement badge functionality for SteeringCard
  - Add content type badge showing "steering" with outline variant
  - Add library source badge using existing badge utilities
  - Follow card-header badge arrangement pattern
  - Use getContentTypeBadgeVariant and getLibraryBadgeVariant functions
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [ ]* 3.1 Write property test for content type badge
  - **Property 8: SteeringCard content type badge**
  - **Validates: Requirements 4.1, 4.5**

- [ ]* 3.2 Write property test for library source badge
  - **Property 9: SteeringCard library source badge**
  - **Validates: Requirements 4.2**

- [ ]* 3.3 Write property test for badge utility consistency
  - **Property 10: Badge utility consistency**
  - **Validates: Requirements 4.3, 4.4**

- [ ] 4. Create SteeringGrid component
  - Create `components/steering-grid.tsx` following PromptsGrid pattern
  - Implement responsive CSS Grid layout with auto-fit columns
  - Add maxItems prop for limiting displayed items
  - Create SteeringGridSkeleton for loading states
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ]* 4.1 Write unit tests for SteeringGrid responsive behavior
  - Test grid layout structure and responsive breakpoints
  - _Requirements: 5.1, 5.3, 5.4_

- [ ]* 4.2 Write unit tests for SteeringGrid skeleton matching
  - Test skeleton structure matches actual component layout
  - _Requirements: 5.5_

- [ ] 5. Checkpoint - Ensure all component tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Add steering section to homepage
  - Update `app/page.tsx` to include "Latest Steering Documents" section
  - Add server component to fetch latest 6 steering documents
  - Implement Suspense boundary with loading fallback
  - Add "View all →" link to steering page
  - _Requirements: 1.1, 1.2, 1.4, 1.5_

- [ ]* 6.1 Write unit tests for homepage steering section
  - Test section presence and "View all" link
  - Test empty state handling
  - _Requirements: 1.1, 1.4, 1.5_

- [ ] 7. Create dedicated steering page
  - Create `app/steering/page.tsx` following prompts page pattern
  - Add proper SEO metadata and page title
  - Implement server component to fetch all steering documents
  - Add Suspense boundary with loading fallback
  - Handle empty state gracefully
  - _Requirements: 2.1, 2.4, 2.5_

- [ ]* 7.1 Write unit tests for steering page structure
  - Test page metadata and empty state handling
  - _Requirements: 2.4, 2.5_

- [ ]* 7.2 Write property test for git information preservation
  - **Property 11: Git information preservation**
  - **Validates: Requirements 6.3**

- [ ] 8. Integration and wiring
  - Ensure all components work together seamlessly
  - Verify Suspense boundaries function correctly
  - Test complete data flow from service to UI
  - Validate responsive behavior across screen sizes
  - _Requirements: 8.1, 8.2, 8.3, 8.5_

- [ ]* 8.1 Write integration tests for complete data flow
  - Test service to component rendering pipeline
  - Test Suspense boundary behavior
  - _Requirements: 8.1, 8.2, 8.5_

- [ ] 9. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- The implementation follows established patterns from the prompts feature for consistency