# SauceDemo Automation

Playwright test framework for SauceDemo e-commerce site.

## Setup

```bash
npm install
npx playwright install chromium
```

### Environment Variables
The `.env` file should contain:
- Base URL
- User credentials
- Test configuration


## Run Tests

```bash
npm test                    # headless
npm run test:headed         # with browser
npm run test:debug          # debug mode
```

## Structure

```
pages/
  ├── BasePage.js           # common methods
  ├── LoginPage.js          # login stuff
  └── ProductsPage.js       # products/cart stuff

tests/
  ├── login/
  │   └── login.spec.js     # 21 tests
  ├── products/
  │   └── products.spec.js  # 23 tests
  └── e2e/
      └── shopping-flow.spec.js  # 3 tests
```

## Test Coverage

**Login (21 tests)**
- 3 positive tests
- 18 negative/edge cases (empty fields, SQL injection, XSS, unicode, etc.)

**Products (23 tests)**
- 8 cart operations
- 5 sorting tests
- 7 product info tests

**E2E (3 tests)**
- Complete shopping flows

## Run Specific Suite

```bash
npx playwright test tests/login
npx playwright test tests/products
npx playwright test tests/e2e
```
