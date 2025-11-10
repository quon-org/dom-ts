import { Blueprint, Realm } from "@quon/core";
import { Element, ElementNode, Props, RefCallback } from "./types";
import { isRealmElement, isRealm, isArray, flattenChildren } from "./utils";

const { use, useStore, useEffect } = Blueprint;

/**
 * Render an Element to a parent DOM node (Blueprint function)
 */
export function useRender(element: Element, parent: Node): void {
  useRenderInternal(element, parent, null);
}

/**
 * Render an Element before a specific node (Blueprint function)
 */
function useRenderBeforeNode(element: Element, beforeNode: Node): void {
  useRenderInternal(element, beforeNode.parentNode!, beforeNode);
}

/**
 * Helper to insert a node at the correct position
 */
function insertNode(parent: Node, node: Node, beforeNode: Node | null): void {
  if (beforeNode) {
    parent.insertBefore(node, beforeNode);
  } else {
    parent.appendChild(node);
  }
}

/**
 * Internal render function with optional beforeNode (Blueprint function)
 */
function useRenderInternal(
  element: Element,
  parent: Node,
  beforeNode: Node | null
): void {
  // Handle null/undefined
  if (element == null) {
    return;
  }

  // Handle Realm<Element>
  if (isRealmElement(element)) {
    // Create an anchor comment node to mark the position
    const anchor = useEffect(() => {
      const realmAnchor = document.createComment("realm-anchor");
      return realmAnchor;
    });

    useEffect((addReleasable) => {
      insertNode(parent, anchor, beforeNode);

      addReleasable({
        release: async () => {
          anchor.remove();
        },
      });
    });

    // Render elements, inserting before the anchor
    useStore(() => {
      const el = use(element);
      useRenderBeforeNode(el, anchor);
    });
    return;
  }

  // Handle arrays
  if (isArray(element)) {
    const flattened = flattenChildren(element);
    for (const child of flattened) {
      useRenderInternal(child, parent, beforeNode);
    }
    return;
  }

  // Handle text nodes (string/number)
  if (typeof element === "string" || typeof element === "number") {
    const textNode = useEffect(() => {
      return document.createTextNode(String(element));
    });

    useEffect((addReleasable) => {
      insertNode(parent, textNode, beforeNode);

      addReleasable({
        release: async () => {
          textNode.remove();
        },
      });
    });
    return;
  }

  // Handle ElementNode
  const elementNode = element as ElementNode;

  // Extract values before any Blueprint calls
  const tag = elementNode.tag;
  const props = elementNode.props;
  const children = elementNode.children;

  const domElement = useEffect(() => {
    return document.createElement(tag);
  });

  // Apply props
  useApplyProps(domElement, props);

  // Append to parent
  useEffect((addReleasable) => {
    insertNode(parent, domElement, beforeNode);

    addReleasable({
      release: async () => {
        domElement.remove();
      },
    });
  });

  // Render children
  for (const child of children) {
    useRenderInternal(child, domElement, null);
  }
}

/**
 * Apply props to a DOM element (Blueprint function)
 */
function useApplyProps(element: HTMLElement, props: Props): void {
  for (const [key, value] of Object.entries(props)) {
    // Skip special props
    if (key === "children" || key === "key") {
      continue;
    }

    // Handle ref
    if (key === "ref" && typeof value === "function") {
      useEffect(() => {
        (value as RefCallback)(element);
      });
      continue;
    }

    // Handle event listeners (onClick, onInput, etc.)
    if (key.startsWith("on") && typeof value === "function") {
      const eventName = key.slice(2).toLowerCase();
      useEffect((addReleasable) => {
        const handler = value as EventListener;
        element.addEventListener(eventName, handler);

        addReleasable({
          release: async () => {
            element.removeEventListener(eventName, handler);
          },
        });
      });
      continue;
    }

    // Handle Realm values (including Store)
    if (isRealm(value)) {
      useStore(() => {
        const val = use(value as Realm<unknown>);
        setProp(element, key, val);
      });
      continue;
    }

    // Handle static values
    useEffect(() => {
      setProp(element, key, value);
    });
  }
}

/**
 * Set a property or attribute on an element
 */
function setProp(element: HTMLElement, key: string, value: unknown): void {
  if (value == null) {
    return;
  }

  // Special handling for certain properties
  if (key === "className") {
    element.className = String(value);
    return;
  }

  if (key === "style" && typeof value === "object") {
    Object.assign(element.style, value);
    return;
  }

  // Try to set as property first
  if (key in element) {
    try {
      (element as any)[key] = value;
      return;
    } catch {
      // If property assignment fails, fall through to setAttribute
    }
  }

  // Set as attribute
  if (typeof value === "boolean") {
    if (value) {
      element.setAttribute(key, "");
    } else {
      element.removeAttribute(key);
    }
  } else {
    element.setAttribute(key, String(value));
  }
}
