"use client";

import { useEffect, useRef, useState } from "react";
import {
  DEFAULT_THEME,
  THEME_LABELS,
  THEMES,
  applyTheme,
  isTheme,
  saveTheme,
  type Theme,
} from "@/lib/theme";

export function ThemeSwitcher() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState<Theme>(DEFAULT_THEME);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");

    if (isTheme(current)) {
      setTheme(current);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  const selectTheme = (nextTheme: Theme) => {
    setTheme(nextTheme);
    applyTheme(nextTheme);
    saveTheme(nextTheme);
    setIsOpen(false);
  };

  return (
    <div ref={rootRef} className="relative">
      {isOpen ? (
        <div
          role="radiogroup"
          aria-label="Color theme"
          className="theme-switcher-spread inline-flex origin-right rounded-xl border border-border bg-surface p-1"
        >
          {THEMES.map((item) => (
            <button
              key={item}
              type="button"
              role="radio"
              data-theme-option={item}
              aria-checked={theme === item}
              onClick={() => selectTheme(item)}
              className="theme-option rounded-lg px-3 py-1.5 text-sm font-medium text-muted transition-colors hover:text-foreground"
            >
              {THEME_LABELS[item]}
            </button>
          ))}
        </div>
      ) : (
        <button
          type="button"
          aria-expanded="false"
          aria-haspopup="true"
          aria-label={`Theme: ${THEME_LABELS[theme]}. Change theme`}
          onClick={() => setIsOpen(true)}
          className="rounded-xl border border-border bg-surface px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-surface-hover"
        >
          {THEME_LABELS[theme]}
        </button>
      )}
    </div>
  );
}
