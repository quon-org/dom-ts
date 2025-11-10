import { Realm } from "@quon/core";
import { Element } from "./types";

/**
 * Check if a value is a Realm
 */
export function isRealm(value: unknown): value is Realm<unknown> {
  return value instanceof Realm;
}

/**
 * Check if a value is a Realm (for Element type)
 */
export function isRealmElement(value: unknown): value is Realm<Element> {
  return value instanceof Realm;
}

/**
 * Check if a value is an array
 */
export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

/**
 * Flatten nested arrays
 */
export function flattenChildren(children: Element[]): Element[] {
  const result: Element[] = [];

  for (const child of children) {
    if (isArray(child)) {
      result.push(...flattenChildren(child));
    } else {
      result.push(child);
    }
  }

  return result;
}
