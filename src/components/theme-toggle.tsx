import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { APP_CONFIG } from "@/lib/config";

interface ThemeToggleProps {
  className?: string;
  variant?: "header" | "floating" | "inline";
}

export function ThemeToggle({ className = "", variant = "header" }: ThemeToggleProps) {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const syncTheme = () => {
      try {
        const stored = localStorage.getItem(APP_CONFIG.backgroundAudio.storageKeyTheme);
        if (stored === "light") {
          setTheme("light");
          document.documentElement.classList.remove("dark");
        } else {
          setTheme("dark");
          document.documentElement.classList.add("dark");
        }
      } catch {
        setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
      }
    };

    syncTheme();

    const handleCustomThemeChange = (event: Event) => {
      const detail = (event as CustomEvent<"light" | "dark">).detail;
      if (detail === "light" || detail === "dark") {
        setTheme(detail);
      } else {
        syncTheme();
      }
    };

    window.addEventListener("tamgiang-theme-change", handleCustomThemeChange);
    window.addEventListener("storage", syncTheme);
    return () => {
      window.removeEventListener("tamgiang-theme-change", handleCustomThemeChange);
      window.removeEventListener("storage", syncTheme);
    };
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);

    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    try {
      localStorage.setItem(APP_CONFIG.backgroundAudio.storageKeyTheme, nextTheme);
    } catch {
      // ignore in incognito
    }

    window.dispatchEvent(new CustomEvent("tamgiang-theme-change", { detail: nextTheme }));
  };

  if (!mounted) {
    return (
      <div
        className={`flex size-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/70 ${className}`}
        aria-hidden="true"
      >
        <Sun className="size-4 text-[#C8ED78]/70" />
      </div>
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`group relative flex size-9 items-center justify-center rounded-lg border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38A875] ${
        variant === "header"
          ? "border-white/10 bg-white/5 text-[#EDF5ED]/90 hover:bg-white/10 hover:text-white hover:border-[#38A875]/40"
          : "border-border bg-card text-foreground hover:bg-muted"
      } ${className}`}
      title={
        isDark ? "Chuyển sang giao diện Sáng (Light Mode)" : "Chuyển sang giao diện Tối (Dark Mode)"
      }
      aria-label={isDark ? "Kích hoạt Light Mode" : "Kích hoạt Dark Mode"}
    >
      <span className="sr-only">{isDark ? "Giao diện sáng" : "Giao diện tối"}</span>
      {isDark ? (
        <Sun className="size-4 text-[#C8ED78] transition-transform duration-300 group-hover:rotate-45 group-hover:scale-110" />
      ) : (
        <Moon className="size-4 text-[#63B77A] transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110" />
      )}
    </button>
  );
}
