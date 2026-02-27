import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // Cloudflare Pages나 일반적인 루트 도메인 배포를 위해 '/'를 사용합니다.
  base: '/',
  plugins: [react(), tailwindcss()],
})