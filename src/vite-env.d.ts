/// <reference types="vite/client" />

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "production" | "test";
  }
}

declare var process: {
  env: NodeJS.ProcessEnv;
};

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_MOVIE_API_KEY?: string;
  readonly VITE_PORT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
