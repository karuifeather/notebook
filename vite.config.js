import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslintPlugin from 'vite-plugin-eslint';

export default defineConfig({
  plugins: [
    react(),
    eslintPlugin({
      cache: false,
      exclude: [/virtual:/, /node_modules/, /sb-preview/],
    }),
  ],
  server: {
    port: 3000, // Same port as CRA by default
  },
  build: {
    outDir: 'build', // Use the same output directory as CRA
  },
});
