import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot } from "react-dom/client";
import React from "react";
import { DarkModeProvider } from "@/Context/DarkModeContext";

createInertiaApp({
  resolve: (name: string) =>
    resolvePageComponent(
      `./Pages/${name}.tsx`,
      import.meta.glob("./Pages/**/*.tsx")
    ),
  setup: ({ el, App, props }) => {
    const root = createRoot(el as HTMLElement);
    root.render(
      <React.StrictMode>
        <DarkModeProvider>
          <App {...props} />
        </DarkModeProvider>
      </React.StrictMode>
    );
  },
});
