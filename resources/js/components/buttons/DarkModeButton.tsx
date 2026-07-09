import { useEffect, useState } from "react";

export default () => {
    const [dark, setDark] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem("theme");

        if (saved === "dark") {
            document.documentElement.classList.add("dark");
            setDark(true);
        }
    }, []);

    const toggleDarkMode = () => {
        const html = document.documentElement;

        if (html.classList.contains("dark")) {
            html.classList.remove("dark");
            localStorage.setItem("theme", "light");
            setDark(false);
        } else {
            html.classList.add("dark");
            localStorage.setItem("theme", "dark");
            setDark(true);
        }
    };
    
    return <>
        <button
            onClick={toggleDarkMode}
            className="
                px-4 py-2 rounded-lg
                bg-gray-200 dark:bg-gray-800
                text-gray-900 dark:text-white
                transition
            "
        >
            {dark ? "☀️ Modo claro" : "🌙 Modo oscuro"}
        </button>
    </>
}