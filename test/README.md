# Test Structure Guide

This folder is organized to support two main goals:

1. Test library components independently.
2. Test user-facing behaviors and regression scenarios clearly.

The structure is intentionally split so that low-level behavior and high-level usage cases stay easy to understand.

## Top-level layout

```text
test/
├── Abstractions/
├── ComponentSuites/
└── FunctionalSuites/
```

## 1. Abstractions

This folder contains reusable test infrastructure.

### Purpose
- Keep test setup reusable and consistent.
- Avoid repeating boilerplate in every test file.
- Make it easier to swap or extend test helpers later.

### Subfolders

#### AssertionHelpers
Used for reusable assertions such as:
- checking that a user exists
- validating expected shape and field values
- verifying IDs, emails, names, and roles

#### Factories
Used for creating test data quickly.

Examples:
- create a user with defaults
- create a context with seeded data
- create repeated fixture objects for multiple tests

#### Mocks
Used for lightweight test doubles or fake providers.

Examples:
- a fake database adapter
- a stubbed persistence layer
- simplified test implementations for isolated component tests

## 2. ComponentSuites

This folder contains component-focused tests.

### Purpose
- Test individual library pieces independently.
- Validate that the mapper, DbContext, and related abstractions behave correctly in isolation.
- Keep these tests narrow and focused on implementation behavior.

### Current files
- DbContext.test.ts
  - tests for context-level behavior such as add/save/query flows.
- Mapper.test.ts
  - tests for mapping behavior between domain objects and persisted records.

## 3. FunctionalSuites

This folder is reserved for end-to-end and user-scenario style tests.

### Purpose
- Validate the library from the user’s point of view.
- Cover regression scenarios and realistic workflows.
- Capture business intent and expected user outcomes.

### Intended use
Add tests here for cases like:
- add a user and read it back
- update a user and confirm persistence
- remove a user and verify it no longer exists
- preserve type behavior across persistence boundaries
- regression cases that would break real usage

## Testing philosophy

This test layout supports a simple split:

- ComponentSuites: test the parts
- FunctionalSuites: test the whole experience
- Abstractions: support both cleanly

That makes it easier to grow the library while keeping the tests maintainable.

## Naming conventions

Use descriptive test names that explain the behavior being verified.

Examples:
- should add a user and retrieve it after save
- should preserve numeric ids after persistence
- should remove a user and make it unavailable

## Future direction

As the library evolves, this structure should grow naturally:
- add more component tests as new abstractions appear
- add more functional regression suites as user-facing capabilities expand
- keep helpers in Abstractions so test files remain readable

This document is intended to be a living guide for the test suite as the project moves from early prototype stages toward a more mature library.
