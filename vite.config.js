import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import svgr from 'vite-plugin-svgr';
import { visualizer } from 'rollup-plugin-visualizer';
import path from 'path'; // 👈 Add this

export default defineConfig({
  plugins: [
    react(),
    svgr(),
    visualizer({ open: false }) // Don't auto-open in production
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // 👈 Use '@' to refer to /src
    },
  },
  server: {
    port: 4000,
    host: true, // Allow external connections
    cors: true,
    allowedHosts: ['dev.uptrender.in', 'localhost']
  },
  preview: {
    port: 4000,
    host: true
  }
});
