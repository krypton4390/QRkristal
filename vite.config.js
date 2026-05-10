import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'node:fs'
import path from 'node:path'

function debugLogFallbackPlugin() {
  return {
    name: 'debug-log-fallback',
    configureServer(server) {
      server.middlewares.use('/__agent-debug', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end('Method Not Allowed')
          return
        }

        let body = ''
        req.on('data', (chunk) => {
          body += chunk
        })
        req.on('end', () => {
          try {
            const logPath = path.resolve(process.cwd(), 'debug-bd5589.log')
            const parsed = JSON.parse(body)
            fs.appendFileSync(logPath, `${JSON.stringify(parsed)}\n`, 'utf8')
            res.statusCode = 204
            res.end()
          } catch (_) {
            res.statusCode = 400
            res.end('Bad Request')
          }
        })
      })
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    debugLogFallbackPlugin(),
  ],
})
