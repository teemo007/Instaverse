import { createBrowserRouter } from "react-router-dom";

import ErrorPage from "../components/layout/ErrorPage";
import RootLayout from "../components/layout/RootLayout";
import AuthForm from "../features/auth/components/AuthForm";
import Home from "../features/stories/components/Home";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/authForm", element: <AuthForm /> },
    ],
  },
]);
