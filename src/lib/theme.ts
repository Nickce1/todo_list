export const THEMES = ["bright", "gray", "dark"] as const;

export type Theme = (typeof THEMES)[number];

export const DEFAULT_THEME: Theme = "bright";

export const THEME_STORAGE_KEY = "todolist:theme:v1";

export const THEME_LABELS: Record<Theme, string> = {
  bright: "Bright",
  gray: "Gray",
  dark: "Dark",
};

export function isTheme(value: unknown): value is Theme {
  return value === "bright" || value === "gray" || value === "dark";
}

export function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

export function loadTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return isTheme(stored) ? stored : DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

export function saveTheme(theme: Theme) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // localStorage can throw in private browsing or when quota is exceeded
  }
}

export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t==="bright"||t==="gray"||t==="dark"){document.documentElement.setAttribute("data-theme",t);}}catch(e){}})();`;
