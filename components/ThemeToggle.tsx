"use client";

import { useTheme } from "./ThemeProvider";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={[
        "relative flex h-8 w-[54px] shrink-0 cursor-pointer items-center rounded-full border transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8CC63F] focus-visible:ring-offset-2",
        isDark
          ? "border-white/20 bg-white/10 focus-visible:ring-offset-[#0F1115]"
          : "border-black/15 bg-black/8 focus-visible:ring-offset-white",
        className,
      ].join(" ")}
    >
      {/* Track background glow */}
      <span
        className={[
          "absolute inset-0 rounded-full transition-opacity duration-300",
          isDark ? "opacity-100" : "opacity-0",
        ].join(" ")}
        style={{
          background: "linear-gradient(90deg, rgba(140,198,63,0.15) 0%, rgba(140,198,63,0.05) 100%)",
        }}
      />

      {/* Thumb */}
      <span
        className={[
          "relative z-10 flex h-5.5 w-5.5 items-center justify-center rounded-full shadow-md transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
          isDark
            ? "translate-x-[28px] bg-[#8CC63F]"
            : "translate-x-[4px] bg-white border border-black/10",
        ].join(" ")}
        style={{ width: "22px", height: "22px" }}
      >
        {isDark ? (
          // Moon icon
          <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"
              fill="white"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          // Sun icon
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="4" fill="#F59E0B" stroke="#F59E0B" strokeWidth="1" />
            <path
              d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
              stroke="#F59E0B"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        )}
      </span>
    </button>
  );
}