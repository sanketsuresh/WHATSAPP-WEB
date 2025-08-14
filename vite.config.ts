import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Only load vars starting with VITE_
  const env = loadEnv(mode, process.cwd(), 'VITE_');

  return {
    plugins: [react()],

    optimizeDeps: {
      exclude: ['lucide-react'],
    },

    server: {
      port: 5173,
      strictPort: true, // force to use this port
      proxy: {
        '/api': {
          target: env.VITE_BACKEND_URL || 'http://localhost:9000',
          changeOrigin: true,
          secure: false,
        },
        '/socket.io': {
          target: env.VITE_BACKEND_URL || 'http://localhost:9000',
          ws: true,
        },
      },
    },

    define: {
      // ✅ Only expose safe env vars
      'import.meta.env': env,
    },
  };
});
