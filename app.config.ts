import { defineConfig } from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/vite";
import { authEnabled } from "./src/lib/config";

export default defineConfig({
  middleware: authEnabled ? "src/middleware/oidc.ts" : undefined,
  vite: {
    ssr: { external: ["@prisma/client"] },
    plugins: [tailwindcss()],
  },
});
