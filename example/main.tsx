import { Store, useTimeout } from "@quon/core";
import { component, Blueprint, mount, jsx } from "../src/index";

const { useCell, use } = Blueprint;

// Counter component
const Counter = component(() => {
  const [count, setCount] = useCell<number>(0);

  return (
    <div className="counter">
      <h2>Counter Example</h2>
      <p>
        Count: <strong>{count}</strong>
      </p>
      <button onClick={() => setCount((prev) => prev + 1)}>Increment</button>
      <button onClick={() => setCount((prev) => prev - 1)}>Decrement</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
});

// Input sync example
const InputSync = component(() => {
  const [text, setText] = useCell<string>("Hello, Quon!");

  return (
    <div className="counter">
      <h2>Input Sync Example</h2>
      <p>
        You typed: <strong>{text}</strong>
      </p>
      <input
        type="text"
        value={text}
        onInput={(e: Event) => setText((e.target as HTMLInputElement).value)}
      />
    </div>
  );
});

// Todo List example
const TodoList = component(() => {
  const [todos, setTodos] = useCell<string[]>([
    "Buy milk",
    "Learn Quon",
    "Build app",
  ]);
  const [newTodo, setNewTodo] = useCell<string>("");

  const addTodo = () => {
    const todo = [...newTodo.peek()][0];
    if (todo.trim() !== "") {
      setTodos((prev) => [...prev, todo]);
      setNewTodo("");
    }
  };

  const removeTodo = (index: number) => {
    setTodos((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="counter">
      <h2>Todo List Example</h2>
      <div>
        <input
          type="text"
          value={newTodo}
          onInput={(e: Event) =>
            setNewTodo((e.target as HTMLInputElement).value)
          }
          placeholder="Enter new todo"
        />
        <button onClick={addTodo}>Add</button>
      </div>
      <div>
        {use(todos).map((todo, index) => (
          <div key={index} className="todo-item">
            <span>{todo}</span>
            <button onClick={() => removeTodo(index)}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
});

const DataView = component(
  ({ dataKeyStore }: { dataKeyStore: Store<string> }) => {
    // Depends on dataKey store
    const dataKey = use(dataKeyStore);
    // Simulate data fetching with a timeout
    useTimeout(1000);
    const data = `Data for key: ${dataKey}`;
    return <div>{data}</div>;
  }
);

const DataFetcher = component(() => {
  const [keyStore, setKey] = useCell<string>("initial");

  return (
    <div className="counter">
      <h2>Data Fetcher Example</h2>
      <div>
        <input
          type="text"
          value={keyStore}
          onInput={(e: Event) => setKey((e.target as HTMLInputElement).value)}
          placeholder="Enter data key"
        />
      </div>
      <div className="data-view">
        <DataView dataKeyStore={keyStore} />
      </div>
    </div>
  );
});

// Main App
const App = component(() => {
  return (
    <div>
      <Counter />
      <InputSync />
      <TodoList />
      <DataFetcher />
    </div>
  );
});

// Mount to DOM
const root = document.getElementById("root");
if (root) {
  mount(App(), root);
}
