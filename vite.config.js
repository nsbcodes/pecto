import { fileURLToPath, URL } from 'url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
			_bs: fileURLToPath(new URL('./node_modules/bootstrap/scss', import.meta.url)),
		},
	},
	server: {
		host: true,
	},
})
