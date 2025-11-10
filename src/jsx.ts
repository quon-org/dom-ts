import { Realm } from "@quon/core";
import { Element, Component } from "./types";

/**
 * JSX factory function
 * This is called by TypeScript when JSX is transformed
 */
export function jsx(
  tag: string | Component,
  props: Record<string, unknown> | null,
  ...children: unknown[]
): Element {
  const actualProps = props ?? {};
  const actualChildren = flattenChildren(children);

  // If tag is a function (component), call it and return the Realm<Element>
  if (typeof tag === "function") {
    return tag({ ...actualProps, children: actualChildren });
  }

  // If tag is a string, create an ElementNode
  return {
    tag,
    props: actualProps,
    children: actualChildren,
  };
}

/**
 * Flatten JSX children
 */
function flattenChildren(children: unknown[]): Element[] {
  const result: Element[] = [];
  for (const child of children) {
    if (Array.isArray(child)) {
      result.push(...flattenChildren(child));
    } else if (child != null && child !== false && child !== true) {
      result.push(child as Element);
    }
  }
  return result;
}

/**
 * Fragment component - renders children directly
 */
export function Fragment(props: { children?: Element[] }): Element {
  return props.children ?? [];
}

/**
 * Helper to wrap a Realm<Element> as an Element
 * This allows using Realm<Element> directly in JSX
 */
export function wrapRealm(realm: Realm<Element>): Element {
  return realm;
}
