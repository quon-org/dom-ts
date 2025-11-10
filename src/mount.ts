import { Blueprint } from "@quon/core";
import { Element } from "./types";
import { useRender } from "./render";

/**
 * Mount an Element to a DOM node
 * This creates a Store that manages the rendering lifecycle
 *
 * @example
 * const app = mount(<App />, document.getElementById("root")!);
 *
 * // Later, to unmount:
 * await app.release();
 */
export function mount(element: Element, parent: Node) {
  return Blueprint.toStore(() => {
    useRender(element, parent);
  });
}
