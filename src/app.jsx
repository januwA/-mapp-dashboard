import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { routeConfig } from "./routes.jsx";
import {} from "./components.jsx";

// Data Mode Router Configuration - 使用分离的路由配置
const router = createBrowserRouter(routeConfig);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
