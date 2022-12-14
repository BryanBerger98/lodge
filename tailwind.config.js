/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: 'class',
	content: [
		"./pages/**/*.{js,ts,jsx,tsx}",
		"./components/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			fontFamily: {
				sans: [ 'Nunito', 'sans-serif' ],
				zapfino: [ 'Zapfino', 'sans-serif' ],
				robotoCondensed: [ 'Roboto Condensed', 'sans-serif' ],
				roboto: [ 'Roboto', 'sans-serif' ],
			},
			colors: {
				light: {
					50: '#f9fafb',
					100: '#f3f4f6',
					200: '#e5e7eb',
					300: '#d1d5db',
					400: '#9ca3af',
					500: '#6b7280',
					600: '#4b5563',
					700: '#374151',
					800: '#1f2937',
					900: '#111827',
				},
				primary: {
					light: {
						default: '#6366f1',
						tint: '#818cf8',
						shade: '#4f46e5',
					},
					dark: {
						default: '#818cf8',
						tint: '#a5b4fc',
						shade: '#6366f1',
					},
					lighter: '#c7d2fe',
					gradient: {
						start: '#4338ca',
						end: '#818cf8',
					},
				},
				secondary: {
					light: {
						default: '#f3f4f6',
						tint: '#f9fafb',
						shade: '#e5e7eb',
					},
					dark: {
						default: '#1f2937',
						tint: '#374151',
						shade: '#111827',
					},
				},
				// danger: {
				// 	light: {
				// 		default: '#ef4444',
				// 		tint: '#f87171',
				// 		shade: '#dc2626',
				// 	},
				// 	dark: {
				// 		default: '#f87171',
				// 		tint: '#fca5a5',
				// 		shade: '#ef4444',
				// 	},
				// },
				danger: { // ROSE
					light: {
						default: '#f43f5e',
						tint: '#fb7185',
						shade: '#e11d48',
					},
					dark: {
						default: '#fb7185',
						tint: '#fda4af',
						shade: '#f43f5e',
					},
				},
				warning: {
					light: {
						default: '#eab308',
						tint: '#facc15',
						shade: '#ca8a04',
					},
					dark: {
						default: '#fbbf24',
						tint: '#fcd34d',
						shade: '#eab308',
					},
				},
				success: {
					light: {
						default: '#22c55e',
						tint: '#4ade80',
						shade: '#16a34a',
					},
					dark: {
						default: '#4ade80',
						tint: '#86efac',
						shade: '#22c55e',
					},
				},
				info: {
					light: {
						default: '#14b8a6',
						tint: '#2dd4bf',
						shade: '#0d9488',
					},
					dark: {
						default: '#2dd4bf',
						tint: '#5eead4',
						shade: '#14b8a6',
					},
				},
				ws: {
					light: {
						50: '#f9fafb',
						100: '#f3f4f6',
						200: '#e5e7eb',
						300: '#d1d5db',
						400: '#9ca3af',
						500: '#6b7280',
						600: '#4b5563',
						700: '#374151',
						800: '#1f2937',
						900: '#111827',
					},
					primary: {
						default: '#EEB902',
					},
					secondary: {
						default: '#1C2745',
					},
					warning: {
					},
				},
			},
			fontSize: {
				'10xl': '10rem',
				'11xl': '12rem',
				'12xl': '16rem',
			},
			lineHeight: {
				'11': '2.75rem',
				'12': '3rem',
				'16': '4rem',
				'20': '5rem',
				'24': '6rem',
			},
		},
	},
	plugins: [],
}
