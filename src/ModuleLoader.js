import React from "react";

// 模块配置接口
const DEFAULT_DEPENDENCIES = ['react', 'react-dom', 'react/jsx-runtime', 'react-router-dom'];

// 通用模块加载器，支持多模块动态加载
class ModuleLoader {
  constructor() {
    this.modules = new Map(); // 存储已加载的模块
    this.loadingPromises = new Map(); // 存储加载中的Promise
    this.cachedPromises = new Map(); // 为React 19 use()缓存Promise
    this.moduleConfigs = new Map(); // 存储模块配置

    // 预注册react-shared模块配置
    this.registerModule('react-shared', {
      url: 'https://cdn.jsdelivr.net/gh/januwA/ajanuw-vite-build-esm@main/dist/umd/react-shared.js',
      globalName: 'ReactShared',
      dependencies: [...DEFAULT_DEPENDENCIES, 'zustand']
    });
  }

  // 注册模块配置
  registerModule(name, config) {
    this.moduleConfigs.set(name, {
      dependencies: DEFAULT_DEPENDENCIES,
      ...config
    });
  }

  // 为React 19 use()提供稳定的Promise
  getModulePromise(moduleName) {
    if (!this.cachedPromises.has(moduleName)) {
      this.cachedPromises.set(moduleName, this.loadModule(moduleName));
    }
    return this.cachedPromises.get(moduleName);
  }

  async loadModule(moduleName) {
    // 如果已经加载过，直接返回
    if (this.modules.has(moduleName)) {
      return this.modules.get(moduleName);
    }

    // 如果正在加载，等待加载完成
    if (this.loadingPromises.has(moduleName)) {
      return this.loadingPromises.get(moduleName);
    }

    // 获取模块配置
    const config = this.moduleConfigs.get(moduleName);
    if (!config) {
      throw new Error(`Module ${moduleName} is not registered`);
    }

    // 开始加载
    const loadingPromise = this.loadModuleWithConfig(config);
    this.loadingPromises.set(moduleName, loadingPromise);

    try {
      const module = await loadingPromise;
      this.modules.set(moduleName, module);
      this.loadingPromises.delete(moduleName);
      return module;
    } catch (error) {
      this.loadingPromises.delete(moduleName);
      throw error;
    }
  }

  async loadModuleWithConfig(config) {
    // 准备依赖映射
    const dependencyMap = {
      'react': () => React,
      'react-dom': () => import('react-dom'),
      'react/jsx-runtime': () => import('react/jsx-runtime'),
      'react-router-dom': () => import('react-router-dom'),
      'zustand': () => import('zustand')
    };

    const globalMap = {
      'react': 'React',
      'react-dom': 'ReactDOM',
      'react/jsx-runtime': 'ReactJSXRuntime',
      'react-router-dom': 'ReactRouterDOM',
      'zustand': 'Zustand'
    };

    // 加载所需依赖
    for (const dep of config.dependencies) {
      const globalName = globalMap[dep];
      if (globalName && !window[globalName]) {
        try {
          const module = await dependencyMap[dep]();
          window[globalName] = module;
        } catch (error) {
          console.warn(`Failed to load dependency ${dep}:`, error);
        }
      }
    }

    // 如果模块已经在全局存在，直接返回
    if (window[config.globalName]) {
      return window[config.globalName];
    }

    // 创建script标签来加载UMD模块
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = config.url;
      script.onload = () => {
        if (window[config.globalName]) {
          resolve(window[config.globalName]);
        } else {
          reject(new Error(`${config.globalName} not found after loading ${config.url}`));
        }
      };
      script.onerror = (error) => {
        reject(new Error(`Failed to load UMD module from ${config.url}: ${error.message}`));
      };

      document.head.appendChild(script);
    });
  }
}

// 全局模块加载器实例
export const moduleLoader = new ModuleLoader();

// 示例：注册更多模块
// moduleLoader.registerModule('module-a', {
//   url: 'https://example.com/module-a.js',
//   globalName: 'ModuleA',
//   dependencies: ['react', 'react-dom']
// });

// moduleLoader.registerModule('module-b', {
//   url: 'https://example.com/module-b.js',
//   globalName: 'ModuleB',
//   dependencies: ['react', 'react-router-dom']
// });

// 便利方法：批量注册模块
export const registerModules = (modules) => {
  Object.entries(modules).forEach(([name, config]) => {
    moduleLoader.registerModule(name, config);
  });
};

// 便利方法：创建React Hook来使用模块
export const useModule = (moduleName) => {
  const module = React.use(moduleLoader.getModulePromise(moduleName));
  return module;
};