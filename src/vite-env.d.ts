// src/vite-env.d.ts 或 src/svg-icons.d.ts
/// <reference types="vite/client" />
/// <reference types="vite-plugin-svg-icons/client" />

// 或者直接声明这个模块
declare module 'virtual:svg-icons-register' {
  const component: any;
  export default component;
}

// 如果你还需要使用 svg 图标组件
declare module 'virtual:svg-icons-names' {
  const icons: string[];
  export default icons;
}