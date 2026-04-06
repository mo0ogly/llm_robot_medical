# E2E Testing with Playwright

End-to-end testing infrastructure for PoC Medical application using Playwright.

## Setup

Install dependencies:
```bash
npm install --save-dev @playwright/test @axe-core/playwright
npx playwright install
```

## Running Tests

From the frontend directory:

```bash
# Run all E2E tests (chromium only)
npm run test:e2e

# Run tests in headed mode (see browser)
npm run test:e2e:headed

# Debug mode with inspector
npm run test:e2e:debug

# Run all tests (unit + E2E)
npm run test:all
```

From the root directory:
```bash
npm run test:e2e
npm run test:e2e:headed
npm run test:e2e:debug
npm run test:all
```

## Test Suites

### 1. **PromptForge Tests** (`specs/promptforge.spec.ts`)
- Page load and rendering
- Provider selection
- Model list updates
- Form input handling
- Slider interactions
- Streaming output verification
- Accessibility compliance
- Page load time benchmarks

**Coverage**: 11 tests

### 2. **RedTeam Layout Navigation** (`specs/redteam-layout.spec.ts`)
- Layout initialization
- Tab navigation
- Route changes
- Lazy-loaded view loading
- Error handling
- Rapid navigation stability
- Loading state verification

**Coverage**: 12 tests

### 3. **Accessibility (WCAG 2.1 AA)** (`specs/accessibility.spec.ts`)
- Form label associations
- Aria-labels on inputs
- Slider aria-attributes
- Keyboard navigation
- Focus management
- Semantic HTML structure
- Color contrast
- Heading hierarchy
- Dynamic content announcements
- Decorative element hiding
- Language declaration

**Coverage**: 12 tests

### 4. **Performance Benchmarks** (`specs/performance.spec.ts`)
- Page load time (<3s)
- Navigation performance
- Form render time
- Time to interactive
- Lazy loading efficiency
- Streaming responsiveness
- Layout shift measurement
- First Contentful Paint
- Memory usage
- Rapid interaction handling

**Coverage**: 11 tests

## Utilities

### `helpers/test-utils.ts`
Common test utilities:
- `waitForElement()` - Wait for element visibility
- `fillFormInput()` - Fill and verify input
- `selectDropdownOption()` - Select from dropdown
- `isElementVisible()` - Check visibility
- `waitForText()` - Wait for text appearance
- `getStreamingOutput()` - Get streaming response
- `measurePageLoadTime()` - Measure load performance
- `measureTimeToInteractive()` - Measure TTI
- `checkAccessibility()` - Run axe-core accessibility check

## CI/CD Integration

Tests run automatically on:
- Push to `main` branch
- Pull requests with frontend changes
- Workflow dispatch (manual trigger)

Results are archived as artifacts for analysis.

## Configuration

`playwright.config.ts` settings:
- **Test directory**: `e2e/specs`
- **Base URL**: `http://localhost:5173`
- **Browsers**: Chromium, Firefox, WebKit
- **Mobile**: Pixel 5, iPhone 12
- **Retries**: 1 on CI, 0 locally
- **Screenshot**: On failure only
- **Video**: Retained on failure
- **Trace**: On first retry

## Expected Results

- **46+ tests** across all suites
- **<100ms flake rate** (tests pass consistently)
- **<3s page load** time
- **WCAG 2.1 AA** compliance verified
- **Zero layout shift** during load
- **Lazy views load** efficiently

## Troubleshooting

### Tests fail with "Cannot find browser"
```bash
npx playwright install
```

### Tests timeout on slow network
Increase timeout in `playwright.config.ts`:
```typescript
use: {
  navigationTimeout: 10000,
}
```

### Want to see browser during test run
```bash
npm run test:e2e:headed
```

### Debug a single test
```bash
npx playwright test specs/promptforge.spec.ts --debug
```

## Future Improvements

- [ ] Visual regression testing (snapshots)
- [ ] API mocking for consistent test data
- [ ] Mobile-specific test flows
- [ ] Performance profiling (Lighthouse)
- [ ] Custom test reporters with metrics
- [ ] Test data fixtures for more complex scenarios
