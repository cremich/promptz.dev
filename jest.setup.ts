import '@testing-library/jest-dom'
import { TextEncoder, TextDecoder } from 'util'

// Mock Next.js cache functions for testing
jest.mock('next/cache', () => ({
  cacheLife: jest.fn(),
  cacheTag: jest.fn(),
  revalidateTag: jest.fn(),
  updateTag: jest.fn(),
}))

// Add TextEncoder/TextDecoder polyfills for Node.js environment
Object.assign(global, {
  TextDecoder,
  TextEncoder
});