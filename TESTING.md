# Testing Guide - Frametale

This guide explains how to run tests and interpret results for the Frametale photobook application.

## Quick Start

```bash
# Run all tests
npm test

# Run with coverage report
npm run test:coverage

# Run tests in watch mode (for development)
npm test -- --watch

# Run specific test file
npm test tests/unit/quality.test.ts
```

## Test Structure

```
tests/
├── setup.ts                    # Global test configuration
├── unit/                       # Unit tests for individual modules
│   ├── quality.test.ts         # Photo quality scoring
│   ├── colors.test.ts          # Color analysis & theme selection
│   └── layout.test.ts          # Book layout generation
└── integration/                # Integration tests for workflows
    └── upload-flow.test.ts     # End-to-end upload processing
```

## Test Coverage

### Unit Tests (14 tests)

**Photo Quality Analysis** (`tests/unit/quality.test.ts`)
- ✅ High-resolution image scoring
- ✅ Low-resolution image penalties
- ✅ EXIF presence bonus
- ✅ Score clamping (0-100 range)
- ✅ Minimum quality thresholds

**Color Analysis** (`tests/unit/colors.test.ts`)
- ✅ Warm theme detection (red/orange hues)
- ✅ Cool theme detection (blue hues)
- ✅ Black & white theme detection (grayscale)
- ✅ Vintage theme detection (mid-range hues)

**Layout Generation** (`tests/unit/layout.test.ts`)
- ✅ Error handling for empty photo arrays
- ✅ Cover page generation
- ✅ Multiple page generation
- ✅ Even page count enforcement
- ✅ Sequential page numbering

### Integration Tests (3 tests)

**Upload Flow** (`tests/integration/upload-flow.test.ts`)
- ✅ End-to-end photo processing pipeline
- ✅ Batch processing with progress tracking
- ✅ Orientation detection (portrait/landscape/square)

## Writing Tests

### Unit Test Example

```typescript
import { describe, it, expect } from 'vitest';
import { calculateQualityScore } from '@/lib/photo-analysis/quality';
import sharp from 'sharp';

describe('Photo Quality', () => {
  it('should score high-res images highly', async () => {
    const buffer = await sharp({
      create: { width: 4000, height: 3000, channels: 3, background: { r: 255, g: 0, b: 0 } }
    }).jpeg().toBuffer();
    
    const result = await calculateQualityScore(buffer, true);
    
    expect(result.score).toBeGreaterThan(70);
    expect(result.megapixels).toBeCloseTo(12, 1);
  });
});
```

### Integration Test Example

```typescript
import { describe, it, expect } from 'vitest';
import { processPhoto } from '@/lib/photo-analysis/processor';

describe('Photo Processing', () => {
  it('should process a photo end-to-end', async () => {
    const buffer = createTestImage();
    const analysis = await processPhoto(buffer);
    
    expect(analysis.qualityScore).toBeGreaterThan(0);
    expect(analysis.dominantColor).toMatch(/^#[0-9A-Fa-f]{6}$/);
  });
});
```

## Test Environment

- **Test Runner:** Vitest
- **UI Testing:** @testing-library/react
- **Assertions:** @testing-library/jest-dom
- **Environment:** jsdom (for React components)
- **Image Processing:** Sharp (for generating test images)

## Known Limitations

1. **Database Tests:** Current tests use in-memory data. Full database integration tests require PostgreSQL setup matching production schema.

2. **External API Tests:** Tests for Stripe, CloudPrinter, and Google Photos use mocks. Manual testing required for real API integration.

3. **File Upload Tests:** Upload API tests use generated images, not real photo files with EXIF data.

4. **Node-Vibrant Import:** Color extraction may show warnings in test environment due to ESM/CJS module resolution. Error handling gracefully falls back to default colors.

## Coverage Goals

- **Minimum:** 70% line coverage
- **Target:** 80% line coverage
- **Critical paths:** 100% coverage (upload, processing, checkout)

## CI/CD Integration

Add to `.github/workflows/test.yml`:

```yaml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test
      - run: npm run test:coverage
      - uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
```

## Debugging Tests

```bash
# Run with verbose output
npm test -- --reporter=verbose

# Run single test with debugging
npm test -- --no-coverage --reporter=verbose tests/unit/quality.test.ts

# Generate HTML coverage report
npm run test:coverage
# Open coverage/index.html in browser
```

## Test Data

Test images are generated programmatically using Sharp:

```typescript
const testImage = await sharp({
  create: {
    width: 2000,
    height: 1500,
    channels: 3,
    background: { r: 100, g: 150, b: 200 }
  }
}).jpeg().toBuffer();
```

For testing with real photos, place test images in `tests/fixtures/` and add them to `.gitignore`.

## Continuous Improvement

- Add tests for new features before merging
- Aim for at least 1 test per function
- Integration tests for all user-facing workflows
- Performance benchmarks for photo processing
- E2E tests with Playwright for full user journeys

## Support

For test failures or questions, see:
- [Vitest Documentation](https://vitest.dev/)
- [Testing Library Docs](https://testing-library.com/)
- Project TESTING_REPORT.md for latest test run results

