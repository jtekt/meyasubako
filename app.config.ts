import { defineConfig } from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/vite";

const { OIDC_AUTHORITY } = process.env;

export default defineConfig({
  middleware: OIDC_AUTHORITY ? "src/middleware/oidc.ts" : undefined,
  vite: {
    ssr: { external: ["@prisma/client"] },
    plugins: [tailwindcss()],
  },
});
