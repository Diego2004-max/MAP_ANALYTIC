/**
 * @file vite.config.js
 * @description Vite configuration file with React plugin support.
 */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Frontend running on port 3000
  },
});