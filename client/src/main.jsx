import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import {store} from "./store/store.js";
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/home/Home.jsx";
import Login from "./pages/authentication/Login.jsx";
import Signup from "./pages/authentication/Signup.jsx";
import Landing from "./pages/authentication/Landing.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import UserProfile from "./pages/home/UserProfile.jsx";
import SelfProfile from "./pages/home/SelfProfile.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />, 
  },
  {
    path: "/home",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
  {
    path: "/home/profile/:userId",
    element: (
      <ProtectedRoute>
        <UserProfile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/home/me",
    element: (
      <ProtectedRoute>
        <SelfProfile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />
  }
]);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
    <RouterProvider router={router} />
  </Provider>

  );
