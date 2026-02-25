import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // 배포할 때는 레포지토리 이름을 base로 사용하고, 로컬 개발 환경에서는 '/'를 사용합니다.
  base: command === 'build' ? '/personalstylist-studio/' : '/',
  plugins: [react(), tailwindcss()],
}))