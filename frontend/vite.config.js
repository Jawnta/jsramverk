import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

const publicPath = '/~jorp21/editor/';
const cert = './cert.pem'; // Path to your SSL certificate
const key = './key.pem';  // Path to your SSL key

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  base: publicPath
});
