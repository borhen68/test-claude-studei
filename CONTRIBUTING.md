# Contributing to Frametale

Thank you for your interest in contributing to Frametale! This document provides guidelines and standards for code contributions.

## Development Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/frametale.git
cd frametale

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Set up database
npm run db:push

# Start development server
npm run dev
```

## Code Standards

### TypeScript

- **Always use TypeScript:** No plain JavaScript files
- **Strict mode enabled:** Fix all type errors before committing
- **Type everything:** Avoid `any`, use proper types or `unknown`
- **Interfaces over types:** Use `interface` for object shapes

### Documentation

All functions must have JSDoc comments:

```typescript
/**
 * Brief description of what the function does
 * 
 * Longer explanation if needed, including:
 * - Algorithm details
 * - Performance considerations
 * - Side effects
 * 
 * @param paramName - Description of parameter
 * @returns Description of return value
 * @throws Error description if applicable
 * 
 * @example
 * const result = myFunction('input');
 * console.log(result); // Expected output
 */
export function myFunction(paramName: string): ReturnType {
  // Implementation
}
```

### File Organization

```
src/
├── app/                    # Next.js app directory (pages & API routes)
│   ├── api/               # API endpoints
│   │   └── [resource]/    # Group by resource
│   └── [page]/            # UI pages
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── [feature]/        # Feature-specific components
│   └── layout/           # Layout components
├── lib/                   # Business logic & utilities
│   ├── db/               # Database schemas & queries
│   ├── [service]/        # Service modules (auth, payments, etc.)
│   └── utils/            # Pure utility functions
└── types/                 # Shared TypeScript types
```

### Naming Conventions

- **Files:** `kebab-case.ts` (lowercase with hyphens)
- **Components:** `PascalCase.tsx`
- **Functions:** `camelCase`
- **Constants:** `SCREAMING_SNAKE_CASE`
- **Interfaces:** `PascalCase` (e.g., `ProcessedPhotoData`)
- **Types:** `PascalCase` (e.g., `TemplateType`)

### Error Handling

Always handle errors gracefully:

```typescript
// ✅ Good
try {
  const result = await riskyOperation();
  return result;
} catch (error) {
  console.error('Operation failed:', error);
  // Return fallback or rethrow with context
  throw new Error(`Failed to process: ${error instanceof Error ? error.message : 'Unknown error'}`);
}

// ❌ Bad
const result = await riskyOperation(); // Unhandled rejection
```

### Database Queries

- Use Drizzle ORM (never raw SQL)
- Always use parameterized queries
- Handle null cases explicitly
- Use transactions for multi-step operations

```typescript
// ✅ Good
const [book] = await db
  .select()
  .from(books)
  .where(eq(books.id, bookId))
  .limit(1);

if (!book) {
  throw new Error('Book not found');
}

// ❌ Bad
const book = await db.select().from(books).where(eq(books.id, bookId))[0];
// Assumes book exists without checking
```

## Testing Requirements

### All code changes must include tests

**Unit Tests** - For isolated functions:
```typescript
// tests/unit/my-feature.test.ts
import { describe, it, expect } from 'vitest';
import { myFunction } from '@/lib/my-feature';

describe('My Feature', () => {
  it('should handle valid input', () => {
    expect(myFunction('valid')).toBe('expected');
  });
  
  it('should handle edge cases', () => {
    expect(myFunction('')).toBe('default');
  });
});
```

**Integration Tests** - For workflows:
```typescript
// tests/integration/my-workflow.test.ts
import { describe, it, expect } from 'vitest';

describe('My Workflow', () => {
  it('should complete end-to-end', async () => {
    const result = await completeWorkflow();
    expect(result.success).toBe(true);
  });
});
```

### Running Tests

```bash
# Before committing
npm test

# Check coverage
npm run test:coverage

# Minimum coverage: 70%
# Target coverage: 80%
```

## Git Workflow

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(scope): Add new feature
fix(scope): Fix bug description
docs(scope): Update documentation
test(scope): Add tests
refactor(scope): Code refactoring
perf(scope): Performance improvement
chore(scope): Maintenance tasks
```

Examples:
```
feat(upload): Add batch photo upload with progress tracking
fix(quality): Correct sharpness scoring for portrait photos
docs(api): Add JSDoc comments to all API routes
test(layout): Add integration tests for page generation
```

### Branch Naming

- `feat/feature-name` - New features
- `fix/bug-description` - Bug fixes
- `docs/what-docs` - Documentation
- `test/test-description` - Test additions
- `refactor/what-refactor` - Code refactoring

### Pull Request Process

1. **Create feature branch** from `main`
2. **Write code** following standards above
3. **Add tests** with 70%+ coverage
4. **Update documentation** if needed
5. **Run full test suite** (`npm test`)
6. **Commit with conventional commits**
7. **Push and create PR** with description
8. **Request review** from maintainers
9. **Address feedback**
10. **Merge when approved**

## Security

### Never commit secrets

- No API keys in code
- Use `.env.local` for local secrets
- Add secrets to `.gitignore`
- Use environment variables for all credentials

### Input Validation

- Validate all user input with Zod
- Sanitize file names before storage
- Check file sizes and types
- Verify user permissions before operations

### SQL Injection Protection

- Always use Drizzle ORM
- Never concatenate SQL strings
- Use parameterized queries

## Performance

### Image Processing

- Always resize images before storage
- Generate thumbnails asynchronously
- Use Sharp for fast image manipulation
- Limit max file size (50MB recommended)

### Database

- Add indexes for frequently queried fields
- Use `limit()` on queries
- Avoid N+1 queries (use joins)
- Use transactions for bulk operations

### API Routes

- Implement rate limiting
- Cache expensive operations
- Return minimal data (don't over-fetch)
- Use pagination for large result sets

## Code Review Checklist

Before requesting review, ensure:

- [ ] All tests pass (`npm test`)
- [ ] Code follows style guidelines
- [ ] All functions have JSDoc comments
- [ ] No console.logs (use proper logging)
- [ ] Error handling is comprehensive
- [ ] No secrets committed
- [ ] Security best practices followed
- [ ] Performance considered
- [ ] Documentation updated

## Questions?

- Open an issue for bugs or feature requests
- Check existing documentation first
- Ask in pull request comments
- Email: support@frametale.com

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

