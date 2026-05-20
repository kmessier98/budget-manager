import { createBrowserRouter } from "react-router-dom";
import ExpenseManager from "./pages/ExpenseManager";
import App from "./App";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <ExpenseManager />,
      },
      {
        path: "/expense-manager",
        element: <ExpenseManager />,
      },
    ],
  },
]);

export default router;
