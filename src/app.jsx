import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { getRouteConfig } from "./routes.jsx";

const router = createBrowserRouter(getRouteConfig());

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
