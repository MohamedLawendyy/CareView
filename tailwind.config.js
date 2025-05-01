/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}", // Adjust this path to match your project structure
    ],
    theme: {
        fontFamily: {
            sans: ["Lato", "sans-serif"],
        },
        extend: {
            transitionProperty: {
                margin: "margin",
            },
            backgroundImage: {
                WebsiteBG: "url('../src/assets/images/WebsiteBG.svg')",
            },
            colors: {
                // Define custom background colors
                bg: "#E4E5DB",
                primary: "#D6CFB9",
                secondary: "#152A38",
                third: "#2F5241",
                // Define custom text colors
                textPrimary: "#152A38",
                // Define custom border colors
                borderSec: "#152A38",
                // Define custom text decoration colors
                THI: "#2f5241",
            },
            textDecorationColor: {
                // Define custom text decoration colors
                und: "#152a38",
            },
            textDecorationThickness: {
                // Define custom text decoration thickness
                2: "2px",
            },
        },
    },
    variants: {
        extend: {
            textDecoration: ["hover"], // Enable hover variants for text-decoration
        },
    },
    plugins: [],
};
