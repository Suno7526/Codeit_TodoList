module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
     boxShadow: {
            'bottom-right-strong': '4px 4px 0px #0F172A',
          }
     },
  },
  plugins: [],
}
