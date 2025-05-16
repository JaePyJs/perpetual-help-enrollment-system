// src/app/ThemeRegistry.tsx
"use client";

import * as React from "react";
import { useServerInsertedHTML } from "next/navigation";
import { CacheProvider } from "@emotion/react";
import createEmotionCache from "@/lib/createEmotionCache";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { muiTheme, darkMuiTheme } from "@/lib/muiTheme";
import { ThemeProvider, useTheme } from "@/lib/ThemeContext";

// Singleton cache for client-side
let emotionCache: ReturnType<typeof createEmotionCache> | null = null;

/**
 * MUI Theme Registry with SSR support
 *
 * This component:
 * 1. Creates an emotion cache for styling (new for SSR, singleton for client)
 * 2. Inserts styles into HTML for SSR
 * 3. Syncs MUI theme with our custom ThemeContext
 * 4. Provides CssBaseline for consistent styling
 */
export default function ThemeRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  // Create a new cache per request for SSR, fallback to singleton on client
  const [cache] = React.useState(() => {
    if (typeof window === "undefined") {
      return createEmotionCache();
    }
    if (!emotionCache) {
      emotionCache = createEmotionCache();
    }
    return emotionCache;
  });

  // Insert styles into HTML for SSR
  useServerInsertedHTML(() => {
    if (cache.inserted === undefined) return null;
    let styles = "";
    const ids: string[] = [];
    for (const key in cache.inserted) {
      if (cache.inserted.hasOwnProperty(key)) {
        if (typeof cache.inserted[key] === "string") {
          styles += cache.inserted[key];
          ids.push(key);
        }
      }
    }
    if (styles.length === 0) return null;
    return (
      <style
        key={cache.key}
        data-emotion={`${cache.key} ${ids.join(" ")}`}
        dangerouslySetInnerHTML={{ __html: styles }}
      />
    );
  });

  return (
    <CacheProvider value={cache}>
      <ThemeProvider>
        <MuiThemeSync>
          <CssBaseline />
          {children}
        </MuiThemeSync>
      </ThemeProvider>
    </CacheProvider>
  );
}

/**
 * MUI Theme Synchronization Component
 *
 * This component syncs the MUI theme with our custom ThemeContext.
 * It's separated to avoid unnecessary re-renders of the entire tree.
 */
function MuiThemeSync({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const currentMuiTheme = theme === "dark" ? darkMuiTheme : muiTheme;

  return (
    <MuiThemeProvider theme={currentMuiTheme}>{children}</MuiThemeProvider>
  );
}
