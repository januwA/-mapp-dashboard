// 路由配置分离到单独文件
import React, { Suspense } from "react";
import { Navigate } from "react-router-dom";

// 使用 React.lazy 进行路由分割
const HomePage = React.lazy(() => import("@mapp/home"));
const MePage = React.lazy(() => import("@mapp/me"));
const ProductDetailPage = React.lazy(() => import("@mapp/product-detail"));
const StorePage = React.lazy(() => import("@mapp/store"));

// 导入布局组件
import { AppLayout, SimpleLayout } from "@mapp/shared-lib/layouts";

// 创建带加载状态的组件包装器
const withSuspense = (Component) => (
  <Suspense fallback={<div style={{ padding: "20px", textAlign: "center" }}>⏳ 加载中...</div>}>
    <Component />
  </Suspense>
);

export const routeConfig = [
  {
    path: "/",
    element: <Navigate to="/home" replace />,
  },
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "home",
        element: withSuspense(HomePage),
      },
      {
        path: "store",
        element: withSuspense(StorePage),
      },
      {
        path: "me",
        element: withSuspense(MePage),
      },
    ],
  },
  {
    path: "/product",
    element: <SimpleLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/store" replace />,
      },
      {
        path: "detail",
        element: withSuspense(ProductDetailPage),
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/home" replace />,
  },
];
