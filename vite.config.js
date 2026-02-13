import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslintPlugin from 'vite-plugin-eslint';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    eslintPlugin({
      cache: false,
      exclude: [/virtual:/, /node_modules/, /sb-preview/],
      failOnError: false, // don't fail build on lint; run `yarn lint` in CI instead
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  server: {
    port: 3000, // Same port as CRA by default
    fs: {
      cachedChecks: false, // Disable cached file checks to ensure Vite resolves updates
    },
  },
  build: {
    outDir: 'build', // Use the same output directory as CRA
  },
});
