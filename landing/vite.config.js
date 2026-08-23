import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/** Serve Expo export for /demo and /demo/ (Vite SPA otherwise returns landing). */
function expoDemoAlias() {
  const rewrite = (req, _res, next) => {
    const url = req.url?.split('?')[0]
    if (url === '/demo' || url === '/demo/') {
      req.url = '/demo/index.html'
    }
    next()
  }
  return {
    name: 'expo-demo-alias',
    configureServer(server) {
      server.middlewares.use(rewrite)
    },
    configurePreviewServer(server) {
      server.middlewares.use(rewrite)
    }
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), expoDemoAlias()]
})
