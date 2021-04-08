import React, { useReducer, useContext, useEffect, useRef } from "react";
import "./TodoApp.css";

function appReducer(state, action) {
  switch (action.type) {
    case "add": {
      return [
        ...state,
        {
          id: Date.now(),
          text: "",
          completed: false,
        },
      ];
    }
    case "update": {
      return state.map((item) => {
        if (item.id === action.payload.id) {
          return {
            ...item,
            text: action.payload.text,
          };
        }
        return item;
      });
    }
    case "delete": {
      return state.filter((item) => item.id !== action.payload);
    }
    case "completed": {
      return state.map((item) => {
        if (item.id === action.payload) {
          return {
            ...item,
            completed: !item.completed,
          };
        }
        return item;
      });
    }
    case "reset": {
      return action.payload;
    }
    default: {
      return state;
    }
  }
}

// creating context
const Context = React.createContext();

export default function TodoApp() {
  const [state, dispatch] = useReducer(appReducer, []);

  const didRun = useRef(false);

  useEffect(() => {
    if (!didRun.current) {
      const rawData = localStorage.getItem("data");
      dispatch({ type: "reset", payload: JSON.parse(rawData) });
      didRun.current = true;
    }
  });

  useEffect(() => {
    localStorage.setItem("data", JSON.stringify(state));
  }, [state]);

  return (
    //   Providing the context in parent component
    <Context.Provider value={dispatch}>
      <h1>Todos App</h1>
      {/* Using useReducers'  */}
      <button onClick={() => dispatch({ type: "add" })}>New TODO</button>
      <br />
      <br />
      <TodoList items={state} />
    </Context.Provider>
  );
}

function TodoList({ items }) {
  return items.map((item) => <TodoItem key={item.id} {...item} />);
}

function TodoItem({ id, completed, text }) {
  // using the context to change the state using dispatch method
  const dispatch = useContext(Context);
  return (
    <div className="todo-item">
      <input
        type="checkbox"
        checked={completed}
        onChange={() => dispatch({ type: "completed", payload: id })}
      />
      <input
        type="text"
        defaultValue={text}
        onChange={(e) => {
          e.preventDefault();
          dispatch({ type: "update", payload: { text: e.target.value, id } });
        }}
      />
      <button onClick={() => dispatch({ type: "delete", payload: id })}>
        Delete
      </button>
    </div>
  );
}
