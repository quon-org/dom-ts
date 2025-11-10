import { Blueprint } from "@quon/core";
import { Element } from "./types";

/**
 * Create a component from a blueprint function
 * Returns a function that can be used in JSX
 *
 * @example
 * const Counter = component(() => {
 *   const [count, setCount] = useCell(0);
 *   return <div>{count}</div>;
 * });
 *
 * // Use in JSX:
 * <Counter />
 */
export function component<Props extends Record<string, unknown> | undefined>(
  blueprint: (...props: PropsArgs<Props>) => Element
): (...props: PropsArgs<Props>) => Element {
  return (...props) => Blueprint.toRealm(() => blueprint(...props));
}

type PropsArgs<P> = P extends undefined ? [] : [P];
