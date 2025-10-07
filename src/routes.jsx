// 路由配置分离到单独文件
import React, { Suspense } from "react";
import { Navigate } from "react-router-dom";
import { moduleLoader, useModule } from "./ModuleLoader.js";

// 使用 React.lazy 进行路由分割
const HomePage = React.lazy(() => import("@mapp/home"));
const MePage = React.lazy(() => import("@mapp/me"));
const ProductDetailPage = React.lazy(() => import("@mapp/product-detail"));
const StorePage = React.lazy(() => import("@mapp/store"));

// 导入布局组件
import { AppLayout, SimpleLayout } from "@mapp/shared-lib/layouts";

// 创建带加载状态的组件包装器
const withSuspense = (Component) => (
  <Suspense
    fallback={
      <div style={{ padding: "20px", textAlign: "center" }}>⏳ 加载中...</div>
    }
  >
    <Component />
  </Suspense>
);

const DynamicImportUmdComponent = () => {
  const module = useModule("react-shared");
  const CountComponent = module?.CountComponent;
  const DynamicJump = module?.DynamicJump;

  return (
    <div>
      {CountComponent ? (
        <CountComponent />
      ) : (
        <div>CountComponent 组件加载失败</div>
      )}
      {DynamicJump ? <DynamicJump /> : <div>DynamicJump 组件加载失败</div>}
    </div>
  );
};

const DynamicImportZustandComponent = () => {
  const module = useModule("react-shared");
  const useCountStore = module?.useCountStore;
  const { count, increment, decrement, reset } = useCountStore();

  return (
    <div>
      <div style={{ fontSize: "24px", margin: "20px 0" }}>
        计数: <strong>{count}</strong>
      </div>
      <div style={{ display: "flex", gap: "10px" }}>
        <button onClick={decrement}>-</button>
        <button onClick={reset}>重置</button>
        <button onClick={increment}>+</button>
      </div>
    </div>
  );
};

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
      {
        path: "dynamic-import",
        element: <DynamicImportUmdComponent />,
      },
      {
        path: "dynamic-import-zustand",
        element: <DynamicImportZustandComponent />,
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
