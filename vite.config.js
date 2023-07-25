import { fileURLToPath, URL } from 'url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), VitePWA()],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
			_bs: fileURLToPath(new URL('./node_modules/bootstrap/scss', import.meta.url)),
		},
	},
	server: {
		host: true,
	},
	// build: {
	// 	rollupOptions: {
	// 		// output: {
	// 		// 	manualChunks: {},
	// 		// },
	// 		plugins: [uglify()],
	// 	},
	// },
})
