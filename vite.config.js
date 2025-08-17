import { fileURLToPath, URL } from 'url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from 'vite-plugin-pwa'
import terser from '@rollup/plugin-terser'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		VitePWA({
			injectRegister: 'auto',
			registerType: 'autoUpdate',
			screenshots: [
				{
					src: 'banner_features.png',
					sizes: '1024x512',
					type: 'image/png',
					platform: 'wide',
				},
				{
					src: 'banner_plant.png',
					sizes: '1024x512',
					type: 'image/png',
					platform: 'wide',
				},
				{
					src: 'banner_prism.png',
					sizes: '1024x512',
					type: 'image/png',
					platform: 'wide',
				},
				{
					src: 'banner_sun.png',
					sizes: '1024x512',
					type: 'image/png',
					platform: 'wide',
				},
				{
					src: 'screenshot_assess.png',
					sizes: '2876x1799',
					type: 'image/png',
					platform: 'wide',
				},
				{
					src: 'screenshot_blitz.png',
					sizes: '2880x1800',
					type: 'image/png',
					platform: 'wide',
				},
				{
					src: 'screenshot_comprehend.png',
					sizes: '2879x1799',
					type: 'image/png',
					platform: 'wide',
				},
				{
					src: 'screenshot_extrapolate.png',
					sizes: '2879x1799',
					type: 'image/png',
					platform: 'wide',
				},
				{
					src: 'screenshot_main.png',
					sizes: '2880x1800',
					type: 'image/png',
					platform: 'wide',
				},
				{
					src: 'screenshot_master1.png',
					sizes: '2880x1800',
					type: 'image/png',
					platform: 'wide',
				},
				{
					src: 'screenshot_master2.png',
					sizes: '2879x1799',
					type: 'image/png',
					platform: 'wide',
				},
				{
					src: 'screenshot_top.png',
					sizes: '2880x1800',
					type: 'image/png',
					platform: 'wide',
				},
			],
			manifest: {
				short_name: 'Pecto',
				id: 'pecto/v2.99',
				name: 'Pecto - Procedural Studying Tool',
				launch_handler: 'auto',
				orientation: 'natural',
				description:
					'Study efficiently for free using sophisticated algorithms and local artifical intelligence',
				icons: [
					{ src: '/icon-192.png', type: 'image/png', sizes: '192x192' },
					{ src: '/icon-512.png', type: 'image/png', sizes: '512x512', purpose: 'any' },
					{
						src: '/maskable_icon.png',
						type: 'image/png',
						sizes: '1024x1024',
						purpose: 'maskable',
					},
				],
				start_url: '.',
				display: 'standalone',
				theme_color: '#ffffff',
				background_color: '#ffffff',
			},
		}),
	],
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
	rollupOptions: {
		// output: {
		// 	manualChunks: {},
		// },
		plugins: [terser()],
	},
})
