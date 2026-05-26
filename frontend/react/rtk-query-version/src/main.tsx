import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./index.scss";
import { RouterProvider } from "react-router-dom";
import router from "./router.tsx";
import { Provider } from "react-redux";
import { store } from "./app/store";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
);
