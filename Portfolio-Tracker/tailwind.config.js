/* eslint-disable no-mixed-spaces-and-tabs */
/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				jersey: ['Jersey 15', 'sans-serif'],
				Exo2: ['Exo 2', 'sans-serif'],
			  },
		},
	},
	plugins: [],
};
