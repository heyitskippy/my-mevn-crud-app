/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE_BASE: string
  VITE_CLIENT_PORT: number
  VITE_SERVER_PORT: number
  VITE_API: string
  VITE_CYPRESS: string

  VITE_JWT_SECRET: string
  VITE_REFRESH_SECRET: string

  VITE_MONGO_CONTAINER: string
  VITE_MONGO_HOST: string
  VITE_MONGO_PORT: number
  VITE_MONGO_DB_NAME: string
  VITE_MONGO_USERNAME: string
  VITE_MONGO_PASSWORD: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
