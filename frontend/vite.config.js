import { defineConfig } from 'vite'
// import process from "node:process";
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
    "/api/v1": "http://localhost:5000",
    // "/uploads/": "http://localhost:5000"
    }
  }
  // define: {
  //   'process.env': process.env
  // }
});
