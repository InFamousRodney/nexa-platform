/// <reference types="https://deno.land/x/types/index.d.ts" />

declare interface ImportMeta {
  main: boolean;
  url: string;
}

declare namespace Deno {
  export interface Env {
    get(key: string): string | undefined;
    set(key: string, value: string): void;
    delete(key: string): void;
    toObject(): { [key: string]: string };
  }

  export const env: Env;
}
