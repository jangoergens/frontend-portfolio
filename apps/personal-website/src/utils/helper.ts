export function getUserThemePreference() {
	try {
		const savedTheme = localStorage.getItem("theme");
		if (savedTheme === "dark" || savedTheme === "light") return savedTheme;
	} catch {
		// Fall back to the system preference when storage is unavailable.
	}
	return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
