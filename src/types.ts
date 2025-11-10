import { Realm } from "@quon/core";

/**
 * Element type - the core type representing DOM elements in the library
 */
export type Element =
  | Realm<Element> // Component (Blueprint-based)
  | ElementNode // DOM element description
  | string // Text node
  | number // Text node
  | Element[] // Fragment/array
  | null
  | undefined;

/**
 * ElementNode represents a DOM element with tag, props, and children
 */
export type ElementNode = {
  tag: string;
  props: Props;
  children: Element[];
};

/**
 * Props type - supports both static values and reactive Realm values
 */
export type Props = {
  [key: string]: unknown | Realm<unknown>;
  ref?: RefCallback;
  key?: string | number;
};

/**
 * Ref callback - called when the element is created
 */
export type RefCallback = (element: HTMLElement) => void;

/**
 * Component function type - returns an Element
 */
export type Component<P = Record<string, unknown>> = (props: P) => Element;

/**
 * Helper type to allow Realm values for a given type
 */
export type MaybeRealm<T> = T | Realm<T>;

/**
 * JSX intrinsic elements - maps HTML tag names to their props
 */
export type QuonIntrinsicElements = {
  [K in keyof HTMLElementTagNameMap]: {
    ref?: RefCallback;
    key?: string | number;
    children?: Element | Element[];
    // Event handlers (functions only)
    onClick?: EventListener;
    onInput?: EventListener;
    onChange?: EventListener;
    onSubmit?: EventListener;
    onKeyDown?: EventListener;
    onKeyUp?: EventListener;
    onFocus?: EventListener;
    onBlur?: EventListener;
    // Props can be Realm values
    value?: MaybeRealm<string>;
    checked?: MaybeRealm<boolean>;
    disabled?: MaybeRealm<boolean>;
    className?: MaybeRealm<string>;
    style?: MaybeRealm<string | Partial<CSSStyleDeclaration>>;
    // Allow any other props with Realm support
    [key: string]: unknown | Realm<unknown>;
  };
};

declare global {
  namespace JSX {
    interface IntrinsicElements extends QuonIntrinsicElements {}
    interface ElementAttributesProperty {
      props: unknown;
    }
    interface ElementChildrenAttribute {
      children: unknown;
    }
    type Element = import("./types").Element;
  }
}
