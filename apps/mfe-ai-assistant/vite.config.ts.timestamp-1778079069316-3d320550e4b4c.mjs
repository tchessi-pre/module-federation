// vite.config.ts
import { defineConfig } from "file:///C:/TchessProjects/module-federation/node_modules/.pnpm/vite@5.4.21_@types+node@22.19.17/node_modules/vite/dist/node/index.js";
import react from "file:///C:/TchessProjects/module-federation/node_modules/.pnpm/@vitejs+plugin-react@4.7.0_vite@5.4.21_@types+node@22.19.17_/node_modules/@vitejs/plugin-react/dist/index.js";
import federation from "file:///C:/TchessProjects/module-federation/node_modules/.pnpm/@originjs+vite-plugin-federation@1.4.1/node_modules/@originjs/vite-plugin-federation/dist/index.mjs";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    federation({
      name: "assistant",
      filename: "remoteEntry.js",
      exposes: {
        "./Routes": "./src/Routes.tsx"
      },
      shared: {
        react: { singleton: true, requiredVersion: "^18.3.1" },
        "react-dom": { singleton: true, requiredVersion: "^18.3.1" },
        "react/jsx-runtime": { singleton: true, requiredVersion: "^18.3.1" },
        "react-router-dom": { singleton: true, requiredVersion: "^6.26.2" },
        zustand: { singleton: true, requiredVersion: "^4.5.5" },
        "@tanstack/react-query": { singleton: true, requiredVersion: "^5.59.16" },
        ai: { singleton: true, requiredVersion: "^6.0.0" },
        "@ai-sdk/react": { singleton: true, requiredVersion: "^1.2.0" }
      }
    })
  ],
  server: {
    port: 5176,
    strictPort: true,
    cors: true
  },
  build: {
    target: "esnext"
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxUY2hlc3NQcm9qZWN0c1xcXFxtb2R1bGUtZmVkZXJhdGlvblxcXFxhcHBzXFxcXG1mZS1haS1hc3Npc3RhbnRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFRjaGVzc1Byb2plY3RzXFxcXG1vZHVsZS1mZWRlcmF0aW9uXFxcXGFwcHNcXFxcbWZlLWFpLWFzc2lzdGFudFxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVGNoZXNzUHJvamVjdHMvbW9kdWxlLWZlZGVyYXRpb24vYXBwcy9tZmUtYWktYXNzaXN0YW50L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCdcbmltcG9ydCBmZWRlcmF0aW9uIGZyb20gJ0BvcmlnaW5qcy92aXRlLXBsdWdpbi1mZWRlcmF0aW9uJ1xuXG4vLyBodHRwczovL3ZpdGUuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtcbiAgICByZWFjdCgpLFxuICAgIGZlZGVyYXRpb24oe1xuICAgICAgbmFtZTogJ2Fzc2lzdGFudCcsXG4gICAgICBmaWxlbmFtZTogJ3JlbW90ZUVudHJ5LmpzJyxcbiAgICAgIGV4cG9zZXM6IHtcbiAgICAgICAgJy4vUm91dGVzJzogJy4vc3JjL1JvdXRlcy50c3gnLFxuICAgICAgfSxcbiAgICAgIHNoYXJlZDoge1xuICAgICAgICByZWFjdDogeyBzaW5nbGV0b246IHRydWUsIHJlcXVpcmVkVmVyc2lvbjogJ14xOC4zLjEnIH0sXG4gICAgICAgICdyZWFjdC1kb20nOiB7IHNpbmdsZXRvbjogdHJ1ZSwgcmVxdWlyZWRWZXJzaW9uOiAnXjE4LjMuMScgfSxcbiAgICAgICAgJ3JlYWN0L2pzeC1ydW50aW1lJzogeyBzaW5nbGV0b246IHRydWUsIHJlcXVpcmVkVmVyc2lvbjogJ14xOC4zLjEnIH0sXG4gICAgICAgICdyZWFjdC1yb3V0ZXItZG9tJzogeyBzaW5nbGV0b246IHRydWUsIHJlcXVpcmVkVmVyc2lvbjogJ142LjI2LjInIH0sXG4gICAgICAgIHp1c3RhbmQ6IHsgc2luZ2xldG9uOiB0cnVlLCByZXF1aXJlZFZlcnNpb246ICdeNC41LjUnIH0sXG4gICAgICAgICdAdGFuc3RhY2svcmVhY3QtcXVlcnknOiB7IHNpbmdsZXRvbjogdHJ1ZSwgcmVxdWlyZWRWZXJzaW9uOiAnXjUuNTkuMTYnIH0sXG4gICAgICAgIGFpOiB7IHNpbmdsZXRvbjogdHJ1ZSwgcmVxdWlyZWRWZXJzaW9uOiAnXjYuMC4wJyB9LFxuICAgICAgICAnQGFpLXNkay9yZWFjdCc6IHsgc2luZ2xldG9uOiB0cnVlLCByZXF1aXJlZFZlcnNpb246ICdeMS4yLjAnIH0sXG4gICAgICB9LFxuICAgIH0pLFxuICBdLFxuICBzZXJ2ZXI6IHtcbiAgICBwb3J0OiA1MTc2LFxuICAgIHN0cmljdFBvcnQ6IHRydWUsXG4gICAgY29yczogdHJ1ZSxcbiAgfSxcbiAgYnVpbGQ6IHtcbiAgICB0YXJnZXQ6ICdlc25leHQnLFxuICB9LFxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBdVcsU0FBUyxvQkFBb0I7QUFDcFksT0FBTyxXQUFXO0FBQ2xCLE9BQU8sZ0JBQWdCO0FBR3ZCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLFdBQVc7QUFBQSxNQUNULE1BQU07QUFBQSxNQUNOLFVBQVU7QUFBQSxNQUNWLFNBQVM7QUFBQSxRQUNQLFlBQVk7QUFBQSxNQUNkO0FBQUEsTUFDQSxRQUFRO0FBQUEsUUFDTixPQUFPLEVBQUUsV0FBVyxNQUFNLGlCQUFpQixVQUFVO0FBQUEsUUFDckQsYUFBYSxFQUFFLFdBQVcsTUFBTSxpQkFBaUIsVUFBVTtBQUFBLFFBQzNELHFCQUFxQixFQUFFLFdBQVcsTUFBTSxpQkFBaUIsVUFBVTtBQUFBLFFBQ25FLG9CQUFvQixFQUFFLFdBQVcsTUFBTSxpQkFBaUIsVUFBVTtBQUFBLFFBQ2xFLFNBQVMsRUFBRSxXQUFXLE1BQU0saUJBQWlCLFNBQVM7QUFBQSxRQUN0RCx5QkFBeUIsRUFBRSxXQUFXLE1BQU0saUJBQWlCLFdBQVc7QUFBQSxRQUN4RSxJQUFJLEVBQUUsV0FBVyxNQUFNLGlCQUFpQixTQUFTO0FBQUEsUUFDakQsaUJBQWlCLEVBQUUsV0FBVyxNQUFNLGlCQUFpQixTQUFTO0FBQUEsTUFDaEU7QUFBQSxJQUNGLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixZQUFZO0FBQUEsSUFDWixNQUFNO0FBQUEsRUFDUjtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsUUFBUTtBQUFBLEVBQ1Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
