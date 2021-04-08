import React, { useReducer, useContext, useEffect } from "react";
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
    // case "update": {
    //     const updateItem = state.filter((item) => item.id !== action.payload);
    //   return [
    //     ...state,
    //     {
    //       id: Date.now(),
    //       text: "",
    //       completed: false,
    //     },
    //   ];
    // }
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

const Context = React.createContext();

export default function TodoApp() {
  const [state, dispatch] = useReducer(appReducer, []);
  useEffect(() => {
    const rawData = localStorage.getItem("data");
    dispatch({ type: "reset", payload: JSON.parse(rawData) });
  }, []);

  useEffect(() => {
    localStorage.setItem("data", JSON.stringify(state));
  }, [state]);

  return (
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
        // onChange={(e) =>
        //   dispatch({ type: "update", payload: { text: e.target.value, id } })
        // }
      />
      <button onClick={() => dispatch({ type: "delete", payload: id })}>
        Delete
      </button>
    </div>
  );
}
