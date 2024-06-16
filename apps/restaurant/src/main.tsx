import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import { store } from "./app/store";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ErrorPage } from "./error-page";
import { IngredientList } from "./features/ingredients/IngredientList";
import { Counter } from "./features/counter/Counter";
import { Quotes } from "./features/quotes/Quotes";

const container = document.getElementById("root");

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "ingredients",
        element: <IngredientList />,
      },
      {
        path: "counter",
        element: <Counter />,
      },
      {
        path: "quotes",
        element: <Quotes />,
      },
    ],
  },
]);

if (container) {
  const root = createRoot(container);

  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </React.StrictMode>,
  );
} else {
  throw new Error(
    "Root element with ID 'root' was not found in the document. Ensure there is a corresponding HTML element with the ID 'root' in your HTML file.",
  );
}
