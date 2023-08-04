import { useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";

const initialState = [];
const reducer = (state, action) => {
  if (action.type === "GET" || action.type === "SEARCH") {
    return action.payload;
  } else if (action.type === "NAME") {
    return { ...state, name: action.payload };
  } else if (action.type === "DESCRIPTION") {
    return { ...state, description: action.payload };
  }
  return state;
};

const App = () => {
  const navigate = useNavigate();

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const response = await fetch("http://localhost:3000/", {
          method: "GET",
        });

        if (isMounted) {
          const data = await response.json();
          dispatch({ type: "GET", payload: data.newTodo });
        }
      } catch (error) {
        console.log(error);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const setSearch = (event) => {
    (async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/?search=${encodeURIComponent(
            event.target.value
          )}`,
          {
            method: "GET",
          }
        );
        const data = await response.json();
        dispatch({ type: "SEARCH", payload: data.newTodo });
      } catch (error) {
        console.log(error);
      }
    })();
  };

  /**
   * mira melqui 
   * name: test3 description: testing
    SetCreateTodo: Name or description cannot be empty
    el nom y des se estan cogiendo en el useState, pero por alguna razon no estan llegando a la funcion setcreatetodo
   */

  return (
    <div>
      <div>
        <input type="text" onChange={setSearch} />
        <button onClick={() => navigate("/crud")}>Add</button>
        <ul>
          {Array.isArray(state) ? (
            state.map((data) => (
              <li key={data.id} onClick={() => navigate(`/crud/${data.id}`)}>
                <h3>{data.name}</h3>
                <p>{data.description}</p>
              </li>
            ))
          ) : (
            <li>No data found</li>
          )}
        </ul>
      </div>
    </div>
  );
};
export default App;
