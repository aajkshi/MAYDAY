import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Fix: Use '.' instead of process.cwd() to avoid "Property 'cwd' does not exist on type 'Process'" error
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react()],
    define: {
      // This ensures process.env.API_KEY works in the browser environment
      'process.env.API_KEY': JSON.stringify(env.API_KEY || process.env.API_KEY)
    }
  };
});