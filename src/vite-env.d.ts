/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string
  readonly VITE_APP_VERSION: string
  readonly VITE_ROKO_API_URL: string
  readonly VITE_WALLETCONNECT_PROJECT_ID: string
  readonly VITE_ANALYTICS_ID: string
  readonly VITE_SENTRY_DSN: string
  readonly NODE_ENV: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
  readonly hot?: {
    accept: (callback?: () => void) => void
    dispose: (callback: () => void) => void
  }
}

// Global type definitions
declare const __DEV__: boolean
declare const __PROD__: boolean
declare const __VERSION__: string

// Performance monitoring globals
interface Window {
  __ROKO_PERFORMANCE__?: {
    marks: {
      [key: string]: number;
    };
  };
}

// Module declarations for assets
declare module '*.svg' {
  import { FC, SVGProps } from 'react'
  const content: FC<SVGProps<SVGSVGElement>>
  export default content
}

declare module '*.png' {
  const content: string
  export default content
}

declare module '*.jpg' {
  const content: string
  export default content
}

declare module '*.jpeg' {
  const content: string
  export default content
}

declare module '*.webp' {
  const content: string
  export default content
}

declare module '*.gif' {
  const content: string
  export default content
}

declare module '*.css' {
  const classes: { readonly [key: string]: string }
  export default classes
}

declare module '*.module.css' {
  const classes: { readonly [key: string]: string }
  export default classes
}

declare module '*.scss' {
  const classes: { readonly [key: string]: string }
  export default classes
}

declare module '*.module.scss' {
  const classes: { readonly [key: string]: string }
  export default classes
}

// 3D model files
declare module '*.glb' {
  const content: string
  export default content
}

declare module '*.gltf' {
  const content: string
  export default content
}

// Shader files
declare module '*.glsl' {
  const content: string
  export default content
}

declare module '*.vert' {
  const content: string
  export default content
}

declare module '*.frag' {
  const content: string
  export default content
}