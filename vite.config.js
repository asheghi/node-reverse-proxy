import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import ssr from 'vite-plugin-ssr/plugin'
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const d_dir = dirname(fileURLToPath(import.meta.url));
import postcss from './postcss.config.js'

export default defineConfig({
  css:{
    postcss
  },
  root: d_dir+'/admin',
  plugins: [vue(), ssr()],
  resolve: {
    alias: {
      // '@': join(d_dir, 'src'),
    }
  }
})
