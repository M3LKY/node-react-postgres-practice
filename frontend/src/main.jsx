import React from "react";
import ReactDOM from "react-dom/client";
import App from "../src/App.jsx";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import Crud from "./Crud.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
  },
  {
    path: "/crud",
    element: <Crud/>,
  },
  {
    path: "/crud/:id",
    element: <Crud/>,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
