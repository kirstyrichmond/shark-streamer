/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string
  readonly VITE_MOVIE_API_KEY?: string
  readonly VITE_PORT?: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}