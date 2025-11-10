/**
 * @quon/dom - TypeScript DOM library built on @quon/core
 */

// Re-export core Blueprint utilities
export { Blueprint } from "@quon/core";

// Export types
export type {
  Element,
  ElementNode,
  Props,
  RefCallback,
  Component,
  QuonIntrinsicElements,
  MaybeRealm,
} from "./types";

// Export JSX factory and Fragment
export { jsx, Fragment } from "./jsx";

// Export component helper
export { component } from "./component";

// Export render function
export { useRender } from "./render";

// Export mount function
export { mount } from "./mount";

// Export utilities
export { isRealm, isRealmElement, isArray, flattenChildren } from "./utils";
