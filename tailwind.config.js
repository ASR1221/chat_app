/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        "bg-color": "var(--bg-color)",
        "text-color": "var(--text-color)",
        "convo-header-bg-color": "var(--convo-header-bg-color)",
        "convo-header-text-color": "var(--convo-header-text-color)",
        "msg-own-bg-color": "var(--msg-own-bg-color)",
        "msg-other-bg-color": "var(--msg-other-bg-color)",
        "btn-color": "var(--btn-color)",
        "btn-border-color": "var(--btn-border-color)",
        "devider-line-color": "var(--devider-line-color)",
        "red-color": "var(--red-color)",
        "green-color": "var(--green-color)",
      }
    },
  },
  plugins: [],
}
