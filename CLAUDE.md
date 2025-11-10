# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

`@quon/dom` is a reactive DOM library built on top of `@quon/core`. It enables JSX-based UI development with automatic reactivity through `Realm` and `Store`, without requiring a virtual DOM. The library provides Vue-like ergonomics where reactive values automatically update the DOM.

## Development Commands

### Building
```bash
pnpm run build        # Build for production (CJS + ESM + type declarations)
pnpm run dev          # Build in watch mode for development
```

### Type Checking
```bash
pnpm run lint         # Run TypeScript type checking without emitting files
```

### Testing
```bash
pnpm test             # Run tests in watch mode
pnpm run test:ui      # Run tests with Vitest UI
pnpm run test:run     # Run tests once (CI mode)
```

### Publishing
```bash
pnpm publish          # Publish to npm (automatically runs build before publishing)
```

## Architecture

### Core Concepts

**Element Type System**
- `Element` is a tagged union: `Realm<Element> | ElementNode | string | number | Element[] | null | undefined`
- `Realm<Element>` represents reactive components (Blueprint-based)
- `ElementNode` represents static DOM element descriptions with `{ tag, props, children }`
- Arrays represent fragments or lists of elements

**Reactive Rendering**
- User code is written as Blueprints: `() => Element`
- JSX factory (`jsx()`) wraps `Realm<Element>` into `Element` type
- The `render()` function recursively processes `Element` values:
  - `Realm<Element>` → subscribes via `useStore` and re-renders on changes
  - `ElementNode` → creates DOM element, applies props, renders children
  - `string/number` → creates text nodes
  - `Element[]` → renders each element in sequence

**Reactivity Without Virtual DOM**
- Props can be `Realm<T>` values (e.g., `Store<string>`)
- When a `Realm` prop is detected, `useStore` + `useEffect` automatically update the DOM property
- No diffing or reconciliation needed - direct DOM manipulation guided by reactivity

### File Structure

```
src/
├── index.ts       # Public API exports
├── types.ts       # Core type definitions (Element, Props, Component, etc.)
├── jsx.ts         # JSX factory function and Fragment
├── component.ts   # component() helper (Blueprint.toRealm wrapper)
├── render.ts      # Core rendering logic (recursive Element → DOM)
└── utils.ts       # Type guards and utilities
```

### Key Implementation Details

**JSX Configuration**
- `jsxFactory: "jsx"` - custom JSX factory function
- `jsxFragmentFactory: "Fragment"` - fragment component
- String tags (e.g., "div") → create `ElementNode`
- Function tags (components) → call function and return `Realm<Element>`

**Component Pattern**
```typescript
const Counter = component(() => {
  const [count, setCount] = Blueprint.useCell(0);
  return <div>{count}</div>;
});
```

**Reactive Props**
```typescript
const [text, setText] = useCell("Hello");
<input value={text} />  // Automatically updates when text changes
```

**Array Rendering**
- Arrays are re-rendered entirely on changes (no key-based reconciliation currently)
- `key` prop is accepted but not yet used for optimization

**Ref Handling**
- `ref={(el) => ...}` callbacks are called after element creation
- Allows imperative DOM access when needed

### Dependencies

- `@quon/core` - Reactive primitives (Realm, Store, Blueprint)
- Core concepts: `Blueprint.toRealm`, `useCell`, `useStore`, `useEffect`, `use()`

### TypeScript Configuration

- Target: ES2020
- Module resolution: bundler
- Strict type checking enabled
- JSX: react mode with custom factory
- DOM and ES2020 libraries included

## Package Publishing

This package is scoped under `@quon` and published with public access. The `prepublishOnly` script ensures the package is built before publishing.
